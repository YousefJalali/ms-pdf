<script lang="ts">
	import { docs, pageNum, pages } from '$lib/stores'
	import type { Page } from '$lib/types'
	import { moreVertical } from '$lib/ui'
	import PageCardOptions from './PageCardOptions.svelte'
	import PageCardThumbnail from './PageCardThumbnail.svelte'

	export let page: Page
	export let pageIndex: number

	const RATIO = 180 / 280

	const scaleY = (100 - RATIO * 4) / 100
	const scaleX = (100 - 4) / 100

	const translateY = (100 * (1 - scaleY)) / 2
	const translateX = (100 * (1 - scaleX)) / 2

	$: doc = $docs[page.docId]
	$: pageNumber = $pageNum[page.pageId]
	$: multiPages = typeof pageNumber === 'number' ? false : true
</script>

{#if doc && page}
	{#if multiPages}
		<div
			class="absolute top-0 left-0 h-full w-full bg-base-200 rounded-box border border-base-300"
			style="height: {100 - translateY}%; width: {100 - translateX}%"
			data-testid="page stack"
		/>
	{/if}

	<div
		class={`relative z-10 flex flex-col justify-between bg-base-200 border border-base-400 p-3 rounded-box aspect-[180/280] shadow-sm`}
		style={multiPages
			? `transform: scale(${scaleX}, ${scaleY}) translate(${translateX}%, ${translateY}%);`
			: ''}
	>
		<!-- Document Color -->
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1/2 rounded-b-box"
			style="background-color: {doc.color};"
		/>

		<!-- Thumbnail -->
		<div data-testid="thumbnail" class="h-full flex items-center">
			<PageCardThumbnail {page} />
		</div>

		<!-- Document name & page number in $pages -->
		<div class="text-center text-sm flex flex-col mt-2">
			<span class="truncate">{doc.name} </span>
			<span class="opacity-70 text-xs mt-1">
				Page
				{typeof pageNumber === 'number' ? pageNumber : `${pageNumber[0]} to ${pageNumber[1]}`}
			</span>
		</div>

		<!----------- Options ------------>
		<!-- desktop -->
		<div
			data-testid="card-options-desktop"
			class="absolute top-2 left-0 w-full hidden lg:group-hover:inline-flex"
		>
			<ul class="bg-neutral text-neutral-content menu menu-horizontal rounded-box mx-auto p-1">
				<PageCardOptions {doc} {page} on:delete={() => pages.deletePage(page.pageId)} />
			</ul>
		</div>

		<!-- mobile -->
	</div>
{/if}
