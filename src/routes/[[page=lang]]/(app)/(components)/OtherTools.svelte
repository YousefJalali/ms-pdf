<script>
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { routes } from '$lib/constants'
</script>

<p class="my-4 text-muted-foreground text-sm">or explore other amazing tools we offer!</p>

<div class="flex flex-wrap sm:flex-nowrap w-fit gap-4 mx-auto">
	{#each routes.filter((route) => !page.url.pathname.includes(route.href)) as route}
		<Button variant="secondary" href={route.href}>
			<route.icon class="mr-2 size-4" />
			{route.title}
		</Button>
	{/each}
</div>
