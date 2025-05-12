<script lang="ts">
	import { docs, pageNum } from '$lib/stores'
	import type { Page } from '$lib/types'
	import PageCardOptions from './PageCardOptions.svelte'
	import PageCardThumbnail from './PageCardThumbnail.svelte'
	import * as Card from '$lib/components/ui/card/index.js'

	interface Props {
		page: Page
	}

	let { page }: Props = $props()

	let doc = $derived($docs[page.docId])
	let pageNumber = $derived($pageNum[page.pageId])
</script>

{#if doc && page}
	<Card.Root
		class="sm:col-span-2"
		data-x-chunk-name="dashboard-05-chunk-0"
		data-x-chunk-description="A card for an orders dashboard with a description and a button to create a new order."
	>
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1/2 rounded-b-box"
			style="background-color: {doc.color};"
		></div>

		<Card.Content class="p-2"
			><div data-testid="thumbnail" class="h-full flex items-center aspect-[180/280]">
				<PageCardThumbnail {page} />
			</div>
		</Card.Content>

		<Card.Footer class="p-2 pt-0">
			<div class="text-center text-sm flex flex-col mt-2 w-full">
				<span class="truncate">{doc.name} </span>
				<span class="opacity-70 text-xs mt-1">
					Page
					{typeof pageNumber === 'number' ? pageNumber : `${pageNumber[0]} to ${pageNumber[1]}`}
				</span>
			</div>
		</Card.Footer>
	</Card.Root>

	<div
		data-testid="card-options-desktop"
		class="absolute top-2 left-0 w-full hidden lg:group-hover:inline-flex justify-center"
	>
		<PageCardOptions variant="menubar" {doc} {page} />
	</div>
{/if}
