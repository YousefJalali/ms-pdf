<script lang="ts">
	import { docs, uploadingDocs } from '$lib/stores'
	import { page } from '$app/state'
	import { LINKS } from '$lib/constants'
	import { t } from '$lib/i18n'
	import * as Sheet from '$lib/components/ui/sheet'
	import * as Resizable from '$lib/components/ui/resizable'
	import * as Accordion from '$lib/components/ui/accordion/index.js'
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import { LoaderCircle, SlidersHorizontal, Upload as UploadIcon } from 'lucide-svelte'

	import { DnDFIleInput, UploadButton } from '$lib/ui'
	import Upload from './Upload.svelte'
	import EmptyStatePage from './EmptyStatePage.svelte'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import Separator from '$lib/components/ui/separator/separator.svelte'
	import DocList from './DocList.svelte'

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

	let defaultLayout = [75, 25]
</script>

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

	<Resizable.PaneGroup direction="horizontal" class="h-screen w-screen items-stretch">
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
			<div class="p-4 h-full flex flex-col" data-testid="side">
				{@render docList()}

				{#if side}
					<Separator class="my-4" />
				{/if}

				{@render side?.()}

				<div class="mt-auto">
					{@render download?.()}
				</div>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>

	{@render mobileCTA()}
{/if}

{#snippet mobileHeaderTools()}
	<div
		class="lg:hidden sticky top-0 z-50 flex items-center gap-4 justify-between sm:justify-start w-full p-4"
	>
		<Upload Component={UploadButton} {showPages} />

		<Sheet.Root>
			<Sheet.Trigger>
				<Button variant="outline">
					<SlidersHorizontal class="size-5" />
				</Button>
			</Sheet.Trigger>

			<Sheet.Content class="flex flex-col p-4 pt-10 gap-0">
				{@render docList()}
				{#if side}
					<Separator class="my-4" />
				{/if}
				{@render side?.()}
			</Sheet.Content>
		</Sheet.Root>

		<div class="hidden sm:flex lg:hidden ml-auto">
			{@render download?.()}
		</div>
	</div>
{/snippet}

{#snippet mobileCTA()}
	<div
		class="flex mt-2 gap-2 fixed bottom-0 pb-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 sm:hidden bg-gradient-to-t from-background sm:from-transparent"
	>
		{#if cta}
			<Sheet.Root>
				<Sheet.Trigger class="w-full">
					<Button class="w-full">
						{@render cta?.()}
					</Button>
				</Sheet.Trigger>

				<Sheet.Content class="flex flex-col p-4 pt-10">
					{@render docList()}
					{#if side}
						<Separator class="my-4" />
					{/if}
					{@render side?.()}
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
	<UploadIcon class="size-8 mb-4" />
	<p class="mb-2 text-sm">
		<span class="font-semibold">{$t('click to upload')}</span>
		{$t('or drag and drop')}
	</p>
	<p class="text-xs">{$t('supported format')}: <strong>PDF</strong></p>
{/snippet}

{#snippet docList()}
	<ScrollArea class="relative">
		<Accordion.Root value="doc list">
			<Accordion.Item value="doc list" class="border-0">
				<div class="flex items-center justify-between gap-1 pb-2">
					<div class="flex items-center gap-2">
						<div>
							<span class="font-semibold leading-none tracking-tight">Documents</span>
							<p class="text-muted-foreground text-sm line-clamp-1">
								{Object.keys($docs).length} document{Object.keys($docs).length > 1 ? 's' : ''} uploaded
							</p>
						</div>
					</div>

					<div class="flex gap-1">
						<Upload Component={UploadButton} {showPages} props={{ iconOnly: true }} />

						<Accordion.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}
						></Accordion.Trigger>
					</div>
				</div>
				<Accordion.Content class="pt-2 pb-16">
					<DocList withOptions />
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</ScrollArea>
{/snippet}
