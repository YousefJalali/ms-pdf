<script lang="ts">
	import { Reload } from 'svelte-radix'

	interface Props {
		title: any
		description: any
		loading?: boolean
		children?: import('svelte').Snippet
	}

	let { title, description, loading = false, children }: Props = $props()
</script>

<div class="max-w-lg mx-auto p-4 flex flex-col items-center justify-center text-center">
	{#if loading}
		<Reload class="h-8 w-8 animate-spin" />
	{/if}
	<h1 class="font-semibold tracking-tight text-3xl my-4">{title}</h1>
	<p class="text-muted-foreground text-sm">{description}</p>

	{@render children?.()}
</div>
