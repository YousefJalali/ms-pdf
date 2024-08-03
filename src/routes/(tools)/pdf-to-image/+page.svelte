<script lang="ts">
	import JSZip from 'jszip'
	import { page } from '$app/stores'
	import { docs, thumbnails, uploadingDocs, alerts } from '$lib/stores'
	import { DocItem, FileInput } from '$lib/ui'
	import UploadButton from '$lib/ui/UploadButton.svelte'
	import { getPageAsBlob } from '$lib/utils'
	import { writable } from 'svelte/store'
	import { beforeNavigate } from '$app/navigation'
	import { convertStates, MAX_FILE_UPLOAD, TOOLS } from '$lib/constants/'

	const generateFileName = () =>
		`Converted-PDF-${new Date()
			.toLocaleString()
			.split(',')[0]
			.replaceAll('/', '')}-${new Date().toLocaleTimeString().split(' ')[0].replaceAll(':', '')}`

	const defaultFileName = generateFileName()
	const QUALITY_LABEL: { [ket: number]: string } = {
		25: 'Low Quality',
		50: 'Medium Quality',
		75: 'High Quality',
		100: 'Maximum Quality'
	}

	let files: FileList | null

	let IMAGE_FORMATS: ('jpeg' | 'webp' | 'png')[] = ['jpeg', 'png', 'webp']
	let quality = 75
	let imageFormat = IMAGE_FORMATS[0]
	let fileName = defaultFileName
	let downloaded = false

	let selected = writable<{ [pageId: string]: boolean }>({})

	const maxFileReached = () =>
		alerts.add('error', `The maximum number of files you can upload is ${MAX_FILE_UPLOAD}`)

	$: if (files) {
		let count = Object.keys($docs).length

		if (count < MAX_FILE_UPLOAD) {
			for (const file of files) {
				count++
				if (count > MAX_FILE_UPLOAD) {
					maxFileReached()
					break
				} else {
					docs.create(file, true)
				}
			}
			files = null
		} else {
			maxFileReached()
		}
	}

	function handleSelected(pageId: string) {
		let selectedPages = { ...$selected }

		if (selectedPages[pageId]) {
			delete selectedPages[pageId]
		} else {
			selectedPages[pageId] = true
		}

		selected.set(selectedPages)
	}

	let downloading = false
	async function download() {
		downloading = true

		let blobsPromise = []
		let docNames = []

		for (let doc of Object.values($docs)) {
			for (let pageId in doc.pagesPdfProxy) {
				if (Object.keys($selected).length && !$selected[pageId]) continue

				let pagePdf = doc.pagesPdfProxy[pageId]
				docNames.push(doc.name.split('.')[0])
				blobsPromise.push(getPageAsBlob(pagePdf, pageId, (quality * 4) / 100, true, imageFormat))
			}
		}

		if (!blobsPromise.length) return

		let blob: Blob | null = null

		let blobs = await Promise.all(blobsPromise)

		if (blobs.length === 1) {
			if (blobs[0] instanceof Blob) {
				blob = blobs[0]
			}
		} else {
			const zip = new JSZip()

			let i = 0
			for (let blob of blobs) {
				if (blob instanceof Blob) {
					zip.file(`${docNames[i]} (${i + 1}).${imageFormat}`, blob, {
						base64: true
					})

					i++
				}
			}

			blob = await zip.generateAsync({ type: 'blob' })
		}

		if (!blob) return

		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = fileName
		document.body.append(link)
		link.click()
		link.remove()

		await docs.reset()

		downloading = false
		downloaded = true
		// reset()
	}

	function reset() {
		files = null
		downloading = false
		quality = 75
		imageFormat = IMAGE_FORMATS[0]
		selected.set({})
		fileName = generateFileName()
		downloaded = false
	}

	// beforeNavigate(({ cancel }) => {
	// 	if (Object.keys($docs).length) {
	// 		if (
	// 			!confirm(
	// 				'Are you sure you want to leave this page? You have unsaved changes that will be lost.'
	// 			)
	// 		) {
	// 			cancel()
	// 		} else {
	// 			docs.reset()
	// 			reset()
	// 		}
	// 	}
	// })
</script>

