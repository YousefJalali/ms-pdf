<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import * as Sheet from '$lib/components/ui/sheet/index.js'
	import { locale, locales, setLang, langNames, type Lang } from '$lib/i18n'
	import Nav from './(components)/Nav.svelte'
	import { Button } from '$lib/components/ui/button'
	import { ChevronDownIcon, ChevronsDown, PanelLeft } from 'lucide-svelte'

	interface Props {
		children?: import('svelte').Snippet
		data: {
			layout: number[] | undefined
			collapsed: boolean | undefined
		}
	}

	let { children, data }: Props = $props()

	let { layout, collapsed } = data

	let defaultLayout = layout || [25, 75]
	let defaultCollapsed = collapsed || false

	let windowWidth = $state(0)
	let isCollapsed = $state(defaultCollapsed)
	let collapsedSize = $derived(+(((36 + 18) / windowWidth) * 100).toFixed(2))
	let minNavSize = $derived(+((160 / windowWidth) * 100).toFixed(2))

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`
	}

	function onCollapse() {
		isCollapsed = true
		document.cookie = `PaneForge:collapsed=${true}`
	}

	function onExpand() {
		isCollapsed = false
		document.cookie = `PaneForge:collapsed=${false}`
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<!-- mobile header -->
<header class="flex items-center gap-4 px-4 border-b sm:hidden bg-background h-14">
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<div class="flex items-center justify-between w-full">
				<Button builders={[builder]} size="icon" variant="outline">
					<PanelLeft class="w-5 h-5 pointer-events-none" />
					<span class="sr-only">Toggle Menu</span>
				</Button>

				{@render logo()}

				<div></div>
			</div>
		</Sheet.Trigger>

		<Sheet.Content side="left" class="max-w-xs px-2">
			{@render nav()}
		</Sheet.Content>
	</Sheet.Root>
</header>

<Resizable.PaneGroup
	direction="horizontal"
	{onLayoutChange}
	class="items-stretch w-screen h-screen"
>
	<Resizable.Pane
		defaultSize={defaultLayout[0]}
		{collapsedSize}
		collapsible
		minSize={minNavSize}
		maxSize={25}
		{onCollapse}
		{onExpand}
		class="hidden sm:block"
	>
		{@render nav()}
	</Resizable.Pane>

	<Resizable.Handle withHandle />

	<Resizable.Pane defaultSize={defaultLayout[1]}>
		<div class="flex flex-col items-center justify-center h-full">
			{@render children?.()}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

{#snippet logo()}
	<div
		class="my-4 p-2 flex items-center {isCollapsed && windowWidth > 640 ? 'justify-center' : ''}"
	>
		<ChevronsDown
			class="text-white border rounded-lg bg-gradient-to-tr from-primary via-primary/70 to-primary size-9"
		/>
		{#if !(isCollapsed && windowWidth > 640)}
			<a class="ml-2 font-bold btn btn-ghost btn-square" href="/">PDF Daddy</a>
		{/if}
	</div>
{/snippet}

{#snippet nav()}
	<div class="flex flex-col justify-between h-full">
		<div>
			{@render logo()}
			<Nav isCollapsed={isCollapsed && windowWidth > 640} />
		</div>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline" class="gap-2 p-2 m-2 text-xl w-fit">
					{$locale === 'ar' ? '🇸🇦' : '🇺🇸'}
					{#if !(isCollapsed && windowWidth > 640)}
						<ChevronDownIcon class="w-4 h-4 opacity-50 pointer-events-none" />
					{/if}
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each locales as Lang[] as l}
					<DropdownMenu.Item
						onclick={() => {
							setLang(l)
						}}
					>
						{langNames[l].nativeName}</DropdownMenu.Item
					>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
{/snippet}
