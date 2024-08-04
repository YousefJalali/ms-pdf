<script lang="ts">
	import { dndzone, TRIGGERS } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import { mergedPdf, pages } from '$lib/stores'
	import PageCard from './(PageCard)/PageCard.svelte'
	import type { Page } from '$lib/types'

	function moveItem(arr: Page[], fromIndex: number, toIndex: number) {
		var element = arr[fromIndex]
		arr.splice(fromIndex, 1)
		arr.splice(toIndex, 0, element)
	}

	let oldIndex: number | null
	const flipDurationMs = 300
	function handleDndConsider(e: CustomEvent<DndEvent<Page>>) {
		let {
			items,
			info: { trigger, id: pageId }
		} = e.detail

		if (trigger === TRIGGERS.DRAG_STARTED) {
			oldIndex = $pages.findIndex((p) => p.pageId === pageId)
		}

		pages.set(items)
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Page>>) {
		let {
			items,
			info: { id: pageId }
		} = e.detail

		if (typeof oldIndex !== 'number') return pages.set(items)

		let newIndex = items.findIndex((p) => p.pageId === pageId)
		const docId = items[newIndex].docId
		let adjustedIndex = newIndex

		//reposition the moved item
		if (newIndex < items.length - 1) {
			while (adjustedIndex < items.length - 1) {
				if (!items[adjustedIndex + 1].isVisible && items[adjustedIndex + 1].docId !== docId) {
					adjustedIndex++
				} else {
					break
				}
			}

			//move item forward so it wont be in the middle of a doc
			if (adjustedIndex !== newIndex) {
				moveItem(items, newIndex, adjustedIndex)
			}
		}

		//bring other invisible pages
		let numberOfItemsToBeMoved = 0
		let nextPageIndex = oldIndex + (adjustedIndex - oldIndex > 0 ? 0 : 1)
		while (nextPageIndex + numberOfItemsToBeMoved < items.length) {
			let item = items[nextPageIndex + numberOfItemsToBeMoved]
			if (item.docId === items[adjustedIndex].docId && !item.isVisible) {
				numberOfItemsToBeMoved++
			} else {
				break
			}
		}

		if (numberOfItemsToBeMoved) {
			let itemsToBeMoved = [...items.splice(nextPageIndex, numberOfItemsToBeMoved)]

			let newIdx = items.findIndex((p) => p.pageId === pageId)

			items = [...items.slice(0, newIdx + 1), ...itemsToBeMoved, ...items.slice(newIdx + 1)]
		}

		pages.set(items)
		oldIndex = null
	}
</script>

<!-- h-full overflow-y-scroll grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 bg-base-200 rounded-2xl p-2 lg:p-4 -->
<div
	class="relative bg-base-100 border-2 border-dashed border-base-300 rounded-2xl h-full overflow-y-scroll p-2 lg:p-4"
>
	<!-- {#if $mergedPdf.loading}
		<div class="absolute top-0 left-0 w-full h-full z-20">
			<div class="absolute top-0 left-0 w-full h-full bg-base-300 opacity-50" />
			<div class="prose relative h-full text-center flex flex-col justify-center items-center">
				<span class="loading loading-infinity loading-lg"></span>
				<h1>mergeStates.merging.title</h1>
				<p>mergeStates.merging.description</p>
			</div>
		</div>
	{/if} -->

	<div
		class="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4"
		use:dndzone={{ items: $pages, flipDurationMs }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
		data-testid="drop zone"
	>
		{#each $pages as page, pageIndex (page.id)}
			<div
				class={`group h-fit relative ${page.isVisible ? 'block' : 'hidden'}`}
				animate:flip={{ duration: flipDurationMs }}
			>
				{#if page.isVisible}
					<PageCard {page} />
				{/if}
			</div>
		{/each}
	</div>
</div>
