<script lang="ts">
	import { page } from '$app/stores'
	import { LINKS, states } from '$lib/constants'

	import { docs, uploadingDocs } from '$lib/stores'
	import { FileInput, adjust, UploadButton } from '$lib/ui'
	import Upload from './Upload.svelte'

	$: path = $page.url.pathname
	$: showPages = path === LINKS.pdfToImage ? true : false

	let optionsModal: HTMLDialogElement
</script>

{#if !Object.keys($docs).length && $uploadingDocs}
	<div class="prose flex flex-col items-center justify-center mx-auto text-center">
		<span class="loading loading-ring loading-lg mb-4"></span>
		<h1>Uploading Your PDFs...</h1>
		<p>
			Your PDFs are being uploaded. Please wait a moment while we securely transfer your documents.
			Once the upload is complete, you will be able to merge them.
		</p>
	</div>
{:else if !Object.keys($docs).length}
	<div class="flex flex-col items-center justify-center">
		<div class="mb-8 prose prose-sm lg:prose-lg max-w-none text-center">
			<h1>{states[path].upload.title}</h1>
			<p>{states[path].upload.description}</p>
		</div>
		<Upload component={FileInput} {showPages} />
	</div>
{:else}
	<div class="flex gap-8 w-full">
		<div class="lg:flex-[0_0_calc(70%-2rem)] w-full">
			<div class="sticky top-0 z-50 bg-base-100 flex justify-between w-full pt-6 pb-4 lg:hidden">
				<Upload component={UploadButton} {showPages} />
				<button class="btn btn-sm btn-square" on:click={() => optionsModal.showModal()}>
					{@html adjust}
				</button>
			</div>

			<slot name="cards" />
		</div>

		<div
			class="hidden lg:flex lg:flex-[0_0_30%] w-full border border-base-300 bg-base-100 flex-col rounded-box p-4 fixed bottom-0 left-0 max-h-[80vh] lg:max-h-none z-20 lg:relative"
			data-testid="side"
		>
			<div class="mb-4">
				<Upload component={UploadButton} {showPages} />
			</div>
			<slot name="side" />

			<div class="flex gap-2 mt-auto">
				<slot name="cta" />
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
					<slot name="cta" />
				</div>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button></button>
			</form>
		</dialog>

		<div
			class="flex mt-2 gap-2 fixed bottom-0 left-0 w-full p-6 pt-10 lg:hidden bg-gradient-to-t from-base-100"
		>
			<button class="btn btn-primary flex-1" on:click={() => optionsModal.showModal()}>Split</button
			>
		</div>
	</div>
{/if}
