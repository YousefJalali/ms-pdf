<script lang="ts">
	import { dndzone } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import { docs, pages } from '../../stores/'
	import FileCard from './FileCard.svelte'
	import type { Doc, Page } from '../../types'

	let p: Page[] = []
	$: {
		p = []
		for (let doc of Object.values($docs)) {
			p.push(...doc.pages)
		}
		console.log(p)
	}

	const flipDurationMs = 300
	function handleDndConsider(e: CustomEvent<DndEvent<Page>>) {
		// pages.set(e.detail.items)
		p = e.detail.items
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Page>>) {
		p = e.detail.items
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
		use:dndzone={{ items: p, flipDurationMs }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each p as page (page.id)}
			<div class="h-fit" animate:flip={{ duration: flipDurationMs }}>
				<FileCard {page} />
			</div>
		{/each}
	</div>
</div>
