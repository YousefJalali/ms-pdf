<script lang="ts">
	import type { Doc } from '$lib/types'
	import { formatBytes } from '$lib/utils'

	export let doc: Doc | Omit<Doc, 'showPages'>
</script>

<li class="relative group flex justify-between gap-2 py-3 px-1">
	<div>
		<div class="flex gap-2 text-sm">
			<div class="h-5 w-fit flex items-center justify-center">
				<span class="h-3 w-3 shrink-0 grow-0 rounded-full" style="background-color: {doc.color};" />
			</div>

			<span class="line-clamp-2 leading-5">{doc.name}</span>
		</div>
		<div class="text-xs opacity-60 ml-5">
			<span>{doc.pageCount} page{doc.pageCount > 1 ? 's' : ''} - </span>
			<span>{formatBytes(doc.size)}</span>
		</div>
	</div>

	<slot />
</li>
