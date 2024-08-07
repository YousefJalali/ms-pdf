<script lang="ts">
	import { page } from '$app/stores'
	import { LINKS, states } from '$lib/constants'

	import { docs, uploadingDocs } from '$lib/stores'
	import { FileInput, gear, UploadButton } from '$lib/ui'
	import Upload from './Upload.svelte'

	$: path = $page.url.pathname
	$: showPages = path === LINKS.pdfToImage ? true : false
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
		<div class="lg:flex-[0_0_calc(70%-2rem)]">
			<slot name="cards" />
		</div>

		<div
			class="peer lg:flex-[0_0_30%] flex w-full border border-base-300 bg-base-100 flex-col rounded-2xl p-4 fixed bottom-0 left-0 max-h-[80vh] lg:max-h-none z-20 lg:relative"
			data-testid="side"
		>
			<input type="checkbox" id="download-options" class="hidden peer" />
			<div class="flex-1 hidden lg:flex lg:flex-col peer-checked:block">
				<label for="download-options" class="btn btn-xs ml-auto flex w-fit lg:hidden mb-4"
					>✕
				</label>
				<div class="mb-4">
					<Upload component={UploadButton} {showPages} />
				</div>
				<slot name="side" />
			</div>

			<div class="flex mt-2 gap-2">
				<label for="download-options" class="btn btn-square lg:hidden">{@html gear} </label>
				<slot name="cta" />
			</div>
		</div>
		<label
			for="download-options"
			class="hidden peer-[:has(input[type='checkbox']:checked)]:block lg:!hidden fixed top-0 left-0 z-10 w-screen h-screen bg-black opacity-50"
		/>
	</div>
{/if}
