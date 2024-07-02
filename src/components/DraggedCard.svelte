<!-- <script lang="ts">
  export let items

	import { dndzone } from 'svelte-dnd-action'

const flipDurationMs = 300
	function handleDndConsider(e: CustomEvent<DndEvent<Preview>>) {
		items.set(e.detail.items)
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Preview>>) {
		items.set(e.detail.items)
	}
</script>

<div
		class="flex flex-wrap gap-8 w-full bg-slate-200 rounded-2xl p-6"
		use:dndzone={{ items: $previews, flipDurationMs }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
<slot />
</div> -->
