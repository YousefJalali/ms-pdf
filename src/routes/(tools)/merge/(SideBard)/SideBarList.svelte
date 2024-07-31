<script lang="ts">
	import { clickOutside } from '$lib/utils'
	import { docs } from '$lib/stores/merge'
	import DocItem from '$lib/ui/DocItem.svelte'
	import { more } from '$lib/ui'

	let showList: null | string = null
</script>

<ul class="w-full h-0 flex-auto mt-3 py-4 overflow-y-scroll divide-y" data-testid="doc list">
	{#each Object.values($docs) as doc}
		<DocItem {doc}>
			<button class="btn btn-circle btn-sm btn-ghost" on:click={() => (showList = doc.docId)}
				>{@html more}</button
			>

			{#if showList === doc.docId}
				<div
					class="absolute top-1/2 right-4 z-20"
					use:clickOutside
					on:outclick={() => (showList = null)}
				>
					<ul class="dropdown-content menu min-w-56 bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
						<li>
							<label class="label cursor-pointer">
								<span class="label-text">Show Pages</span>
								<input
									type="checkbox"
									class="toggle toggle-primary toggle-sm"
									checked={doc.showPages || doc.pageCount <= 1}
									on:change={() => docs.toggleShowPages(doc.docId)}
									disabled={doc.pageCount <= 1}
								/>
							</label>
						</li>
						<li>
							<a class="text-error" href={null} on:click={() => docs.removeDoc(doc.docId)}>
								<!-- {@html trash}  -->
								Delete Document
							</a>
						</li>
					</ul>
				</div>
			{/if}
		</DocItem>
	{/each}
</ul>
