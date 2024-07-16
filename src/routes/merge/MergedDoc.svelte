<script lang="ts">
	import { docs, mergedPdf, pages, thumbnails } from '../../stores/'

	let downloaded = false
	let preparingLink = false

	function downloadPdf() {
		if (!$mergedPdf.src) return
		preparingLink = true

		const link = document.createElement('a')

		link.href = $mergedPdf.src
		link.download = 'merged-pdf'
		// some browser needs the anchor to be in the doc
		document.body.append(link)
		link.click()
		link.remove()

		setTimeout(() => {
			preparingLink = false
			downloaded = true
		}, 2000)
		// in case the Blob uses a lot of memory
		setTimeout(() => URL.revokeObjectURL(link.href), 7000)
	}

	function reset() {
		mergedPdf.reset()
		docs.reset()
		downloaded = false
	}

	const backIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
</svg>`

	const downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
</svg>`

	const startOver = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="size-6"><path d="M12 10 6 6.5 12 3v3a7 7 0 1 1-7 7h.933A6.067 6.067 0 1 0 12 6.933z"></path></svg>`
</script>

<div class="flex flex-col justify-center items-center mx-auto max-w-xl text-center prose">
	{#if preparingLink}
		<h1>⏳ Preparing Your Download Link...</h1>
		<p>
			Please wait a moment while we generate the download link for your merged PDF. This should only
			take a few seconds.
		</p>
	{:else if downloaded}
		<h1>✅ Download Complete!</h1>
		<p>
			Your merged PDF has been successfully downloaded. Thank you for using our service! If you have
			any other documents to combine, feel free to merge more PDFs anytime.
		</p>
		<button class="btn btn-outline btn-wide" on:click={reset}>{@html startOver}Start Over</button>
	{:else}
		<h1>🎉 Your PDFs Have Been Merged!</h1>
		<p>
			Your PDF files have been successfully combined into a single document. You can preview the
			merged PDF below.
		</p>
		<div class="mx-auto border broder-base-300 flex flex-col w-[300px] h-[450px] overflow-y-scroll">
			{#each $pages as page}
				{#if $thumbnails[page.pageId].preview.status === 'loading'}
					<img
						class="h-full object-contain"
						src={$thumbnails[page.pageId].thumbnail.src}
						alt="merged"
					/>
				{:else}
					<img
						class="h-full object-contain"
						src={$thumbnails[page.pageId].preview.src}
						alt="merged"
					/>
				{/if}
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
