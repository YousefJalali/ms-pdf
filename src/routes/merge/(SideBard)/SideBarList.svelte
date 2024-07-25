<script lang="ts">
	import { clickOutside, formatBytes } from '$lib/utils'
	import { docs } from '$lib/stores/merge'

	let showList: null | string = null

	const trash = `<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
				/>
			</svg>`

	const more = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clip-rule="evenodd" />
</svg>
`
</script>

<ul class="w-full h-0 flex-auto mt-3 py-4 overflow-y-scroll divide-y" data-testid="doc list">
	{#each Object.values($docs) as doc}
		<li class="relative group flex justify-between gap-2 py-3 px-1">
			<div>
				<div class="flex gap-2 text-sm">
					<div class="h-5 w-fit flex items-center justify-center">
						<span
							class="h-3 w-3 shrink-0 grow-0 rounded-full"
							style="background-color: {doc.color};"
						/>
					</div>

					<span class="line-clamp-2 leading-5">{doc.name}</span>
				</div>
				<div class="text-xs opacity-60 ml-5">
					<span>{doc.pageCount} page{doc.pageCount > 1 ? 's' : ''} - </span>
					<span>{formatBytes(doc.size)}</span>
				</div>
			</div>

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
		</li>
	{/each}
</ul>
