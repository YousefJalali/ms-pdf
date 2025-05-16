<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable'
	import { locale, locales, setLang, langNames, type Lang } from '$lib/i18n'
	import Nav from './(components)/Nav.svelte'
	import { Button } from '$lib/components/ui/button'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import { ChevronDownIcon, ChevronsDown, PanelLeft } from 'lucide-svelte'
	import * as Sheet from '$lib/components/ui/sheet/index.js'

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
<header class="sm:hidden bg-background flex h-14 items-center gap-4 border-b px-4">
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<div class="flex items-center justify-between w-full">
				<Button builders={[builder]} size="icon" variant="outline">
					<PanelLeft class="h-5 w-5" />
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
	class="h-screen w-screen items-stretch"
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
		<div class="flex h-full items-center justify-center">
			{@render children?.()}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

{#snippet logo()}
	<div
		class="my-4 p-2 flex items-center {isCollapsed && windowWidth > 640 ? 'justify-center' : ''}"
	>
		<ChevronsDown
			class="bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg size-9 border text-white"
		/>
		{#if !(isCollapsed && windowWidth > 640)}
			<a class="btn btn-ghost btn-square ml-2 font-bold" href="/">PDF Daddy</a>
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
				<Button builders={[builder]} variant="outline" class="w-fit m-2 gap-2 text-xl p-2">
					{$locale === 'ar' ? '🇸🇦' : '🇺🇸'}
					{#if !(isCollapsed && windowWidth > 640)}
						<ChevronDownIcon class="h-4 w-4 opacity-50" />
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
