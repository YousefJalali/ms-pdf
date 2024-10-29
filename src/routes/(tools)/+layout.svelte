<script lang="ts">
	import Nav from './Nav.svelte'

	let drawer: HTMLDivElement
</script>

<div class="drawer lg:drawer-open flex-1 lg:min-h-0">
	<input id="nav-drawer" type="checkbox" class="drawer-toggle" bind:this={drawer} />

	<!-- main content -->
	<!-- drawer-content flex-1 lg:min-h-0 flex flex-col has-[#dropzone-file]:lg:bg-base-200 has-[#dropzone-file]:lg:rounded-box has-[#dropzone-file]:lg:p-3 -->
	<div class="drawer-content flex-1 lg:min-h-0 flex flex-col bg-base-200">
		<div class="flex flex-1 lg:min-h-0 gap-8 px-6 lg:p-0">
			<slot />
		</div>
	</div>

	<!-- nav -->
	<div class="drawer-side z-50 h-full">
		<label for="nav-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<div class="flex-1"><a class="btn btn-ghost btn-square" href="/">LOGO</a></div>

		<Nav {drawer} />
	</div>
</div>
