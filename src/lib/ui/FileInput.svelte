<script lang="ts">
	import { upload } from './icons'

	export let files: FileList | null
</script>

<div class="flex items-center justify-center w-full">
	<label
		data-testid="upload doc"
		for="dropzone-file"
		class="flex flex-col items-center justify-center w-full h-64 border-2 border-base-300 border-dashed rounded-btn cursor-pointer bg-base-200"
	>
		<div
			class="prose flex flex-col items-center justify-center pt-5 pb-6 [&>svg]:stroke-neutral-content"
		>
			{@html upload}
			<p class="mb-2 text-sm">
				<span class="font-semibold">Click to upload</span> or drag and drop
			</p>
			<p class="text-xs">PDF (MAX. 5mb)</p>
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
