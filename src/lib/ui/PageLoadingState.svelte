<script lang="ts">
	interface Props {
		title: any;
		description: any;
		loading?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		title,
		description,
		loading = false,
		children
	}: Props = $props();
</script>

<div class="max-w-4xl mx-auto prose flex flex-col items-center justify-center text-center">
	{#if loading}
		<span class="loading loading-ring loading-lg mb-4"></span>
	{/if}
	<h1>{title}</h1>
	<p>{description}</p>

	{@render children?.()}
</div>
