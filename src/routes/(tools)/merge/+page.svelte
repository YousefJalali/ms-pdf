<script lang="ts">
	import { docs, mergedPdf, pages } from '$lib/stores'
	import Cards from './(Cards)/Cards.svelte'
	import MergedDoc from './(MergedDoc)/MergedDoc.svelte'
	import Preview from './(Cards)/Preview.svelte'
	import { beforeNavigate } from '$app/navigation'
	import Layout from '../Layout.svelte'
	import { DocItem, DocItemOptions } from '$lib/ui'

	// beforeNavigate(({ cancel }) => {
	// 	if ($pages.length) {
	// 		if (
	// 			!confirm(
	// 				'Are you sure you want to leave this page? You have unsaved changes that will be lost.'
	// 			)
	// 		) {
	// 			cancel()
	// 		} else {
	// 			docs.reset()
	// 		}
	// 	}
	// })

	function merge() {
		console.log('merge')
	}
</script>

{#if $mergedPdf.src}
	<MergedDoc />
{:else}
	<Layout>
		<svelte:fragment slot="cards">
			<Cards />
			<Preview />
		</svelte:fragment>

		<svelte:fragment slot="side">
			<ul class="w-full h-0 flex-auto p-0 overflow-y-scroll hidden lg:block" data-testid="doc list">
				{#each Object.values($docs) as doc}
					<DocItem {doc}>
						<DocItemOptions {doc} />
					</DocItem>
				{/each}
			</ul>
		</svelte:fragment>

		<svelte:fragment slot="cta">
			<button
				on:click={merge}
				class="btn btn-primary flex-1"
				disabled={$pages.length < 2 || $mergedPdf.loading}
			>
				{#if $mergedPdf.loading}
					<span class="loading loading-spinner"></span>Merging...
				{:else}
					Merge
				{/if}
			</button>
		</svelte:fragment>
	</Layout>
{/if}
