<script lang="ts">
	import { mergeStates } from '$lib/constants'
	import { docs, mergedPdf, pages, previews, thumbnails } from '$lib/stores'
	import { backIcon, downloadIcon, startOver } from '$lib/ui'
	import MergedDocPreview from './MergedDocPreview.svelte'

	let downloaded = false
	let preparingLink = false

	async function downloadPdf() {
		if (!$mergedPdf.src) return
		preparingLink = true

		const link = document.createElement('a')

		link.href = $mergedPdf.src
		link.download = 'merged-pdf'
		// some browser needs the anchor to be in the doc
		document.body.append(link)
		link.click()
		link.remove()

		await docs.reset()

		preparingLink = false
		downloaded = true

		// in case the Blob uses a lot of memory
		setTimeout(() => URL.revokeObjectURL(link.href), 7000)
	}

	function reset() {
		docs.reset()
		downloaded = false
	}
</script>

<div class="flex flex-col justify-center items-center mx-auto max-w-xl text-center prose">
	{#if preparingLink}
		<h1>{mergeStates.downloading.title}</h1>
		<p>{mergeStates.downloading.description}</p>
	{:else if downloaded}
		<h1>{mergeStates.downloaded.title}</h1>
		<p>{mergeStates.downloaded.description}</p>
		<button class="btn btn-outline btn-wide" on:click={reset}>{@html startOver}Start Over</button>
	{:else}
		<h1>{mergeStates.merged.title}</h1>
		<p>{mergeStates.merged.description}</p>
		<div
			data-testid="preview merged"
			class="mx-auto border broder-base-300 w-[380px] h-[480px] overflow-y-scroll [&>img]:mx-auto [&>img]:m-0 divide-y-2"
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
				>{@html backIcon}Back to Editing</button
			>
			<button class="btn btn-primary btn-wide" on:click={downloadPdf}
				>Download {@html downloadIcon}</button
			>
		</div>
	{/if}
</div>
