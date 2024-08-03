<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { pages, previews } from '$lib/stores'
	import type { Doc, Page } from '$lib/types'
	import { rotate, trash, zoom } from '$lib/ui'

	export let doc: Doc
	export let page: Page

	export let from: 'card' | 'preview' = 'card'

	function showPreview() {
		previews.create({ [page.pageId]: doc.pagesPdfProxy[page.pageId] }, doc.docId)
	}

	const dispatch = createEventDispatcher()

	function onDelete() {
		dispatch('delete')
	}
</script>

<div class="bg-neutral text-neutral-content shadow w-fit mx-auto join join-horizontal">
	{#if from === 'card'}
		<div class="tooltip tooltip-bottom join-item flex-1" data-tip="Preview">
			<button aria-label="preview" class="btn btn-sm btn-ghost" on:click={showPreview}
				>{@html zoom}</button
			>
		</div>
	{/if}

	<div
		class="tooltip tooltip-bottom join-item flex-1"
		data-tip={doc.pageCount <= 1 || doc.showPages ? 'Rotate Page' : 'Rotate Document'}
	>
		<button
			aria-label="rotate"
			class="btn btn-sm btn-ghost"
			on:click={() => pages.rotate(page.pageId, 90)}>{@html rotate}</button
		>
	</div>

	<div
		class="tooltip tooltip-bottom join-item flex-1"
		data-tip={doc.pageCount <= 1 || doc.showPages ? 'Delete Page' : 'Delete Document'}
	>
		<button aria-label="delete" class="btn btn-sm btn-ghost !text-error" on:click={onDelete}
			>{@html trash}
		</button>
	</div>
</div>
