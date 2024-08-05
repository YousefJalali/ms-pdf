<script>
	import { page } from '$app/stores'
	import { TOOLS } from '$lib/constants'
</script>

<p>or explore other amazing tools we offer!</p>

<div class="flex flex-wrap gap-4 mt-6">
	{#each TOOLS.filter((tool) => tool.link !== $page.url.pathname) as tool}
		<a href={tool.link} class="btn [&>svg]:size-6">{@html tool.icon} {tool.name}</a>
	{/each}
</div>
