<script lang="ts">
	import { mergedPdf, pages } from '../../stores/'
	import SideBar from './(SideBard)/SideBar.svelte'
	import DropZone from './DropZone.svelte'
	import MergedDoc from './MergedDoc.svelte'

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
</script>

<!-- <svelte:window bind:scrollY /> -->

<div class="flex gap-8 h-[calc(100vh-100px-32px-25px)]">
	<!-- drag and drop area -->
	{#if $mergedPdf.src}
		<MergedDoc />
	{:else}
		{#if $pages.length}
			<DropZone />
		{/if}

		<SideBar />
	{/if}
</div>

<!-- {#if mergedPdfUrl}
	<iframe height={250} width={150} src={mergedPdfUrl} title="pdf-viewer"></iframe>
{/if} -->
