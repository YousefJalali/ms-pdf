<script lang="ts">
	export let title
	export let description
	export let loading = false
</script>

<div class="max-w-4xl mx-auto prose flex flex-col items-center justify-center text-center">
	{#if loading}
		<span class="loading loading-ring loading-lg mb-4"></span>
	{/if}
	<h1>{title}</h1>
	<p>{description}</p>

	<slot />
</div>
