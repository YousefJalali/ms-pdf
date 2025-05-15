<script lang="ts">
	import { cn } from '$lib/utils.js'
	import { Button } from '$lib/components/ui/button'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import { routes } from '$lib/constants'
	import { page } from '$app/state'

	let { isCollapsed } = $props()
</script>

<div data-collapsed={isCollapsed} class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
	<nav
		class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		{#each routes as route}
			{#if isCollapsed}
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild let:builder>
						<Button
							href={route.href}
							builders={[builder]}
							variant={page.url.pathname.includes(route.href) ? 'default' : 'ghost'}
							size="icon"
							class={cn(
								'size-9',
								route.variant === 'default' &&
									'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
							)}
						>
							<route.icon class="size-4" aria-hidden="true" />
							<span class="sr-only">{route.title}</span>
						</Button>
					</Tooltip.Trigger>

					<Tooltip.Content side="right" class="flex items-center gap-4">
						{route.title}

						<!-- {#if route.label}
							<span class="text-muted-foreground ml-auto">
								{route.label}
							</span>
						{/if} -->
					</Tooltip.Content>
				</Tooltip.Root>
			{:else}
				<Button
					href={route.href}
					variant={page.url.pathname.includes(route.href) ? 'default' : 'ghost'}
					size="sm"
					class={cn('justify-start', {
						'dark:bg-muted dark:hover:bg-muted dark:text-white dark:hover:text-white':
							route.href === page.url.pathname
					})}
				>
					<route.icon class="mr-2 size-4" aria-hidden="true" />

					{route.title}

					<!-- {#if route.label}
						<span
							class={cn('ml-auto', {
								'text-background dark:text-white': route.href === page.url.pathname
							})}
						>
							{route.label}
						</span>
					{/if} -->
				</Button>
			{/if}
		{/each}
	</nav>
</div>
