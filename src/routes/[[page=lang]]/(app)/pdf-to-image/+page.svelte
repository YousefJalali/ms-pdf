<script lang="ts">
	import JSZip from 'jszip'
	import { docs, pages, thumbnails, uploadingDocs } from '$lib/stores'
	import { PageLoadingState } from '$lib/ui'
	import { generateFileName, getPageAsBlob } from '$lib/utils'
	import { writable } from 'svelte/store'
	import Layout from '../(components)/Layout.svelte'
	import OtherTools from '../(components)/OtherTools.svelte'
	import { afterNavigate } from '$app/navigation'
	import type { CreateImage } from '$lib/types'
	import DocList from '../(components)/DocList.svelte'
	import { t } from '$lib/i18n'
	import { Separator } from '$lib/components/ui/separator'

	const defaultFileName = generateFileName('Converted')
	const QUALITY_LABEL: { [ket: number]: string } = {
		25: 'Low Quality',
		50: 'Medium Quality',
		75: 'High Quality',
		100: 'Maximum Quality'
	}
	const IMAGE_FORMATS: ('jpeg' | 'webp' | 'png')[] = ['jpeg', 'png', 'webp']

	let quality = $state(75)
	let imageFormat = $state(IMAGE_FORMATS[0])
	let fileName = $state(defaultFileName)
	let downloaded = $state(false)

	let selected = writable<{ [pageId: string]: boolean }>({})

	function handleSelected(pageId: string) {
		let selectedPages = { ...$selected }

		if (selectedPages[pageId]) {
			delete selectedPages[pageId]
		} else {
			selectedPages[pageId] = true
		}

		selected.set(selectedPages)
	}

	let downloading = $state(false)
	async function downloadHandler() {
		downloading = true

		let blobsPromise = []
		let docNames = []

		for (let doc of Object.values($docs)) {
			for (let pageId in doc.pagesPdfProxy) {
				if (Object.keys($selected).length && !$selected[pageId]) continue

				let pagePdf = doc.pagesPdfProxy[pageId]
				docNames.push(doc.name.split('.')[0])
				blobsPromise.push(getPageAsBlob(pagePdf, (quality * 4) / 100, imageFormat))
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
		// files = null
		downloading = false
		quality = 75
		imageFormat = IMAGE_FORMATS[0]
		selected.set({})
		fileName = generateFileName('Converted')
		downloaded = false
	}

	afterNavigate(() => {
		//if there some uncreated thumbnails, create them
		if (Object.keys($thumbnails).length < $pages.length) {
			let obj: CreateImage = {}
			for (let page of $pages) {
				if (!$thumbnails[page.pageId]) {
					obj[page.pageId] = {
						pdfPage: $docs[page.docId].pagesPdfProxy[page.pageId],
						docId: page.docId
					}
				}
			}

			thumbnails.create(obj)
		}
	})
</script>

<svelte:head>
	<title>PDF to Image</title>
	<meta
		name="description"
		content="Convert PDFs to high-quality images with our free online PDF to image converter. Quickly transform each PDF page into JPG, PNG, or other image formats. No downloads or sign-ups needed. Fast, secure, and easy-to-use—convert your PDFs today!"
	/>
</svelte:head>

{#if downloading}
	<PageLoadingState
		loading
		title={$t('pdfToImage.downloading.title')}
		description={$t('pdfToImage.downloading.description')}
	/>
{:else if downloaded}
	<PageLoadingState
		title={$t('pdfToImage.downloaded.title')}
		description={$t('pdfToImage.downloaded.description')}
	>
		<button class="btn btn-primary btn-outline btn-wide" onclick={reset}>Start Over</button>

		<OtherTools />
	</PageLoadingState>
{:else if !Object.keys($thumbnails).length && $uploadingDocs}
	<PageLoadingState
		loading
		title={$t('pdfToImage.uploading.title')}
		description={$t('pdfToImage.uploading.description')}
	/>
{:else}
	<Layout>
		{#snippet cards()}
			<div
				class="h-full overflow-y-scroll grid auto-rows-min grid-cols-2 min-[460px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-2 lg:gap-4 bg-base-300 pb-14 lg:p-4"
			>
				{#each Object.keys($thumbnails) as pageId}
					<div
						class="relative h-fit bg-base-100 rounded-box py-3 border border-base-300"
						style="opacity: {Object.keys($selected).length && !$selected[pageId] ? 0.5 : 1};"
					>
						<div class="absolute top-2 right-2">
							<input
								type="checkbox"
								checked={$selected[pageId]}
								class="checkbox checkbox-primary bg-base-100"
								onchange={() => handleSelected(pageId)}
							/>
						</div>

						<img
							class="rounded-box w-[200px] h-[200px] object-scale-down"
							src={URL.createObjectURL($thumbnails[pageId].src)}
							alt={pageId}
						/>

						<div
							class="absolute bottom-3 left-1/2 -translate-x-1/2 flex py-0.5 px-2 rounded-btn"
							style="background-color: {$docs[$thumbnails[pageId].docId].color};"
						>
							<span class="text-white relative text-xs"
								>Page {$thumbnails[pageId].pageNumberInDoc}</span
							>
						</div>
					</div>
				{/each}
			</div>
		{/snippet}

		{#snippet side()}
			<div class="font-semibold text-sm">
				Uploaded Docs ({Object.keys($docs).length})
			</div>

			<Separator orientation="horizontal" class="my-2" />

			<div class="w-full h-0 flex-auto p-0 overflow-y-scroll hidden lg:block">
				<DocList />
			</div>

			<div class="divider divider-center opacity-80 text-sm hidden lg:flex">Download Options</div>
			<div class="relative z-10 pb-4 space-y-4">
				<!-- Quality -->
				<div>
					<span class="font-semibold text-xs mb-1 inline-block opacity-60 uppercase">Quality</span>
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
							<label class="label cursor-pointer">
								<span class="label-text uppercase">{format}</span>
								<input
									type="radio"
									class="radio checked:bg-primary"
									bind:group={imageFormat}
									value={format}
									checked={format === imageFormat}
								/>
							</label>
						</div>
					{/each}
				</div>

				<!-- File Name -->
				<div>
					<span class="font-semibold text-xs mb-1 inline-block opacity-60 uppercase">File Name</span
					>
					<div class="w-full text-sm flex items-center gap-2">
						<input
							class="input input-bordered input-sm w-full"
							bind:value={fileName}
							onblur={() => !fileName.length && (fileName = defaultFileName)}
							maxlength="100"
							type="url"
						/>
						.{Object.keys($selected).length === 1 ? imageFormat : 'zip'}
					</div>
					<div class="label">
						<span class="label-text-alt">{`Avoid using: < > : " / \ | ? *`}</span>
					</div>
				</div>
			</div>
		{/snippet}

		{#snippet cta()}
			Convert
		{/snippet}

		{#snippet download()}
			<button class="btn btn-primary flex-1" onclick={downloadHandler}>
				{#if downloading}
					<span class="loading loading-spinner"></span>
				{/if}
				Download
				{Object.keys($selected).length
					? `Selected (${Object.keys($selected).length})`
					: `All (${Object.keys($thumbnails).length} images)`}
			</button>
		{/snippet}
	</Layout>
{/if}
