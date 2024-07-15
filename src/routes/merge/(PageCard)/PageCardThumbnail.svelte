<script lang="ts">
	import type { Page } from '../../../types'
	import { docs, thumbnails } from '../../../stores'

	export let page: Page
</script>

{#if $thumbnails[page.pageId]}
	{#if $thumbnails[page.pageId].status === 'loading'}
		<div class="w-full h-full flex items-center justify-center">
			<span class="loading loading-infinity loading-lg"></span>
		</div>
	{:else}
		<img class="shadow mx-auto" src={$thumbnails[page.pageId].src} alt={$docs[page.docId].name} />
	{/if}
{/if}
