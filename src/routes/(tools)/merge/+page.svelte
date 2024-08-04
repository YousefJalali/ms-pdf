<script lang="ts">
	import { docs, mergedPdf, pages, previews } from '$lib/stores'
	import Cards from './(Cards)/Cards.svelte'
	import MergedDoc from './(MergedDoc)/MergedDoc.svelte'
	import Preview from './(Cards)/Preview.svelte'
	import { beforeNavigate } from '$app/navigation'
	import Layout from '../Layout.svelte'
	import { DocItem, DocItemOptions, PageLoadingState } from '$lib/ui'
	import Merge from './(MergedDoc)/Merge.svelte'
	import { LINKS, states } from '$lib/constants'

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
</script>

{#if $mergedPdf.loading}
	<PageLoadingState
		loading
		title={states[LINKS.merge].merging.title}
		description={states[LINKS.merge].merging.description}
	/>
{:else if $mergedPdf.src}
	<MergedDoc />
{:else}
	<Layout>
		<svelte:fragment slot="cards">
			<Cards />
			{#if Object.keys($previews).length && $pages.length}
				<Preview />
			{/if}
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
			<Merge />
		</svelte:fragment>
	</Layout>
{/if}
