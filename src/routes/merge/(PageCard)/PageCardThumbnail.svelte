<script lang="ts">
	import type { Page } from '$lib/types'
	import { docs, images } from '$lib/stores'

	export let page: Page

	console.log(page.rotationDegree)

	$: thumbnail = $images[page.pageId]?.small
</script>

{#if thumbnail}
	<img
		class="border mx-auto"
		style="transform: rotate({page.rotationDegree || 0}deg);"
		src={URL.createObjectURL(thumbnail)}
		alt={$docs[page.docId].name}
		height={200}
	/>
{:else}
	<div class="w-full h-full flex items-center justify-center">
		<span class="loading loading-infinity loading-lg"></span>
	</div>
{/if}
