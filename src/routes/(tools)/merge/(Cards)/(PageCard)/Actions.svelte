<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { pages, previewModal } from '$lib/stores'
	import type { Doc, Page } from '$lib/types'
	import { rotate, trash, zoom } from '$lib/ui'

	export let doc: Doc
	export let page: Page
	export let pageIndex: number

	const dispatch = createEventDispatcher()

	function onDelete() {
		pages.deletePage(page.pageId)
		dispatch('delete')
	}

	function onPreview() {
		previewModal.show(pageIndex)
		dispatch('preview')
	}

	function onRotate() {
		pages.rotate(page.pageId, 90)
		dispatch('rotate')
	}

	const actions = [
		{ label: 'preview', icon: zoom, action: onPreview, dataTip: 'Preview' },
		{
			label: 'rotate',
			icon: rotate,
			action: onRotate,
			dataTip: doc.pageCount <= 1 || doc.showPages ? 'Rotate Page' : 'Rotate Document'
		},
		{
			label: 'delete',
			icon: trash,
			action: onDelete,
			dataTip: doc.pageCount <= 1 || doc.showPages ? 'Delete Page' : 'Delete Document'
		}
	]
</script>

{#each actions as { label, action, icon, dataTip }}
	<li class="relative {label === 'delete' ? 'text-error' : ''} first:pt-2 last:pb-2">
		<button on:click={action} class="absolute inset-0"></button>
		<a href={undefined} aria-label={label} class="lg:p-1 lg:px-2">
			{@html icon}
			<span class="lg:hidden whitespace-nowrap">{dataTip}</span>
		</a>
	</li>
{/each}
<!-- <li>
	<a href={undefined} aria-label="preview" on:click={showPreview} class="lg:p-1 lg:px-2">
		{@html zoom} <span class="lg:hidden">Preview</span>
	</a>
</li> -->

<!-- <div class="bg-neutral text-neutral-content shadow w-fit mx-auto join join-horizontal">
	<div
		class="tooltip tooltip-bottom join-item flex-1 before:hidden lg:before:block"
		data-tip="Preview"
	>
		<button aria-label="preview" class="btn btn-sm btn-ghost [&>svg]:size-5" on:click={showPreview}
			>{@html zoom}
		</button>
	</div>

	<div
		class="tooltip tooltip-bottom join-item flex-1 before:hidden lg:before:block"
		data-tip={doc.pageCount <= 1 || doc.showPages ? 'Rotate Page' : 'Rotate Document'}
	>
		<button
			aria-label="rotate"
			class="btn btn-sm btn-ghost [&>svg]:size-5"
			on:click={() => pages.rotate(page.pageId, 90)}
			>{@html rotate}
		</button>
	</div>

	<div
		class="tooltip tooltip-bottom join-item flex-1 before:hidden lg:before:block"
		data-tip={doc.pageCount <= 1 || doc.showPages ? 'Delete Page' : 'Delete Document'}
	>
		<button
			aria-label="delete"
			class="btn btn-sm btn-ghost [&>svg]:size-5 !text-error"
			on:click={onDelete}
			>{@html trash}
		</button>
	</div>
</div> -->
