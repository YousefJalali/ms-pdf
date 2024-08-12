<script lang="ts">
	import { plus } from './icons'

	export let files: FileList | null
</script>

<label for="file-input-button">
	<div class="btn btn-sm lg:btn-md w-full">{@html plus}Add Files</div>
	<input
		bind:files
		type="file"
		multiple
		accept="application/pdf"
		id="file-input-button"
		class="hidden"
	/>
</label>
