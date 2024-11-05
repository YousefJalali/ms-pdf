<script lang="ts">
	import type { Page } from '$lib/types'
	import { docs, thumbnails } from '$lib/stores'
	import { rotationStyle } from '$lib/utils'

	interface Props {
		page: Page;
	}

	let { page }: Props = $props();

	let thumbnail = $derived($thumbnails[page.pageId]?.src)
</script>

{#if thumbnail}
	<img
		class="mx-auto h-full object-contain"
		style={rotationStyle(page)}
		src={URL.createObjectURL(thumbnail)}
		alt={`${$docs[page.docId].name} ${page.pageNum}`}
		height={200}
	/>
{:else}
	<div class="w-full h-full flex items-center justify-center">
		<span class="loading loading-infinity loading-lg"></span>
	</div>
{/if}
