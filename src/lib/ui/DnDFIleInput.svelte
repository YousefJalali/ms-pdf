<script lang="ts">
	import { upload } from './icons'

	interface Props {
		files: FileList | null;
	}

	let { files = $bindable() }: Props = $props();

	let style = $state('')

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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="flex items-center justify-center w-full border-2 border-base-200 border-dashed rounded-box overflow-hidden {style}"
	ondragover={dragOverHandler}
	ondrop={dropHandler}
	ondragleave={() => (style = '')}
>
	<label
		data-testid="upload doc"
		for="dropzone-file"
		class="flex flex-col items-center justify-center w-full h-64 cursor-pointer bg-base-200"
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
