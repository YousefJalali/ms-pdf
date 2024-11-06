<script lang="ts">
	import Nav from './Nav.svelte'
	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()

	let drawer: HTMLDivElement | undefined = $state()
</script>

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
			<div class="flex-1 h-0 overflow-y-scroll">
				<div class="flex-1"><a class="btn btn-ghost btn-square" href="/">LOGO</a></div>
				<Nav {drawer} />
			</div>
		</div>

		<!-- Show Nav as fixed layer on md and lg screens -->
		<div
			class="shadow-xl hidden xl:!hidden lg:group-has-[:hover]:flex fixed top-0 ltr:left-0 rtl:right-0 h-full flex-col bg-base-100 z-50 [&_.title]:inline-block"
		>
			<div class="flex-1 h-0 overflow-y-scroll">
				<div class="flex-1"><a class="btn btn-ghost btn-square" href="/">LOGO</a></div>
				<Nav {drawer} />
			</div>
		</div>
	</div>
</div>
