<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte'

	interface Props {
		title: string
		description: string
		Icon?: typeof LoaderCircle
		children?: import('svelte').Snippet
	}
	let { title, description, Icon, children }: Props = $props()
</script>

<div class="max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-4">
	{#if Icon}
		<Icon class="animate-spin size-10" />
	{/if}
	<h1 class="font-semibold tracking-tight text-3xl my-3">{title}</h1>
	<p class="text-muted-foreground text-sm mb-4">
		{description}
	</p>

	{@render children?.()}
</div>
