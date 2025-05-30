<script lang="ts">
	import JSZip from 'jszip'
	import { docs, pages, previews, thumbnails, uploadingDocs } from '$lib/stores'
	import { generateFileName } from '$lib/utils'
	import Layout from '../(components)/Layout.svelte'
	import OtherTools from '../(components)/OtherTools.svelte'
	import Draggable from '../(components)/Draggable.svelte'
	import PageCard from '../(components)/(PageCard)/PageCard.svelte'
	import Preview from '../(components)/(PageCard)/Preview.svelte'
	import { t } from '$lib/i18n'
	import { Button } from '$lib/components/ui/button'
	import { Reload } from 'svelte-radix'
	import * as Tabs from '$lib/components/ui/tabs/index.js'
	import { LoaderCircle, RotateCcw, Split } from 'lucide-svelte'
	import EmptyStatePage from '../(components)/EmptyStatePage.svelte'
	import SplitOptions from './SplitOptions.svelte'
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte'
	import CardsGrid from '../(components)/CardsGrid.svelte'
	import { ranges, split } from './splitStore'

	// svelte-ignore non_reactive_update
	let options: SplitOptions
	let downloaded = $state(false)
	let downloading = $state(false)
	let activeTab = $state('range')

	// let ranges: { [pageIndex: number]: string } = $state({})
	let rangesCount = $derived(Object.keys($ranges).length)

	async function downloadDocs() {
		downloading = true

		let blobs: Blob[] = await split()

		let blob: Blob | null = null

		if (blobs.length === 1) {
			if (blobs[0] instanceof Blob) {
				blob = blobs[0]
			}
		} else {
			const zip = new JSZip()

			let i = 1
			for (let blob of blobs) {
				if (blob instanceof Blob) {
					zip.file(`Split (${i}).pdf`, blob, {
						base64: true
					})

					i++
				}
			}

			blob = await zip.generateAsync({ type: 'blob' })
		}

		downloading = false
		if (!blob) return

		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = generateFileName('Split')
		document.body.append(link)
		link.click()
		link.remove()

		await docs.reset()

		downloaded = true
	}

	function reset() {
		downloading = false
		downloaded = false
		options?.reset()
	}
</script>

<svelte:head>
	<title>Split PDF</title>
	<meta
		name="description"
		content="Split PDFs instantly with our free online PDF splitter. Separate pages or extract custom page ranges in seconds, without downloads or sign-ups. Secure, fast, and optimized for all devices. Simplify your PDF management today!"
	/>
</svelte:head>

{#if downloading}
	<EmptyStatePage
		Icon={LoaderCircle}
		title={$t('split.downloading.title')}
		description={$t('split.downloading.description')}
	/>
{:else if downloaded}
	<EmptyStatePage
		title={$t('split.downloaded.title')}
		description={$t('split.downloaded.description')}
	>
		<Button variant="outline" onclick={reset}>
			<RotateCcw class="w-4 h-4 mr-2 pointer-events-none" />
			Start Over
		</Button>

		<OtherTools />
	</EmptyStatePage>
{:else if !Object.keys($thumbnails).length && $uploadingDocs}
	<EmptyStatePage
		Icon={LoaderCircle}
		title={$t('split.uploading.title')}
		description={$t('split.uploading.description')}
	/>
{:else}
	<Layout>
		{#snippet cards()}
			<CardsGrid>
				<Draggable>
					{#snippet children({ page, pageIndex })}
						<PageCard {page} />
					{/snippet}
				</Draggable>
			</CardsGrid>

			{#if Object.keys($previews).length && $pages.length}
				<Preview />
			{/if}
		{/snippet}

		{#snippet side()}
			<div>
				<span class="font-semibold leading-none tracking-tight">Split Options</span>
				<p class="text-sm text-muted-foreground line-clamp-1">Adjust the below</p>
			</div>

			<ScrollArea class="h-full mt-4">
				<Tabs.Root bind:value={activeTab}>
					<Tabs.List class="sticky top-0 z-10 grid w-full grid-cols-2" data-testid="split-tabs">
						<Tabs.Trigger value="range">Range</Tabs.Trigger>
						<Tabs.Trigger value="all">All</Tabs.Trigger>
					</Tabs.List>
					<SplitOptions bind:this={options} {activeTab} />
				</Tabs.Root>
			</ScrollArea>
		{/snippet}

		{#snippet cta()}
			<Split class="mr-2 pointer-events-none size-4" />
			{$t('btn.split')}
		{/snippet}

		{#snippet download()}
			<!-- {@const splittedDocsCount = options.splittedDocsCount()} -->
			<Button onclick={downloadDocs} class="w-full">
				{#if downloading}
					<Reload class="w-4 h-4 mr-2 pointer-events-none animate-spin" />
				{/if}

				{$t('download')}

				{activeTab === 'all'
					? `(${$pages.length} PDFs)`
					: rangesCount > 1
						? `(${rangesCount} PDFs)`
						: '(1 PDF)'}
			</Button>
		{/snippet}
	</Layout>
{/if}
