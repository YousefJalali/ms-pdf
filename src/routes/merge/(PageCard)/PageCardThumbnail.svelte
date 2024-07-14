<script lang="ts">
	import type { Page } from '../../../types'
	import { thumbnails } from '../../../stores'

	export let page: Page
</script>

{#if $thumbnails[page.pageId]}
	{#if $thumbnails[page.pageId].status === 'loading'}
		<div class="w-full h-[200px]">
			<p>loading...</p>
		</div>
	{:else}
		<img class="shadow mx-auto" src={$thumbnails[page.pageId].src} alt="ha" />
	{/if}
{/if}
