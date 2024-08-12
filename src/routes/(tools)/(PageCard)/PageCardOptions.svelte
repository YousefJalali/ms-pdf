<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { pages, previewModal } from '$lib/stores'
	import type { Doc, Page } from '$lib/types'
	import { rotate, trash, zoom } from '$lib/ui'

	export let doc: Doc
	export let page: Page
	// export let pageIndex: number

	const dispatch = createEventDispatcher()

	function onDelete() {
		pages.deletePage(page.pageId)
		dispatch('delete')
	}

	function onPreview() {
		previewModal.show($pages.findIndex((p) => p.pageId === page.pageId))
		dispatch('preview')
	}

	function onRotate() {
		pages.rotate(page.pageId, 90)
		dispatch('rotate')
	}

	const actions = [
		{
			label: 'preview',
			icon: zoom,
			action: onPreview,
			dataTip: 'Preview',
			dataTestId: 'card-preview'
		},
		{
			label: 'rotate',
			icon: rotate,
			action: onRotate,
			dataTip: doc.pageCount <= 1 || doc.showPages ? 'Rotate Page' : 'Rotate Document',
			dataTestId: 'card-rotate'
		},
		{
			label: 'delete',
			icon: trash,
			action: onDelete,
			dataTip: doc.pageCount <= 1 || doc.showPages ? 'Delete Page' : 'Delete Document',
			dataTestId: 'card-delete'
		}
	]
</script>

{#each actions as { label, action, icon, dataTip, dataTestId }}
	<li class="relative {label === 'delete' ? 'text-error' : ''} ">
		<button data-testid={dataTestId} aria-label={label} on:click={action} class="absolute inset-0">
		</button>
		<a href={undefined} class="lg:p-1 lg:px-2">
			<div class="lg:tooltip lg:tooltip-bottom" data-tip={dataTip}>
				{@html icon}
			</div>
			<span class="lg:hidden whitespace-nowrap">{dataTip}</span>
		</a>
	</li>
{/each}
