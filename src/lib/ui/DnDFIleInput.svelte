<script lang="ts">
	import { upload } from './icons'

	export let files: FileList | null

	let style = ''

	function dragOverHandler(ev: DragEvent) {
		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault()

		style = 'border-primary'
	}

	function dropHandler(ev: DragEvent) {
		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault()

		if (ev.dataTransfer?.files instanceof FileList) {
			files = ev.dataTransfer.files
		}

		style = ''
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="flex items-center justify-center w-full border-2 border-base-300 border-dashed rounded-box overflow-hidden {style}"
	on:dragover={dragOverHandler}
	on:drop={dropHandler}
	on:dragleave={() => (style = '')}
>
	<label
		data-testid="upload doc"
		for="dropzone-file"
		class="flex flex-col items-center justify-center w-full h-64 cursor-pointer bg-base-300"
	>
		<div
			class="prose flex flex-col items-center justify-center pt-5 pb-6 [&>svg]:stroke-neutral-content"
		>
			{@html upload}
			<p class="mb-2 text-sm">
				<span class="font-semibold">Click to upload</span> or drag and drop
			</p>
			<p class="text-xs">Supported format: <strong>PDF</strong></p>
		</div>
		<input
			bind:files
			type="file"
			multiple
			accept="application/pdf"
			id="dropzone-file"
			class="hidden"
		/>
	</label>
</div>
