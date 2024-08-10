<script lang="ts">
	import { dndzone, TRIGGERS } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import { pages } from '$lib/stores'
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
				if (!items[adjustedIndex + 1].isVisible) {
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

<div
	class="relative overflow-x-hidden bg-base-100 border-0 lg:border-2 border-dashed border-base-300 lg:rounded-2xl h-full overflow-y-scroll pb-8 p-2 lg:p-4"
>
	<div
		class="grid grid-cols-2 lg:grid-cols-4 gap-4"
		use:dndzone={{ items: $pages, flipDurationMs }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
		data-testid="drop zone"
	>
		{#each $pages as page, pageIndex (page.id)}
			<div
				class={`group z-0 h-fit relative ${page.isVisible ? 'block' : 'hidden'}`}
				animate:flip={{ duration: flipDurationMs }}
			>
				<slot {page} {pageIndex} />
			</div>
		{/each}
	</div>
</div>
