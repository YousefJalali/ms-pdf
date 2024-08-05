<script lang="ts">
	import { LINKS, states } from '$lib/constants'
	import { docs, mergedPdf, pages, previews, thumbnails } from '$lib/stores'
	import { backIcon, downloadIcon, startOver } from '$lib/ui'
	import OtherTools from '../../OtherTools.svelte'
	import MergedDocPreview from './MergedDocPreview.svelte'

	let downloaded = false
	let downloading = false

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
</script>

<div
	class="flex flex-col justify-center items-center mx-auto max-w-full lg:max-w-xl text-center prose"
>
	{#if downloading}
		<h1>{states[LINKS.merge].downloading.title}</h1>
		<p>{states[LINKS.merge].downloading.description}</p>
	{:else if downloaded}
		<h1>{states[LINKS.merge].downloaded.title}</h1>
		<p>{states[LINKS.merge].downloaded.description}</p>
		<button class="btn btn-outline btn-wide" on:click={reset}>{@html startOver}Start Over</button>
		<OtherTools />
	{:else}
		<h1>{states[LINKS.merge].merged.title}</h1>
		<p>{states[LINKS.merge].merged.description}</p>
		<div
			data-testid="preview merged"
			class="mx-auto border broder-base-300 w-[380px] max-w-full h-[480px] overflow-y-scroll [&>img]:mx-auto [&>img]:m-0 divide-y-2"
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

		<p>When you're ready, click the button to download your new document.</p>
		<div class="flex w-fit mx-auto gap-4">
			<button class="btn btn-outline" on:click={() => mergedPdf.reset()}
				>{@html backIcon}<span class="hidden lg:inline-block">Back to Editing</span></button
			>
			<button class="btn btn-primary btn-wide" on:click={downloadPdf}
				>Download {@html downloadIcon}</button
			>
		</div>
	{/if}
</div>
