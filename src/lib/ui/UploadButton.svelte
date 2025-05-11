<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import { Plus } from 'lucide-svelte'

	interface Props {
		files: FileList | null
	}

	let { files = $bindable() }: Props = $props()
</script>

<label for="file-input-button">
	<Button variant="outline" class="gap-2 w-full">
		<Plus />
		Add more Files
	</Button>
	<input
		bind:files
		type="file"
		multiple
		accept="application/pdf"
		id="file-input-button"
		class="hidden"
	/>
</label>
