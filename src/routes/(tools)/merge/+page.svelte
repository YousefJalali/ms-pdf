<script lang="ts">
	import { docs, mergedPdf, pages } from '$lib/stores/merge'
	import SideBar from './(SideBard)/SideBar.svelte'
	import Cards from './(Cards)/Cards.svelte'
	import MergedDoc from './(MergedDoc)/MergedDoc.svelte'
	import Preview from './(Cards)/Preview.svelte'
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

{#if $mergedPdf.src}
	<MergedDoc />
{:else}
	{#if $pages.length}
		<!-- drag and drop area -->
		<Cards />
		<Preview />
	{/if}

	<SideBar />
{/if}
