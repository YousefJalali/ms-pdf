<script lang="ts">
	import JSZip from 'jszip'
	import { docs, thumbnails, uploadingDocs } from '$lib/stores/convert'
	import { DocItem, FileInput } from '$lib/ui'
	import UploadButton from '$lib/ui/UploadButton.svelte'
	import { getPageAsBlob } from '$lib/utils'
	import { writable } from 'svelte/store'
	import { beforeNavigate } from '$app/navigation'
	import { MAX_FILE_UPLOAD } from '$lib/constants'
	import { alerts } from '$lib/stores/alerts'

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

	let selected = writable<{ [pageId: string]: boolean }>({})

	const maxFileReached = () =>
		alerts.add('error', `The maximum number of files you can upload is ${MAX_FILE_UPLOAD}`)

	$: if (files) {
		let count = 0
		if (Object.keys($docs).length < MAX_FILE_UPLOAD) {
			for (const file of files) {
				count++
				if (count > MAX_FILE_UPLOAD) {
					maxFileReached()
				} else {
					docs.add(file)
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

		await docs.destroyAll()

		reset()
	}

	function reset() {
		files = null
		downloading = false
		quality = 75
		imageFormat = IMAGE_FORMATS[0]
		selected.set({})
		fileName = generateFileName()
	}

	beforeNavigate(({ cancel }) => {
		if (Object.keys($docs).length) {
			if (
				!confirm(
					'Are you sure you want to leave this page? You have unsaved changes that will be lost.'
				)
			) {
				cancel()
			} else {
				docs.destroyAll()
				reset()
			}
		}
	})
</script>

<!-- <div class="flex gap-8 h-[calc(100vh-100px-32px-25px)]"></div> -->
<div class="flex gap-8 h-[calc(100vh-100px-32px-25px)]">
	{#if !Object.keys($thumbnails).length && $uploadingDocs}
		<div class="prose flex flex-col items-center justify-center mx-auto text-center">
			<span class="loading loading-ring loading-lg mb-4"></span>
			<h1>Uploading Your PDFs...</h1>
			<p>
				Your PDFs are being uploaded. Please wait a moment while we securely transfer your
				documents. Once the upload is complete, you'll be able to convert them into high-quality JPG
				images.
			</p>
		</div>
	{:else if Object.keys($thumbnails).length}
		<div class="flex gap-8">
			<div class="grid grid-cols-3 gap-4 bg-base-200 rounded-2xl p-4 overflow-y-scroll">
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
							<span class="text-white relative text-xs">Page {$thumbnails[pageId].pageNumber}</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="min-w-80 border flex flex-col rounded-2xl p-4">
				<div class="mb-4">
					<UploadButton bind:files />
				</div>

				<div class="divider divider-center opacity-80 text-sm">Uploaded Docs</div>
				<ul class="w-full h-0 flex-auto p-0 overflow-y-scroll" data-testid="doc list">
					{#each Object.values($docs) as doc}
						<DocItem {doc} />
					{/each}
				</ul>

				<div class="divider divider-center opacity-80 text-sm">Download Options</div>

				<!-- Quality -->
				<div class="pb-4 space-y-4">
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

				<button class="btn btn-primary mt-2" on:click={download}>
					{#if downloading}
						<span class="loading loading-spinner"></span>
					{/if}
					Download
					{Object.keys($selected).length ? `Selected (${Object.keys($selected).length})` : 'All'}
				</button>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center">
			<!-- description  -->
			<div class="mb-8 prose max-w-none">
				<h1>Convert Your PDFs to Images Effortlessly!</h1>
				<p>
					Quickly transform your PDF files into high-quality images. Simply upload your documents
					below, and easily convert single pages or entire PDFs in just a few clicks!
				</p>
			</div>

			<FileInput bind:files />
		</div>
	{/if}
</div>
