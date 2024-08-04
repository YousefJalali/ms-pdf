<script lang="ts">
	export let title
	export let description
	export let loading = false
</script>

<div class="prose flex flex-col items-center justify-center mx-auto text-center">
	{#if loading}
		<span class="loading loading-ring loading-lg mb-4"></span>
	{/if}
	<h1>{title}</h1>
	<p>{description}</p>

	<slot />
</div>
