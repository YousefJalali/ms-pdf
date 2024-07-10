<script lang="ts">
	import { dndzone } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import { pages } from '../../stores/'
	import FileCard from './FileCard.svelte'
	import type { Page } from '../../types'
	import { derived, type Readable } from 'svelte/store'

	const filteredPages = derived<Readable<Page[]>, Page[]>(
		pages,
		($st, set) => {
			set($st.filter((p) => p.pageVisible))
		},
		[]
	)

	const flipDurationMs = 300
	function handleDndConsider(e: CustomEvent<DndEvent<Page>>) {
		pages.set(e.detail.items)
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Page>>) {
		console.log(e.detail)
		pages.set(e.detail.items)
	}
</script>

<div
	class="w-full h-full overflow-y-scroll flex-auto bg-gray-100 border-2 border-dashed border-gray-200 rounded-xl"
>
	<div class="text-center opacity-40 text-sm mt-2">
		<span>Drag and drop pdf docs here</span>
	</div>

	<div
		class="flex flex-wrap gap-4 w-full p-4"
		use:dndzone={{ items: $filteredPages, flipDurationMs }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each $filteredPages as page (page.id)}
			<div class="h-fit" animate:flip={{ duration: flipDurationMs }}>
				<FileCard {page} />
			</div>
		{/each}
	</div>
</div>
