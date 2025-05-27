<script lang="ts">
	import { mergedPdf, pages, previews } from '$lib/stores'
	import { t } from '$lib/i18n'
	import Draggable from '../(components)/Draggable.svelte'
	import Layout from '../(components)/Layout.svelte'
	import MergedDoc from './(MergedDoc)/MergedDoc.svelte'
	import Merge from './(MergedDoc)/Merge.svelte'
	import Preview from '../(components)/(PageCard)/Preview.svelte'
	import PageCard from '../(components)/(PageCard)/PageCard.svelte'
	import EmptyStatePage from '../(components)/EmptyStatePage.svelte'
	import { LoaderCircle } from 'lucide-svelte'
	import CardsGrid from '../(components)/CardsGrid.svelte'
</script>

<svelte:head>
	<title>Merge PDF</title>
	<meta
		name="description"
		content="Easily merge PDFs online with our free PDF merger. Combine multiple files into one PDF in seconds, no downloads or sign-ups required. Fast, secure, and compatible with all devices. Streamline your PDF files today!"
	/>
</svelte:head>

{#if $mergedPdf.loading}
	<EmptyStatePage
		Icon={LoaderCircle}
		title={$t('merge.merging.title')}
		description={$t('merge.merging.description')}
	/>
{:else if $mergedPdf.src}
	<MergedDoc />
{:else}
	<Layout>
		{#snippet cards()}
			<CardsGrid>
				<Draggable>
					{#snippet children({ page })}
						<PageCard {page} />
					{/snippet}
				</Draggable>
			</CardsGrid>
			{#if Object.keys($previews).length && $pages.length}
				<Preview />
			{/if}
		{/snippet}
		<!-- 
		{#snippet side()}
			<Accordion.Root value="doc list" class="w-full">
				<Accordion.Item value="doc list" class="border-0">
					<Accordion.Trigger class="p-0">
						<div class="text-sm font-semibold">
							Uploaded Docs ({Object.keys($docs).length})
						</div>
					</Accordion.Trigger>
					<Accordion.Content>
						<DocList withOptions />
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		{/snippet} -->

		{#snippet download()}
			<Merge />
		{/snippet}
	</Layout>
{/if}
