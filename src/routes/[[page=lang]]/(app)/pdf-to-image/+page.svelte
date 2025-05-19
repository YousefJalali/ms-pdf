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
	import { t } from '$lib/i18n'
	import { Slider } from '$lib/components/ui/slider'
	import Label from '$lib/components/ui/label/label.svelte'
	import * as RadioGroup from '$lib/components/ui/radio-group'
	import Input from '$lib/components/ui/input/input.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Reload } from 'svelte-radix'
	import { ArrowRightLeft, RotateCcw } from 'lucide-svelte'
	import { Checkbox } from '$lib/components/ui/checkbox/index.js'
	import { Badge } from '$lib/components/ui/badge'
	import * as Card from '$lib/components/ui/card/index.js'

	const defaultFileName = generateFileName('Converted')
	const QUALITY_LABEL: { [ket: number]: string } = {
		25: 'Low Quality',
		50: 'Medium Quality',
		75: 'High Quality',
		100: 'Maximum Quality'
	}
	const IMAGE_FORMATS: ('jpeg' | 'webp' | 'png')[] = ['jpeg', 'png', 'webp']

	let quality = $state([75])
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
				blobsPromise.push(getPageAsBlob(pagePdf, (quality[0] * 4) / 100, imageFormat))
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
		quality = [75]
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
		<Button variant="outline" onclick={reset} class="mt-4">
			<RotateCcw class="h-4 w-4 mr-2" />
			Start Over</Button
		>

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
				class="relative overflow-x-hidden lg:rounded-box h-full overflow-y-scroll p-4 pb-28 md:pb-12 lg:pb-4 grid grid-cols-2 min-[460px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4"
			>
				{#each Object.keys($thumbnails) as pageId}
					<Card.Root
						class="h-fit"
						style="opacity: {Object.keys($selected).length && !$selected[pageId] ? 0.5 : 1};"
					>
						<Card.Content class="relative p-2">
							<div class="absolute top-2 right-2">
								<Checkbox
									id={pageId}
									checked={$selected[pageId]}
									onclick={() => handleSelected(pageId)}
								/>
							</div>
							<div class="h-full flex items-center aspect-[180/280]">
								<img
									class="mx-auto h-full object-contain"
									src={URL.createObjectURL($thumbnails[pageId].src)}
									alt={pageId}
									height={200}
								/>
							</div>
						</Card.Content>

						<Card.Footer class="p-2 pt-0">
							<Badge
								class="mx-auto"
								style="background-color: {$docs[$thumbnails[pageId].docId].color};"
							>
								Page {$thumbnails[pageId].pageNumberInDoc}
							</Badge>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		{/snippet}

		{#snippet side()}
			<div class="mt-2">
				<span class="font-semibold leading-none tracking-tight">Download Options</span>
				<p class="text-muted-foreground text-sm line-clamp-1">Adjust the below</p>
			</div>

			<div class="flex flex-col">
				<div class="py-3">
					<div class="flex items-center justify-between mb-2">
						<!-- <Label>Quality</Label> -->
						<span class="text-sm font-medium">Quality</span>
						<span
							class="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm"
						>
							{quality[0]}%
						</span>
					</div>

					<Slider
						id="quality"
						bind:value={quality}
						min={25}
						max={100}
						step={25}
						class="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
						aria-label="quality"
					/>

					<span
						class="text-muted-foreground text-xs font-normal leading-snug ml-auto block w-fit mt-1"
						>{QUALITY_LABEL[quality[0]]}
					</span>
				</div>

				<div class="py-3">
					<span class="text-sm font-medium">Format</span>

					<RadioGroup.Root id="format" bind:value={imageFormat} class="grid grid-cols-3 gap-4 mt-2">
						{#each IMAGE_FORMATS as format}
							<Label
								for={format}
								class="uppercase border-muted bg-popover hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-2"
							>
								<RadioGroup.Item value={format} id={format} class="sr-only" aria-label={format} />

								.{format}
							</Label>
						{/each}
					</RadioGroup.Root>
				</div>

				<div class="py-3">
					<Label for="file-name">File Name</Label>

					<div class="w-full text-sm flex items-center gap-2 mt-2">
						<Input
							id="file-name"
							bind:value={fileName}
							onblur={() => !fileName.length && (fileName = defaultFileName)}
							maxlength={100}
							type="url"
						/>
						.{Object.keys($selected).length === 1 ? imageFormat : 'zip'}
					</div>

					<span class="text-muted-foreground text-xs font-normal leading-snug"
						>{`Avoid using: < > : " / \ | ? *`}</span
					>
				</div>
			</div>

			<div class="mt-auto sm:hidden">
				{@render downloadBtn()}
			</div>
		{/snippet}

		{#snippet cta()}
			<ArrowRightLeft class="size-4 mr-2" />
			Convert
		{/snippet}

		{#snippet download()}
			{@render downloadBtn()}
		{/snippet}
	</Layout>
{/if}

{#snippet downloadBtn()}
	<Button class="w-full" onclick={downloadHandler}>
		{#if downloading}
			<Reload class="mr-2 h-4 w-4 animate-spin" />
		{/if}
		Download
		{Object.keys($selected).length
			? `Selected (${Object.keys($selected).length})`
			: `All (${Object.keys($thumbnails).length} image${Object.keys($thumbnails).length > 1 ? 's' : ''})`}
	</Button>
{/snippet}
