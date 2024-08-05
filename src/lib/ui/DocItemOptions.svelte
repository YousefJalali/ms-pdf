<script lang="ts">
	import { clickOutside } from '$lib/utils'
	import { docs } from '$lib/stores'
	import { more } from '$lib/ui'
	import type { Doc } from '$lib/types'

	export let doc: Doc
	let showList: null | string = null
</script>

<button class="btn btn-circle btn-sm btn-ghost" on:click={() => (showList = doc.docId)}
	>{@html more}</button
>

{#if showList === doc.docId}
	<div class="absolute top-1/2 right-4 z-20" use:clickOutside on:outclick={() => (showList = null)}>
		<ul class="dropdown-content menu min-w-56 bg-base-100 rounded-box z-[1] w-fit p-2 shadow-lg">
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
				<a class="text-error" href={null} on:click={() => docs.deleteDoc(doc.docId)}>
					<!-- {@html trash}  -->
					Delete Document
				</a>
			</li>
		</ul>
	</div>
{/if}
