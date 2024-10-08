<script lang="ts">
	import { page } from '$app/stores'
	import { LINKS, states } from '$lib/constants'

	import { docs, uploadingDocs } from '$lib/stores'
	import { DnDFIleInput, adjust, UploadButton } from '$lib/ui'
	import Upload from './Upload.svelte'

	$: path = $page.url.pathname
	$: showPages = path === LINKS.pdfToImage ? true : false

	let optionsModal: HTMLDialogElement
</script>

{#if !Object.keys($docs).length && $uploadingDocs}
	<div class="prose max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
		<span class="loading loading-ring loading-lg mb-4"></span>
		<h1>Uploading Your PDFs...</h1>
		<p>
			Your PDFs are being uploaded. Please wait a moment while we securely transfer your documents.
			Once the upload is complete, you will be able to merge them.
		</p>
	</div>
{:else if !Object.keys($docs).length}
	<div class="max-w-4xl mx-auto flex flex-col items-center justify-center">
		<div class="mb-8 prose prose-sm lg:prose-lg max-w-none text-center">
			<h1>{states[path].upload.title}</h1>
			<p>{states[path].upload.description}</p>
		</div>
		<Upload component={DnDFIleInput} {showPages} />
	</div>
{:else}
	<div class="flex gap-3 w-full">
		<div
			class="pb-10 lg:pb-0 lg:grow-[7] 2xl:grow-[7.5] lg:basis-0 lg:w-auto w-full h-[calc(100%-64px)] lg:h-full"
		>
			<div
				class="sticky top-0 z-50 bg-base-100 flex items-center gap-4 justify-between sm:justify-start w-full h-[64px] lg:hidden"
			>
				<Upload component={UploadButton} {showPages} />
				<button class="btn btn-sm btn-square" on:click={() => optionsModal.showModal()}>
					{@html adjust}
				</button>
			</div>

			<slot name="cards" />
		</div>

		<div
			class="hidden lg:flex lg:grow-[3] 2xl:grow-[2.5] lg:basis-0 lg:w-auto w-full border border-base-300 bg-base-100 flex-col rounded-box p-4 fixed bottom-0 left-0 max-h-[80vh] lg:max-h-none z-20 lg:relative"
			data-testid="side"
		>
			<div class="mb-4">
				<Upload component={UploadButton} {showPages} />
			</div>
			<slot name="side" />

			<div class="flex gap-2 mt-auto">
				<slot name="download" />
			</div>
		</div>

		<dialog
			id="my_modal_5"
			class="modal modal-bottom sm:modal-middle lg:hidden"
			bind:this={optionsModal}
		>
			<div class="modal-box p-6">
				<button class="btn btn-xs ml-auto flex w-fit mb-4" on:click={() => optionsModal.close()}>
					✕
				</button>

				<slot name="side" />

				<div class="flex mt-12 w-full">
					<slot name="download" />
				</div>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button></button>
			</form>
		</dialog>

		<div
			class="flex mt-2 gap-2 fixed bottom-0 pb-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 lg:hidden bg-gradient-to-t from-base-100 sm:from-transparent"
		>
			{#if $$slots.cta}
				<button class="btn btn-primary flex-1 shadow-md" on:click={() => optionsModal.showModal()}>
					<slot name="cta" />
				</button>
			{:else}
				<slot name="download" />
			{/if}
		</div>
	</div>
{/if}
