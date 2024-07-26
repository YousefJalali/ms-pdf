<script lang="ts">
	import { FileInput, UploadButton } from '$lib/ui'
	import { docs, mergedPdf, pages } from '$lib/stores/merge'
	import SideBarList from './SideBarList.svelte'

	let files: FileList | null

	$: if (files) {
		for (const file of files) {
			// console.log(file)
			// console.log(`${file.name}: ${file.size} bytes`)

			docs.add(file)
		}
		files = null
	}
</script>

<div
	class={`relative flex flex-col justify-center flex-[2] min-w-80 border-base-300 rounded-2xl ${$pages.length ? 'p-4 border justify-between [&>*:first-child]:hidden' : ''}`}
>
	<!-- description  -->
	<div class="mb-8 prose">
		<h1>Merge Your PDFs Seamlessly!</h1>
		<p>
			Easily combine your PDF files into one cohesive document. Simply upload your files below. You
			can select multiple files at once for a quick and efficient merge!
		</p>
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
				on:click={docs.merge}
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
