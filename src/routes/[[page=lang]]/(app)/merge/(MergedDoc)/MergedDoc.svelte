<script lang="ts">
	import { beforeNavigate } from '$app/navigation'
	import { Button } from '$lib/components/ui/button'
	import { t } from '$lib/i18n'
	import { docs, mergedPdf, pages, previews, thumbnails } from '$lib/stores'
	import { startOver } from '$lib/ui'
	import { ArrowLeft, Download } from 'lucide-svelte'
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

<div
	class="flex flex-col justify-center items-center mx-auto max-w-full lg:max-w-xl text-center prose mt-6"
>
	{#if downloading}
		<h1 class="font-semibold tracking-tight text-3xl my-3">{$t('merge.downloading.title')}</h1>
		<p class="text-muted-foreground text-sm">{$t('merge.downloading.description')}</p>
	{:else if downloaded}
		<h1 class="font-semibold tracking-tight text-3xl my-3">{$t('merge.downloaded.title')}</h1>
		<p class="text-muted-foreground text-sm">{$t('merge.downloaded.description')}</p>
		<button class="btn btn-outline btn-wide" onclick={reset}>{@html startOver}Start Over</button>
		<OtherTools />
	{:else}
		<h1 class="font-semibold tracking-tight text-3xl my-3">{$t('merge.merged.title')}</h1>
		<p class="text-muted-foreground text-sm">{$t('merge.merged.description')}</p>
		<div
			data-testid="preview merged"
			class="my-8 mx-auto border broder-base-300 w-[380px] max-w-full h-[480px] overflow-y-scroll [&>img]:mx-auto [&>img]:m-0 divide-y-2"
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

		<p class="text-muted-foreground text-sm">
			When you're ready, click the button to download your new document.
		</p>
		<div class="flex w-fit mx-auto gap-4 mt-6">
			<Button class="gap-2" variant="outline" onclick={() => mergedPdf.reset()}>
				<ArrowLeft class="h-4 w-4" />
				<span class="hidden lg:inline-block">Back to Editing</span></Button
			>
			<Button onclick={downloadPdf}>Download <Download class="ml-2 h-4 w-4" /></Button>
		</div>
	{/if}
</div>
