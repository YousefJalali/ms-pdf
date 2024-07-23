<script lang="ts">
	import { FileInput } from '$lib/ui'
	import { docs, pages } from '$lib/stores'
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

	const plusIcon = `<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="size-6"
						>
							<path
								fill-rule="evenodd"
								d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
								clip-rule="evenodd"
							/>
						</svg>`
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

	<div class={`flex flex-col ${$pages.length ? 'h-full' : ''}`}>
		<!-- input -->
		<div>
			{#if $pages.length}
				<label for="file-input-button">
					<div class="btn btn-outline btn-primary w-full">{@html plusIcon}Add More Docs</div>
					<input
						bind:files
						type="file"
						multiple
						accept="application/pdf"
						id="file-input-button"
						class="hidden"
					/>
				</label>
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

			<button on:click={pages.merge} class="btn btn-primary w-full" disabled={$pages.length < 2}
				>Merge</button
			>
		</div>
	{/if}
</div>
