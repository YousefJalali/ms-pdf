<script lang="ts">
	import { docs, pageNum, pages } from '$lib/stores'
	import type { Page } from '$lib/types'
	import PageCardOptions from './PageCardOptions.svelte'
	import PageCardThumbnail from './PageCardThumbnail.svelte'

	interface Props {
		page: Page;
	}

	let { page }: Props = $props();

	const RATIO = 180 / 280

	const scaleY = (100 - RATIO * 4) / 100
	const scaleX = (100 - 4) / 100

	const translateY = (100 * (1 - scaleY)) / 2

	let doc = $derived($docs[page.docId])
	let pageNumber = $derived($pageNum[page.pageId])
	let multiPages = $derived(typeof pageNumber === 'number' ? false : true)
</script>

{#if doc && page}
	<div
		class="{multiPages
			? 'block'
			: 'hidden'} absolute top-0 left-0 h-full w-full bg-base-200 rounded-box border border-base-300"
		style={`transform: scaleX(${scaleX});`}
		data-testid="page stack"
	></div>

	<div
		class={`relative z-10 flex flex-col justify-between bg-base-100 p-3 rounded-box aspect-[180/280] shadow-sm`}
		style={multiPages ? `transform: scaleY(${scaleY}) translateY(-${translateY}%);` : ''}
	>
		<!-- Document Color -->
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1/2 rounded-b-box"
			style="background-color: {doc.color};"
		></div>

		<!-- Thumbnail -->
		<div data-testid="thumbnail" class="h-full flex items-center">
			<PageCardThumbnail {page} />
		</div>

		<!-- Document name & page number in $pages -->
		<div class="text-center text-sm flex flex-col mt-2 text-neutral/80">
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
				<PageCardOptions {doc} {page} />
			</ul>
		</div>

		<!-- mobile -->
	</div>
{/if}
