<script lang="ts">
	import { page } from '$app/state'
	import { LINKS } from '$lib/constants'
	import { t } from '$lib/i18n'
	import * as Sheet from '$lib/components/ui/sheet'

	import { docs, uploadingDocs } from '$lib/stores'
	import { DnDFIleInput, UploadButton } from '$lib/ui'
	import { LoaderCircle, SlidersHorizontal, Upload as UploadIcon } from 'lucide-svelte'
	import Upload from './Upload.svelte'
	import { Button } from '$lib/components/ui/button'
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
	let showPages = $derived(path === LINKS.pdfToImage ? true : false)
</script>

{#snippet placeholder()}
	<UploadIcon class="size-8 mb-4" />
	<p class="mb-2 text-sm">
		<span class="font-semibold">{$t('click to upload')}</span>
		{$t('or drag and drop')}
	</p>
	<p class="text-xs">{$t('supported format')}: <strong>PDF</strong></p>
{/snippet}

{#if !Object.keys($docs).length && $uploadingDocs}
	<div class="prose max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4">
		<LoaderCircle class="animate-spin size-10 opacity-60 text-primary" />
		<h1 class="font-semibold tracking-tight text-3xl my-3">Uploading Your PDFs...</h1>
		<p class="text-muted-foreground text-sm">
			Your PDFs are being uploaded. Please wait a moment while we securely transfer your documents.
			Once the upload is complete, you will be able to merge them.
		</p>
	</div>
{:else if !Object.keys($docs).length}
	<div class="max-w-4xl mx-auto flex flex-col items-center justify-center px-4">
		<div class="mb-8 max-w-none text-center">
			<h1 class="font-semibold tracking-tight text-3xl mb-3">{$t(`${path}.upload.title`)}</h1>
			<p class="text-muted-foreground text-sm">{$t(`${path}.upload.description`)}</p>
		</div>
		<Upload component={DnDFIleInput} {showPages} {placeholder} />
	</div>
{:else}
	<div class="flex h-full w-full">
		<!-- Draggable Cards -->
		<div class="pb-10 lg:pb-0 lg:grow-[7] 2xl:grow-[7.5] lg:basis-0 lg:w-auto w-full h-full">
			<!-- mobile header -->
			<div
				class="lg:hidden sticky top-0 z-50 flex items-center gap-4 justify-between sm:justify-start w-full p-4"
			>
				<Upload component={UploadButton} {showPages} />

				<Sheet.Root>
					<Sheet.Trigger>
						<Button variant="outline">
							<SlidersHorizontal class="size-5" /></Button
						>
					</Sheet.Trigger>

					<Sheet.Content class="flex flex-col">
						{@render side?.()}
					</Sheet.Content>
				</Sheet.Root>

				<div class="hidden sm:flex lg:hidden ml-auto">
					{@render download?.()}
				</div>
			</div>

			{@render cards?.()}
		</div>

		<!-- Desktop Side -->
		<div
			class="hidden border-l lg:flex lg:grow-[3] 2xl:grow-[2.5] lg:basis-0 lg:w-auto w-full flex-col p-4 fixed bottom-0 left-0 max-h-[80vh] lg:max-h-none z-20 lg:relative"
			data-testid="side"
		>
			<div class="mb-6">
				<Upload component={UploadButton} {showPages} />
			</div>

			{@render side?.()}

			<div class="flex gap-2 mt-auto">
				{@render download?.()}
			</div>
		</div>

		<!-- Mobile Side -->
		<div
			class="flex mt-2 gap-2 fixed bottom-0 pb-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 sm:hidden bg-gradient-to-t from-background sm:from-transparent"
		>
			{#if cta}
				<Sheet.Root>
					<Sheet.Trigger class="w-full">
						<Button class="w-full">
							{@render cta?.()}
						</Button>
					</Sheet.Trigger>

					<Sheet.Content class="flex flex-col">
						{@render side?.()}
					</Sheet.Content>
				</Sheet.Root>
			{:else}
				<div class="w-full sm:hidden">
					{@render download?.()}
				</div>
			{/if}
		</div>
	</div>
{/if}
