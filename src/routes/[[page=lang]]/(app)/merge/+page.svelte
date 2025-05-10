<script lang="ts">
	import { docs, mergedPdf, pages, previews } from '$lib/stores'
	import { t } from '$lib/i18n'
	import { PageLoadingState } from '$lib/ui'
	import DocList from '../(components)/DocList.svelte'
	import DraggableCards from '../(components)/DraggableCards.svelte'
	import Layout from '../(components)/Layout.svelte'
	import MergedDoc from './(MergedDoc)/MergedDoc.svelte'
	import Merge from './(MergedDoc)/Merge.svelte'
	import Preview from '../(components)/(PageCard)/Preview.svelte'
	import PageCard from '../(components)/(PageCard)/PageCard.svelte'
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
		title={$t('merge.merging.title')}
		description={$t('merge.merging.description')}
	/>
{:else if $mergedPdf.src}
	<MergedDoc />
{:else}
	<Layout>
		{#snippet cards()}
			<DraggableCards>
				{#snippet children({ page, pageIndex })}
					<PageCard {page} />
				{/snippet}
			</DraggableCards>
			{#if Object.keys($previews).length && $pages.length}
				<Preview />
			{/if}
		{/snippet}

		{#snippet side()}
			<div class="divider divider-center opacity-80 text-sm hidden lg:flex">
				Uploaded Docs ({Object.keys($docs).length})
			</div>
			<div
				class="flex flex-col w-full overflow-hidden flex-auto [&>ul]:overflow-y-scroll [&>ul]:flex-1 lg:pb-4 lg:h-0"
			>
				<DocList withOptions />
			</div>
		{/snippet}

		{#snippet download()}
			<Merge />
		{/snippet}
	</Layout>
{/if}
