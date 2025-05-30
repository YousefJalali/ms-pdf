<script lang="ts">
	import { docs, uploadingDocs } from '$lib/stores'
	import { page } from '$app/state'
	import { t } from '$lib/i18n'
	import * as Sheet from '$lib/components/ui/sheet'
	import * as Resizable from '$lib/components/ui/resizable'
	import { Button } from '$lib/components/ui/button'
	import { ChevronUp, LoaderCircle, SlidersHorizontal, Upload as UploadIcon } from 'lucide-svelte'

	import DnDFIleInput from '../(components)/DnDFIleInput.svelte'
	import UploadButton from '../(components)/UploadButton.svelte'
	import Upload from './Upload.svelte'
	import EmptyStatePage from './EmptyStatePage.svelte'
	import DocList from './DocList.svelte'
	import { ChevronDown } from 'svelte-radix'
	import type { PaneAPI } from 'paneforge'

	interface Props {
		cards?: import('svelte').Snippet
		side?: import('svelte').Snippet
		download?: import('svelte').Snippet
		cta?: import('svelte').Snippet
	}

	let { cards, side, download, cta }: Props = $props()

	let path = $derived.by(() => {
		if (page.url.pathname.includes('merge')) return 'merge'
		if (page.url.pathname.includes('split')) return 'split'
		if (page.url.pathname.includes('image')) return 'pdfToImage'
		if (page.url.pathname.includes('compress')) return 'compress'
	})
	let showPages = $derived(path === 'pdfToImage' ? true : false)

	let windowHeight = $state(0)
	let defaultLayout = [75, 25]
	let isDocListCollapsed = $state(false)

	// svelte-ignore non_reactive_update
	let sidePaneApi: PaneAPI

	//60 is header height in px
	let docListHeaderCollapsedSize = $derived(+((60 / windowHeight) * 100).toFixed(2))
</script>

<svelte:window bind:innerHeight={windowHeight} />

{#if !Object.keys($docs).length && $uploadingDocs}
	<EmptyStatePage
		Icon={LoaderCircle}
		title="Uploading Your PDFs..."
		description="Your PDFs are being uploaded. Please wait a moment while we securely transfer your documents.
			Once the upload is complete, you will be able to merge them."
	/>
{:else if !Object.keys($docs).length}
	<EmptyStatePage title={$t(`${path}.upload.title`)} description={$t(`${path}.upload.description`)}>
		<Upload Component={DnDFIleInput} {showPages} {placeholder} />
	</EmptyStatePage>
{:else}
	{@render mobileHeaderTools()}

	<Resizable.PaneGroup direction="horizontal" class="items-stretch w-screen h-screen">
		<Resizable.Pane defaultSize={defaultLayout[0]}>
			{@render cards?.()}
		</Resizable.Pane>

		<Resizable.Handle withHandle class="hidden lg:flex" />

		<!-- Desktop Side -->
		<Resizable.Pane
			minSize={25}
			maxSize={50}
			defaultSize={defaultLayout[1]}
			class="hidden lg:block"
		>
			{@render sidePane()}
		</Resizable.Pane>
	</Resizable.PaneGroup>

	{@render mobileCTA()}
{/if}

{#snippet mobileHeaderTools()}
	<div
		class="sticky top-0 z-50 flex items-center justify-between w-full gap-4 p-4 lg:hidden sm:justify-start"
	>
		<Upload Component={UploadButton} {showPages} />

		<Sheet.Root>
			<Sheet.Trigger>
				<Button variant="outline">
					<SlidersHorizontal class="pointer-events-none size-5" />
				</Button>
			</Sheet.Trigger>

			<Sheet.Content class="flex flex-col gap-0 p-0 pt-10">
				{@render sidePane()}
			</Sheet.Content>
		</Sheet.Root>

		<div class="hidden ml-auto sm:flex lg:hidden">
			{@render download?.()}
		</div>
	</div>
{/snippet}

{#snippet mobileCTA()}
	<div
		class="fixed bottom-0 flex w-full max-w-2xl gap-2 px-4 pb-4 mt-2 -translate-x-1/2 left-1/2 sm:hidden bg-gradient-to-t from-background sm:from-transparent"
	>
		{#if cta}
			<Sheet.Root>
				<Sheet.Trigger class="w-full">
					<Button class="w-full">
						{@render cta?.()}
					</Button>
				</Sheet.Trigger>

				<Sheet.Content class="flex flex-col p-0 pt-10">
					{@render sidePane()}
				</Sheet.Content>
			</Sheet.Root>
		{:else}
			<div class="w-full sm:hidden">
				{@render download?.()}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet placeholder()}
	<UploadIcon class="mb-4 size-8" />
	<p class="mb-2 text-sm">
		<span class="font-semibold">{$t('click to upload')}</span>
		{$t('or drag and drop')}
	</p>
	<p class="text-xs">{$t('supported format')}: <strong>PDF</strong></p>
{/snippet}

{#snippet docList()}
	<div>
		<div class="flex items-center justify-between gap-2 pb-2">
			<div class="flex items-center gap-2">
				<div>
					<span class="font-semibold leading-none tracking-tight">Documents </span>
					<p class="text-sm text-muted-foreground line-clamp-1">
						{Object.keys($docs).length} document{Object.keys($docs).length > 1 ? 's' : ''} uploaded
					</p>
				</div>
			</div>

			<div class="flex gap-1">
				<Upload Component={UploadButton} {showPages} props={{ iconOnly: true }} />

				{#if side}
					{#if isDocListCollapsed}
						<Button variant="outline" size="icon" onclick={() => sidePaneApi.expand()}>
							<ChevronDown class="pointer-events-none size-4" />
							<span class="sr-only">Collapse</span>
						</Button>
					{:else}
						<Button variant="outline" size="icon" onclick={() => sidePaneApi.collapse()}>
							<ChevronUp class="pointer-events-none size-4" />
							<span class="sr-only">Expand</span>
						</Button>
					{/if}
				{/if}
			</div>
		</div>

		<DocList withOptions />
	</div>
{/snippet}

{#snippet sidePane()}
	<Resizable.PaneGroup direction="vertical" data-testid="side">
		<Resizable.Pane
			bind:pane={sidePaneApi}
			defaultSize={50}
			maxSize={90}
			collapsible
			collapsedSize={docListHeaderCollapsedSize}
			onCollapse={() => (isDocListCollapsed = true)}
			onExpand={() => (isDocListCollapsed = false)}
			class="px-4 pt-4"
		>
			{@render docList()}
		</Resizable.Pane>

		{#if side}
			<Resizable.Handle withHandle />

			<Resizable.Pane
				defaultSize={50}
				minSize={25}
				maxSize={100 - docListHeaderCollapsedSize}
				class="flex flex-col p-4"
			>
				{@render side?.()}
			</Resizable.Pane>
		{/if}

		<div class="p-4 pt-0 mt-auto">
			{@render download?.()}
		</div>
	</Resizable.PaneGroup>
{/snippet}
