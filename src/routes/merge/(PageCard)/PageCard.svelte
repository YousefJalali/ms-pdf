<script lang="ts">
	import { docs, pageNum, pages } from '$lib/stores/merge'
	import type { Page } from '$lib/types'
	import Actions from '../Actions.svelte'
	import PageCardThumbnail from './PageCardThumbnail.svelte'

	export let page: Page

	$: doc = $docs[page.docId]
	$: pageNumber = $pageNum[page.pageId]
	$: multiPages = typeof pageNumber === 'number' ? false : true
</script>

{#if doc && page}
	{#if multiPages}
		<div
			class="absolute -top-1.5 -left-1.5 h-full w-full bg-base-200 rounded-xl border border-base-300"
			data-testid="page stack"
		/>
	{/if}

	<div
		class={`relative z-10 flex flex-col justify-between bg-base-200 border border-base-400 p-3 rounded-xl w-[180px] h-[280px] ${multiPages ? 'shadow-sm' : ''}`}
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

		<div class="absolute top-0 left-0 w-full p-2 py-3 hidden group-hover:flex mx-auto">
			<Actions {doc} {page} on:delete={() => pages.removePage(page.pageId)} />
		</div>
	</div>
{/if}
