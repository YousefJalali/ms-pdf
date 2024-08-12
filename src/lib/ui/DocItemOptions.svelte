<script lang="ts">
	import { clickOutside } from '$lib/utils'
	import { docs } from '$lib/stores'
	import { more } from '$lib/ui'
	import type { Doc } from '$lib/types'

	export let doc: Doc
	let list: HTMLDetailsElement
</script>

<details
	bind:this={list}
	use:clickOutside
	on:outclick={() => (list.open = false)}
	class="dropdown dropdown-left"
>
	<summary aria-label="doc-options-btn" class="btn btn-circle btn-sm btn-ghost"
		>{@html more}</summary
	>
	<ul
		aria-label="doc-options-dropdown"
		class="dropdown-content menu min-w-56 bg-base-100 rounded-box z-[1000] w-fit p-2 shadow-lg"
	>
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
				Delete Document
			</a>
		</li>
	</ul>
</details>
