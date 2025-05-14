<script lang="ts">
	import { dndzone, TRIGGERS } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import { docs, pages } from '$lib/stores'
	import type { Page } from '$lib/types'
	import PageCardOptions from './(PageCard)/PageCardOptions.svelte'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import { Button } from '$lib/components/ui/button'
	import { Ellipsis } from 'lucide-svelte'

	interface Props {
		children?: import('svelte').Snippet<[any]>
	}

	let { children }: Props = $props()

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
	class="relative overflow-x-hidden lg:rounded-box h-full overflow-y-scroll p-4 pb-28 md:pb-12 lg:pb-4"
>
	<div
		class="grid grid-cols-2 min-[460px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4"
		use:dndzone={{
			items: $pages,
			flipDurationMs,
			dropTargetStyle: {}
		}}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
		data-testid="drop zone"
	>
		{#each $pages as page, pageIndex (page.id)}
			<div
				class={`group focus:!outline-none z-0 h-fit relative ${page.isVisible ? 'block' : 'hidden'}`}
				animate:flip={{ duration: flipDurationMs }}
			>
				{#if page.isVisible}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								size="icon"
								variant="outline"
								class="h-8 w-8 absolute z-50 right-2 top-2 lg:hidden rounded-lg"
							>
								<Ellipsis class="h-4 w-4" />
								<span class="sr-only">More</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<PageCardOptions
								doc={$docs[page.docId]}
								{page}
								onDelete={() => {}}
								onPreview={() => {}}
							/>
						</DropdownMenu.Content>
					</DropdownMenu.Root>

					{@render children?.({ page, pageIndex })}
				{/if}
			</div>
		{/each}
	</div>
</div>
