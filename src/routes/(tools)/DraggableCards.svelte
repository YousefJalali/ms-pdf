<script lang="ts">
	import { dndzone, TRIGGERS } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import { docs, pages } from '$lib/stores'
	import type { Page } from '$lib/types'
	import PageCardOptions from './(PageCard)/PageCardOptions.svelte'
	import { more, Popover } from '$lib/ui'

	let popoverRef: Popover
	let selectedPage: Page | null = null
	let optionButtons: { [cardId: string]: HTMLButtonElement } = {}

	function moveItem(arr: Page[], fromIndex: number, toIndex: number) {
		var element = arr[fromIndex]
		arr.splice(fromIndex, 1)
		arr.splice(toIndex, 0, element)
	}

	let oldIndex: number | null
	const flipDurationMs = 300
	function handleDndConsider(e: CustomEvent<DndEvent<Page>>) {
		selectedPage = null

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

	function closeOptionsModal() {
		selectedPage = null
	}
	function openOptionsModal(page: Page) {
		selectedPage = page
	}
</script>

<svelte:window
	on:scroll={() => {
		if (popoverRef) {
			popoverRef.scrollHandler()
		}
	}}
/>

<div
	class="relative overflow-x-hidden border-0 lg:border lg:border-base-300 lg:rounded-box h-full overflow-y-scroll pb-16 lg:p-4"
>
	<div
		class="grid grid-cols-2 min-[460px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4"
		use:dndzone={{
			items: $pages,
			flipDurationMs,
			dropTargetStyle: {}
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
		data-testid="drop zone"
	>
		{#each $pages as page, pageIndex (page.id)}
			<div
				class={`group focus:!outline-none z-0 h-fit relative ${page.isVisible ? 'block' : 'hidden'}`}
				animate:flip={{ duration: flipDurationMs }}
				style={selectedPage && selectedPage?.id !== page.id ? 'opacity:0.7;' : ''}
			>
				{#if page.isVisible}
					<button
						class="btn btn-sm btn-ghost btn-circle bg-base-100 border border-base-300 absolute z-50 right-1 top-1 lg:hidden"
						on:click={() => openOptionsModal(page)}
						bind:this={optionButtons[page.id]}
					>
						{@html more}
					</button>

					<slot {page} {pageIndex} />
				{/if}
			</div>
		{/each}
	</div>

	<Popover
		bind:this={popoverRef}
		id="card-options-mobile"
		data-testid="card-options-mobile"
		selectedItemId={selectedPage?.id}
		itemsElements={optionButtons}
		on:close={() => (selectedPage = null)}
	>
		{#if selectedPage}
			<ul class="menu bg-base-100 shadow">
				<PageCardOptions
					doc={$docs[selectedPage.docId]}
					page={selectedPage}
					on:delete={closeOptionsModal}
					on:preview={closeOptionsModal}
				/>
			</ul>
		{/if}
	</Popover>
</div>
