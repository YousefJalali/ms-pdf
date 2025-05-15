<script lang="ts">
	import { pages, previewModal } from '$lib/stores'
	import type { Doc, Page } from '$lib/types'
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import { RotateCwSquare, Trash, ZoomIn } from 'lucide-svelte'
	import { Button } from '$lib/components/ui/button'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'

	interface Props {
		variant?: 'menubar'
		doc: Doc
		page: Page
		onDelete?: () => void
		onPreview?: () => void
		onRotate?: () => void
	}

	let { variant, doc, page, onDelete, onPreview, onRotate }: Props = $props()

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
			Icon: ZoomIn,
			action: previewHandler,
			dataTip: 'Preview',
			dataTestId: 'card-preview'
		},
		{
			label: 'rotate',
			Icon: RotateCwSquare,
			action: rotateHandler,
			dataTip: doc.pageCount <= 1 || doc.showPages ? 'Rotate Page' : 'Rotate Document',
			dataTestId: 'card-rotate'
		},
		{
			label: 'delete',
			Icon: Trash,
			action: deleteHandler,
			dataTip: doc.pageCount <= 1 || doc.showPages ? 'Delete Page' : 'Delete Document',
			dataTestId: 'card-delete'
		}
	]
</script>

{#if variant === 'menubar'}
	{#each actions as { label, action, Icon, dataTip, dataTestId }}
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					variant="outline"
					size="icon"
					aria-label={label}
					data-testid={dataTestId}
					onclick={action}
				>
					<Icon class="size-4 {label === 'delete' ? 'text-red-500' : ''}" />
					<span class="sr-only">{label}</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="bottom">{dataTip}</Tooltip.Content>
		</Tooltip.Root>
	{/each}
{:else}
	{#each actions as { label, action, Icon, dataTip, dataTestId }}
		<DropdownMenu.Item
			aria-label={label}
			data-testid={dataTestId}
			onclick={action}
			class={label === 'delete' ? 'text-red-500' : ''}
		>
			<Icon class="size-4 mr-2" />
			{dataTip}
		</DropdownMenu.Item>
	{/each}
{/if}
