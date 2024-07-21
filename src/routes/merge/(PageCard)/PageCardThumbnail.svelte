<script lang="ts">
	import type { Page } from '../../../types'
	import { docs, thumbnails } from '../../../stores'

	export let page: Page

	$: thumbnail = $thumbnails[page.pageId]?.thumbnail
</script>

{#if thumbnail}
	{#if thumbnail.status === 'loaded'}
		<img
			class="shadow mx-auto"
			src={URL.createObjectURL(thumbnail.src)}
			alt={$docs[page.docId].name}
			height={200}
		/>
	{:else}
		<div class="w-full h-full flex items-center justify-center">
			<span class="loading loading-infinity loading-lg"></span>
		</div>
	{/if}
{/if}