<!-- <div class="flex gap-8 h-[calc(100vh-100px-32px-25px)]"></div> -->
<!-- <div class="flex gap-8 lg:h-[calc(100vh-100px-32px-25px)] lg:overflow-hidden p-6 lg:p-0"> -->
{#if downloading}
	<div class="prose flex flex-col items-center justify-center mx-auto text-center">
		<span class="loading loading-ring loading-lg mb-4"></span>
		<h1>{convertStates.downloading.title}</h1>
		<p>{convertStates.downloading.description}</p>
	</div>
{:else if downloaded}
	<div class="prose flex flex-col items-center justify-center mx-auto text-center">
		<h1>{convertStates.downloaded.title}</h1>
		<p>{convertStates.downloaded.description}</p>

		<button class="btn btn-primary btn-outline btn-wide" on:click={reset}>Start Over</button>

		<p>or explore other amazing tools we offer!</p>

		<div class="flex flex-wrap gap-4 mt-6">
			{#each TOOLS.filter((tool) => tool.link !== $page.url.pathname) as tool}
				<a href={tool.link} class="btn [&>svg]:size-6">{@html tool.icon} {tool.name}</a>
			{/each}
		</div>
	</div>
{:else if !Object.keys($thumbnails).length && $uploadingDocs}
	<div class="prose flex flex-col items-center justify-center mx-auto text-center">
		<span class="loading loading-ring loading-lg mb-4"></span>
		<h1>{convertStates.uploading.title}</h1>
		<p>{convertStates.uploading.description}</p>
	</div>
{:else if Object.keys($thumbnails).length}
	<div class="flex gap-8 pb-8 lg:pb-0">
		<div
			class="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 bg-base-200 rounded-2xl p-2 lg:p-4 overflow-y-scroll"
		>
			{#each Object.keys($thumbnails) as pageId}
				<div
					class="relative h-fit bg-white rounded-xl py-3 border"
					style="opacity: {Object.keys($selected).length && !$selected[pageId] ? 0.5 : 1};"
				>
					<div class="absolute top-2 right-2">
						<input
							type="checkbox"
							checked={$selected[pageId]}
							class="checkbox checkbox-primary"
							on:change={() => handleSelected(pageId)}
						/>
					</div>

					<img
						class="rounded-xl w-[200px] h-[200px] object-scale-down"
						src={URL.createObjectURL($thumbnails[pageId].src)}
						alt={pageId}
					/>

					<div
						class="absolute bottom-3 left-1/2 -translate-x-1/2 flex py-0.5 px-2 rounded-xl"
						style="background-color: {$docs[$thumbnails[pageId].docId].color};"
					>
						<span class="text-white relative text-xs"
							>Page {$thumbnails[pageId].pageNumberInDoc}</span
						>
					</div>
				</div>
			{/each}
		</div>

		<!-- Side -->
		<div
			class="flex w-full border bg-base-100 flex-col rounded-2xl p-4 fixed bottom-0 left-0 z-10 lg:w-80 lg:relative"
		>
			<input type="checkbox" id="download-options" class="hidden peer" />
			<!-- <label
				for="download-options"
				class="hidden z-0 h-screen w-screen fixed top-0 left-0 bg-black opacity-40 peer-checked:block"
			></label> -->
			<div class="flex-1 hidden lg:flex lg:flex-col peer-checked:block">
				<label for="download-options" class="btn btn-xs ml-auto flex w-fit lg:hidden">✕ </label>
				<div class="mb-4 hidden lg:block">
					<UploadButton bind:files />
				</div>

				<div class="divider divider-center opacity-80 text-sm hidden lg:flex">
					Uploaded Docs ({Object.keys($docs).length})
				</div>
				<ul
					class="w-full h-0 flex-auto p-0 overflow-y-scroll hidden lg:block"
					data-testid="doc list"
				>
					{#each Object.values($docs) as doc}
						<DocItem {doc} />
					{/each}
				</ul>

				<div class="divider divider-center opacity-80 text-sm hidden lg:flex">Download Options</div>
				<div class="relative z-10 pb-4 space-y-4">
					<!-- Quality -->
					<div>
						<span class="font-semibold text-xs mb-1 inline-block opacity-60 uppercase">Quality</span
						>
						<input
							bind:value={quality}
							type="range"
							min="25"
							max="100"
							class="range range-xs range-primary"
							step="25"
						/>
						<div class="flex w-full justify-between text-xs">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span>{QUALITY_LABEL[quality]}</span>
						</div>
					</div>

					<!-- Format -->
					<div>
						<span class="font-semibold text-xs mb-1 inline-block opacity-60 uppercase">type</span>
						{#each IMAGE_FORMATS as format}
							<div class="form-control">
								<label class="label cursor-pointer checked:bg-base-300">
									<span class="label-text uppercase">{format}</span>
									<input
										type="radio"
										name="image format"
										class="radio checked:bg-primary"
										bind:group={imageFormat}
										value={format}
									/>
								</label>
							</div>
						{/each}
					</div>

					<!-- File Name -->
					<div>
						<span class="font-semibold text-xs mb-1 inline-block opacity-60 uppercase"
							>File Name</span
						>
						<div class="w-full text-sm flex items-center gap-2">
							<input
								class="input input-bordered input-sm w-full"
								bind:value={fileName}
								on:blur={() => !fileName.length && (fileName = defaultFileName)}
								maxlength="100"
								type="url"
							/>
							.{Object.keys($selected).length === 1 ? imageFormat : 'zip'}
						</div>
						<div class="label">
							<span class="label-text-alt">{`Avoid using: < > : " / \ | ? *`}</span>
							<!-- <span class="label-text-alt">{fileName.length}/100</span> -->
						</div>
					</div>
				</div>
			</div>

			<div class="flex mt-2 gap-2">
				<label for="download-options" class="btn btn-square lg:hidden"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
					</svg>
				</label>

				<button class="btn btn-primary flex-1" on:click={download}>
					{#if downloading}
						<span class="loading loading-spinner"></span>
					{/if}
					Download
					{Object.keys($selected).length ? `Selected (${Object.keys($selected).length})` : 'All'}
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="flex flex-col items-center justify-center">
		<!-- description  -->
		<div class="mb-8 prose prose-sm lg:prose-lg max-w-none text-center">
			<h1>{convertStates.upload.title}</h1>
			<p>{convertStates.upload.description}</p>
		</div>

		<FileInput bind:files />
	</div>
{/if}
<!-- </div> -->
