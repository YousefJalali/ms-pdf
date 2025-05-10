<script lang="ts">
	import { pages, previewModal } from '$lib/stores'
	import type { Doc, Page } from '$lib/types'
	import { rotate, trash, zoom } from '$lib/ui'

	interface Props {
		doc: Doc
		page: Page
		onDelete?: () => void
		onPreview?: () => void
		onRotate?: () => void
	}

	let { doc, page, onDelete, onPreview, onRotate }: Props = $props()

	function deleteHandler() {
		pages.deletePage(page.pageId)
		if (onDelete) onDelete()
	}

	function previewHandler() {
		previewModal.show($pages.findIndex((p) => p.pageId === page.pageId))
		if (onPreview) onPreview()
	}

	function rotateHandler() {
		pages.rotate(page.pageId, 90)
		if (onRotate) onRotate()
	}

	const actions = [
		{
			label: 'preview',
			icon: zoom,
			action: previewHandler,
			dataTip: 'Preview',
			dataTestId: 'card-preview'
		},
		{
			label: 'rotate',
			icon: rotate,
			action: rotateHandler,
			dataTip: doc.pageCount <= 1 || doc.showPages ? 'Rotate Page' : 'Rotate Document',
			dataTestId: 'card-rotate'
		},
		{
			label: 'delete',
			icon: trash,
			action: deleteHandler,
			dataTip: doc.pageCount <= 1 || doc.showPages ? 'Delete Page' : 'Delete Document',
			dataTestId: 'card-delete'
		}
	]
</script>

{#each actions as { label, action, icon, dataTip, dataTestId }}
	<li class="relative {label === 'delete' ? 'text-error' : ''} ">
		<button
			data-testid={dataTestId}
			aria-label={label}
			onclick={action}
			class="absolute inset-0 z-50"
		>
		</button>
		<a href={undefined} class="lg:p-1 lg:px-2">
			<div class="lg:tooltip lg:tooltip-bottom" data-tip={dataTip}>
				{@html icon}
			</div>
			<span class="lg:hidden whitespace-nowrap">{dataTip}</span>
		</a>
	</li>
{/each}
