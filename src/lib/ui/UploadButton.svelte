<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button'
	import { Plus } from 'lucide-svelte'

	interface Props {
		files: FileList | null
		props: {
			iconOnly?: boolean
			attr?: any
		}
	}

	let { files = $bindable(), props = {} }: Props = $props()

	let { iconOnly, attr } = props
</script>

<label for="file-input-button">
	<a
		href={null}
		class={buttonVariants({ variant: 'outline', size: iconOnly ? 'icon' : 'default' })}
	>
		<Plus class="size-4" />

		{#if !iconOnly}
			<span class="ml-2">Add More Files</span>
		{/if}
	</a>

	<input
		bind:files
		type="file"
		multiple
		accept="application/pdf"
		id="file-input-button"
		class="hidden"
	/>
</label>
