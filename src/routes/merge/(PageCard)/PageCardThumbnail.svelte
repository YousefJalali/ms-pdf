<script lang="ts">
	import type { Page } from '../../../types'
	import { docs, images } from '../../../stores'

	export let page: Page

	$: thumbnail = $images[page.pageId]?.small
</script>

{#if thumbnail}
	<img
		class="shadow mx-auto"
		src={URL.createObjectURL(thumbnail)}
		alt={$docs[page.docId].name}
		height={200}
	/>
{:else}
	<div class="w-full h-full flex items-center justify-center">
		<span class="loading loading-infinity loading-lg"></span>
	</div>
{/if}
