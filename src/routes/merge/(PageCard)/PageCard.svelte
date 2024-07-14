<script lang="ts">
	import { docs, pageNum } from '../../../stores'
	import type { Page } from '../../../types'
	import PageCardActions from './PageCardActions.svelte'
	import PageCardThumbnail from './PageCardThumbnail.svelte'

	export let page: Page

	$: doc = $docs[page.docId]
	$: pageNumber = $pageNum[page.pageId]
</script>

{#if doc && page}
	<div
		class={`relative group flex flex-col justify-between bg-gray-200 p-3 rounded-xl w-[180px] h-[280px] overflow-hidden`}
	>
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1/2 rounded-b-xl"
			style="background-color: {doc.color};"
		/>

		<PageCardThumbnail {page} />

		<div class="text-center text-sm flex flex-col">
			<span class="truncate">{doc.name} </span>
			<span class="opacity-40 text-xs mt-1">
				Page
				{typeof pageNumber === 'number' ? pageNumber : `${pageNumber[0]} to ${pageNumber[1]}`}
			</span>
			<!-- <span>{doc.showPages} / {page.pageVisible}</span> -->
		</div>
		<!-- <canvas bind:this={canvases[page.docId]} id={page.docId} height="1" width="1"></canvas> -->

		<PageCardActions {doc} {page} />
	</div>
{/if}
