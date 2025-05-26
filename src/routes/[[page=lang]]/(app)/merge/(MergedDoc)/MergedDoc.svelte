<script lang="ts">
	import { beforeNavigate } from '$app/navigation'
	import { Button } from '$lib/components/ui/button'
	import { t } from '$lib/i18n'
	import { docs, mergedPdf, pages, previews, thumbnails } from '$lib/stores'
	import { ArrowLeft, Download, RotateCcw } from 'lucide-svelte'
	import OtherTools from '../../(components)/OtherTools.svelte'
	import MergedDocPreview from './MergedDocPreview.svelte'

	let downloaded = $state(false)
	let downloading = $state(false)

	async function downloadPdf() {
		if (!$mergedPdf.src) return
		downloading = true

		const link = document.createElement('a')

		link.href = $mergedPdf.src
		link.download = 'merged-pdf'
		// some browser needs the anchor to be in the doc
		document.body.append(link)
		link.click()
		link.remove()

		await docs.reset()

		downloading = false
		downloaded = true

		// in case the Blob uses a lot of memory
		setTimeout(() => URL.revokeObjectURL(link.href), 7000)
	}

	function reset() {
		mergedPdf.reset()
		downloaded = false
	}

	beforeNavigate(() => {
		if (!Object.keys($docs).length) {
			mergedPdf.reset()
		}
	})
</script>

<div class="flex flex-col items-center justify-center h-full max-w-lg px-4 mx-auto text-center">
	{#if downloading}
		<h1 class="my-3 text-3xl font-semibold tracking-tight">{$t('merge.downloading.title')}</h1>
		<p class="text-sm text-muted-foreground">{$t('merge.downloading.description')}</p>
	{:else if downloaded}
		<h1 class="my-3 text-3xl font-semibold tracking-tight">{$t('merge.downloaded.title')}</h1>
		<p class="text-sm text-muted-foreground">{$t('merge.downloaded.description')}</p>
		<Button variant="outline" onclick={reset} class="mt-4">
			<RotateCcw class="w-4 h-4 mr-2 pointer-events-none" />
			Start Over
		</Button>
		<OtherTools />
	{:else}
		<h1 class="my-4 text-3xl font-semibold tracking-tight">{$t('merge.merged.title')}</h1>
		<p class="text-sm text-muted-foreground">{$t('merge.merged.description')}</p>
		<div
			data-testid="preview merged"
			class="my-8 mx-auto border w-[380px] h-[480px] overflow-y-scroll [&>img]:mx-auto [&>img]:m-0 divide-y-2"
		>
			{#each $pages as page}
				<MergedDocPreview
					largeImage={$previews[page.pageId]?.src}
					smallImage={$thumbnails[page.pageId]?.src}
					docName={$docs[page.docId].name}
					{page}
				/>
			{/each}
		</div>

		<p class="text-sm text-muted-foreground">
			When you're ready, click the button to download your new document.
		</p>
		<div class="flex gap-4 mx-auto my-4 w-fit">
			<Button class="gap-2" variant="outline" onclick={() => mergedPdf.reset()}>
				<ArrowLeft class="w-4 h-4 pointer-events-none" />
				<span class="hidden lg:inline-block">Back to Editing</span></Button
			>
			<Button onclick={downloadPdf}
				>Download <Download class="w-4 h-4 ml-2 pointer-events-none" /></Button
			>
		</div>
	{/if}
</div>
