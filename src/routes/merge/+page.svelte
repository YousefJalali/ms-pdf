<script lang="ts">
	import { docs, mergedPdf, pages } from '$lib/stores/merge'
	import SideBar from './(SideBard)/SideBar.svelte'
	import DropZone from './DropZone.svelte'
	import MergedDoc from './MergedDoc.svelte'
	import Preview from './Preview.svelte'
	import { beforeNavigate } from '$app/navigation'

	beforeNavigate(({ cancel }) => {
		if ($pages.length) {
			if (
				!confirm(
					'Are you sure you want to leave this page? You have unsaved changes that will be lost.'
				)
			) {
				cancel()
			} else {
				docs.reset()
			}
		}
	})
</script>

<div class="flex gap-8 h-[calc(100vh-100px-32px-25px)]">
	{#if $mergedPdf.src}
		<MergedDoc />
	{:else}
		{#if $pages.length}
			<!-- drag and drop area -->
			<DropZone />
			<Preview />
		{/if}

		<SideBar />
	{/if}
</div>
