<script lang="ts">
	import { mergedPdf, previews } from '../../stores/'
	import SideBar from './SideBar.svelte'
	import DropZone from './DropZone.svelte'

	// let scrollY: number
	// $: scrollY = scrollY
	// function scaleValue(value: number, from: number[], to: number[]) {
	// 	console.log(value, from, to)
	// 	let scale = (to[1] - to[0]) / (from[1] - from[0])
	// 	let capped = Math.min(from[1], Math.max(from[0], value)) - from[0]
	// 	return capped * scale + to[0]
	// }
	// $: animateValue = function (
	// 	targetElement: HTMLDivElement,
	// 	scrollPercentage: number[],
	// 	animateRange: number[]
	// ) {
	// 	if (targetElement) {
	// 		return scaleValue(
	// 			((scrollY - targetElement.offsetTop) / targetElement.clientHeight) * 100,
	// 			scrollPercentage,
	// 			animateRange
	// 		)
	// 	}
	// 	return 0
	// }

	// let sections: { [key: string]: HTMLDivElement } = {}

	function downloadPdf() {
		if (!$mergedPdf) return

		const link = document.createElement('a')

		link.href = $mergedPdf.url
		link.download = 'merged-pdf'
		// some browser needs the anchor to be in the doc
		document.body.append(link)
		link.click()
		link.remove()
		// in case the Blob uses a lot of memory
		setTimeout(() => URL.revokeObjectURL(link.href), 7000)
	}
</script>

<!-- <svelte:window bind:scrollY /> -->

<div class="flex gap-8 h-[calc(100vh-100px-32px)]">
	<!-- drag and drop area -->
	{#if $mergedPdf}
		<div class="mx-auto max-w-xl text-center">
			<h1 class="text-4xl font-black mb-4">🎉 Your PDFs Have Been Merged!</h1>
			<p class="opacity-60">
				Your PDF files have been successfully combined into a single document. You can preview the
				merged PDF below.
			</p>
			<div class="mx-auto flex flex-col w-[300px] h-[450px] overflow-y-scroll">
				{#each $mergedPdf.previews as src}
					<img class="h-full" {src} alt="merged" />
				{/each}
			</div>

			<p class="opacity-60 my-4">
				When you're ready, click the button to download your new document.
			</p>
			<div class="flex w-fit mx-auto gap-6">
				<button
					class="border border-red-900 text-red-900 w-fit py-4 px-12 rounded-xl"
					on:click={() => mergedPdf.reset()}>Back to Editing</button
				>
				<button class="bg-red-900 text-white w-fit py-4 px-12 rounded-xl" on:click={downloadPdf}
					>Download</button
				>
			</div>
		</div>
	{:else}
		{#if $previews.length}
			<DropZone />
		{/if}

		<SideBar />
	{/if}
</div>

<!-- {#if mergedPdfUrl}
	<iframe height={250} width={150} src={mergedPdfUrl} title="pdf-viewer"></iframe>
{/if} -->
