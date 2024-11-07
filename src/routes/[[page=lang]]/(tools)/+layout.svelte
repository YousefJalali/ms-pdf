<script lang="ts">
	import { locale, locales, setLang, langNames } from '$lib/i18n'
	import Nav from './Nav.svelte'

	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()

	let drawer: HTMLDivElement | undefined = $state()

	let langPopover: HTMLDivElement

	function showPopover(e) {
		const { x, y, height } = e.target.getBoundingClientRect()

		langPopover.style.left = `${x}px`
		langPopover.style.bottom = `${16 + height}px`

		langPopover.showPopover()
	}
</script>

{#snippet nav()}
	<div class="flex flex-col flex-1 h-0 overflow-y-scroll [&>div]:w-fit">
		<div>
			<a class="btn btn-ghost btn-square" href="/">LOGO</a>
		</div>

		<div class="flex-1">
			<Nav {drawer} />
		</div>

		<button class="btn btn-sm px-1 ltr:ml-3 rtl:mr-3 mb-4 w-fit uppercase" onclick={showPopover}>
			{$locale}
			<svg
				width="12px"
				height="12px"
				class="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 2048 2048"
				><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg
			>
		</button>
	</div>
{/snippet}

<div class="drawer lg:drawer-open flex-1 lg:min-h-0">
	<input id="nav-drawer" type="checkbox" class="drawer-toggle" bind:this={drawer} />

	<!-- main content -->
	<div class="drawer-content flex-1 lg:min-h-0 flex flex-col bg-base-300">
		<div class="flex flex-1 lg:min-h-0 gap-8 px-6 lg:p-0">
			{@render children?.()}
		</div>
	</div>

	<!-- nav -->
	<div class="group drawer-side z-50 h-full">
		<label for="nav-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<div class="flex flex-col bg-base-100 h-full">
			{@render nav()}
		</div>

		<!-- Show Nav as fixed layer on md and lg screens -->
		<div
			class="shadow-xl hidden xl:!hidden lg:group-has-[:hover]:flex fixed top-0 ltr:left-0 rtl:right-0 h-full flex-col bg-base-100 z-50 [&_.title]:inline-block"
		>
			{@render nav()}
		</div>
	</div>
</div>

<div bind:this={langPopover} popover="" class="m-0 p-0 top-auto shadow-xl">
	<ul class="menu">
		{#each locales as l}
			<li>
				<button
					onclick={() => {
						setLang(l)
						langPopover.hidePopover()
					}}>{langNames[l].nativeName}</button
				>
			</li>
		{/each}
	</ul>
</div>
