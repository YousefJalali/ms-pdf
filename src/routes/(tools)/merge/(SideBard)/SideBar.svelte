<script lang="ts">
	import { FileInput, UploadButton } from '$lib/ui'
	import { docs, mergedPdf, pages, alerts } from '$lib/stores'
	import SideBarList from './SideBarList.svelte'
	import { MAX_FILE_UPLOAD, mergeStates } from '$lib/constants'

	let files: FileList | null

	const maxFileReached = () =>
		alerts.add('error', `The maximum number of files you can upload is ${MAX_FILE_UPLOAD}`)

	$: if (files) {
		let count = Object.keys($docs).length

		if (count < MAX_FILE_UPLOAD) {
			for (const file of files) {
				count++
				if (count > MAX_FILE_UPLOAD) {
					maxFileReached()
					break
				} else {
					docs.create(file)
				}
			}
			files = null
		} else {
			maxFileReached()
		}
	}

	function merge() {
		console.log('merge')
	}
</script>

<div
	class={`relative flex flex-col justify-center flex-[2] min-w-80 border-base-300 rounded-2xl ${$pages.length ? 'p-4 border justify-between [&>*:first-child]:hidden' : ''}`}
>
	<!-- description  -->
	<div class="mb-8 prose prose-sm lg:prose-lg max-w-none text-center">
		<h1>{mergeStates.upload.title}</h1>
		<p>{mergeStates.upload.description}</p>
	</div>

	<div class={`relative flex flex-col ${$pages.length ? 'h-full' : ''}`}>
		{#if $pages.length && $mergedPdf.loading}
			<div class="absolute top-0 left-0 w-full h-full z-20 cursor-not-allowed" />
		{/if}

		<!-- input -->
		<div>
			{#if $pages.length}
				<UploadButton bind:files />
			{:else}
				<FileInput bind:files />
			{/if}
		</div>

		<!-- list of docs -->
		{#if Object.values($docs).length}
			<SideBarList />
		{/if}
	</div>

	<!-- Merge button -->
	{#if $pages.length}
		<div class="text-center">
			<span class="block text-sm opacity-80 mb-2" style="opacity: {$pages.length < 2 ? '1' : '0'}"
				>Add more documents to merge</span
			>

			<button
				on:click={merge}
				class="btn btn-primary w-full"
				disabled={$pages.length < 2 || $mergedPdf.loading}
			>
				{#if $mergedPdf.loading}
					<span class="loading loading-spinner"></span>Merging...
				{:else}
					Merge
				{/if}
			</button>
		</div>
	{/if}
</div>
