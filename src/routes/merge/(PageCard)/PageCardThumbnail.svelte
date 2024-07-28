<script lang="ts">
	import type { Page } from '$lib/types'
	import { docs, images } from '$lib/stores/merge'
	import { rotationStyle } from '$lib/utils'

	export let page: Page

	$: thumbnail = $images[page.pageId]?.small
</script>

{#if thumbnail}
	<img
		class="border mx-auto"
		style={rotationStyle(page)}
		src={URL.createObjectURL(thumbnail)}
		alt={$docs[page.docId].name}
		height={200}
	/>
{:else}
	<div class="w-full h-full flex items-center justify-center">
		<span class="loading loading-infinity loading-lg"></span>
	</div>
{/if}
