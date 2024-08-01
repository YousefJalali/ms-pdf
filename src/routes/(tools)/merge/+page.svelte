<script lang="ts">
	import { docs, mergedPdf, pages } from '$lib/stores/merge'
	import SideBar from './(SideBard)/SideBar.svelte'
	import Cards from './(Cards)/Cards.svelte'
	import MergedDoc from './(MergedDoc)/MergedDoc.svelte'
	import Preview from './(Cards)/Preview.svelte'
	import { beforeNavigate } from '$app/navigation'
	import { uploadingDocs } from '$lib/stores/merge/docs'
	import { mergeStates } from '$lib/constants'

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

{#if !Object.keys($docs).length && $uploadingDocs}
	<div class="prose flex flex-col items-center justify-center mx-auto text-center">
		<span class="loading loading-ring loading-lg mb-4"></span>
		<h1>{mergeStates.uploading.title}</h1>
		<p>{mergeStates.uploading.description}</p>
	</div>
{:else if $mergedPdf.src}
	<MergedDoc />
{:else}
	{#if $pages.length}
		<!-- drag and drop area -->
		<Cards />
		<Preview />
	{/if}

	<SideBar />
{/if}
