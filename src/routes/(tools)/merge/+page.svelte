<script lang="ts">
	import { docs, mergedPdf, pages, previews } from '$lib/stores'
	import DraggableCards from '../DraggableCards.svelte'
	import MergedDoc from './(MergedDoc)/MergedDoc.svelte'
	import Preview from '../(PageCard)/Preview.svelte'
	import Layout from '../Layout.svelte'
	import { PageLoadingState } from '$lib/ui'
	import Merge from './(MergedDoc)/Merge.svelte'
	import { LINKS, states } from '$lib/constants'
	import PageCard from '../(PageCard)/PageCard.svelte'
	import DocList from '../DocList.svelte'

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

<svelte:head>
	<title>Merge PDF</title>
	<meta
		name="description"
		content="Easily merge PDFs online with our free PDF merger. Combine multiple files into one PDF in seconds, no downloads or sign-ups required. Fast, secure, and compatible with all devices. Streamline your PDF files today!"
	/>
</svelte:head>

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
			<DraggableCards let:page let:pageIndex>
				<PageCard {page} />
			</DraggableCards>
			{#if Object.keys($previews).length && $pages.length}
				<Preview />
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="side">
			<div class="divider divider-center opacity-80 text-sm hidden lg:flex">
				Uploaded Docs ({Object.keys($docs).length})
			</div>
			<div
				class="flex flex-col w-full overflow-hidden flex-auto [&>ul]:overflow-y-scroll [&>ul]:flex-1 lg:pb-4 lg:h-0"
			>
				<DocList withOptions />
			</div>
		</svelte:fragment>

		<svelte:fragment slot="download">
			<Merge />
		</svelte:fragment>
	</Layout>
{/if}
