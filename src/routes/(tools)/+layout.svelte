<script lang="ts">
	import { docs, uploadingDocs } from '$lib/stores'

	export let title = 'test title'
	export let description = 'test description'
</script>

<div
	class="flex gap-8 h-[calc(100vh-64px-32px-25px)] lg:h-[calc(100vh-100px-32px-25px)] p-6 lg:p-0"
>
	{#if !Object.keys($docs).length && $uploadingDocs}
		<div class="prose flex flex-col items-center justify-center mx-auto text-center">
			<span class="loading loading-ring loading-lg mb-4"></span>
			<h1>Uploading Your PDFs...</h1>
			<p>
				Your PDFs are being uploaded. Please wait a moment while we securely transfer your
				documents. Once the upload is complete, you will be able to merge them.
			</p>
		</div>
	{:else if Object.keys($docs).length}
		<div class="mb-8 prose prose-sm lg:prose-lg max-w-none text-center">
			<h1>{title}</h1>
			<p>{description}</p>
		</div>
	{:else}
		<div class="flex gap-8 pb-8 lg:pb-0">
			<div
				class="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 bg-base-200 rounded-2xl p-2 lg:p-4 overflow-y-scroll"
			>
				<!-- <slot name="cards" /> -->
				<div>cards</div>
			</div>

			<div
				class="flex w-full border bg-base-100 flex-col rounded-2xl p-4 fixed bottom-0 left-0 z-10 lg:w-80 lg:relative"
			>
				<!-- <slot name="side" /> -->
				<div>side</div>
			</div>
		</div>
	{/if}
</div>
