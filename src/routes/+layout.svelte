<script lang="ts">
	import '../app.css'
	import Alert from '$lib/ui/Alert.svelte'
	import { blankPage, drawer, moon, sun } from '$lib/ui'
</script>

<svelte:head>
	<meta name="google-site-verification" content="maUHEPNCAafwRrAAQo-ufXpX0pn_8GDOxfIeZEl4DYc" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex flex-col h-screen">
	<header class="navbar lg:hidden w-full px-4 lg:px-6 lg:h-[64px]">
		<div class="flex-1"><a class="btn btn-ghost btn-square" href="/">LOGO</a></div>

		<!-- dark mode -->
		<!-- <label class="swap swap-rotate btn btn-ghost btn-square -mr-2">
			<input
				aria-label="dark-mode-toggle"
				type="checkbox"
				class="theme-controller"
				value="business"
			/>

			{@html sun}
			{@html moon}
		</label> -->

		<!-- drawer button -->
		<div class="flex-none lg:hidden ml-2">
			<label for="nav-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
				{@html drawer}
			</label>
		</div>
	</header>

	<!-- main content -->
	<slot />

	<Alert />

	<footer class="footer hidden footer-center text-base-content p-4 h-[50px]">
		<aside>
			<p>
				Build by <a
					class="link group inline-flex items-center gap-1"
					href="https://github.com/YousefJalali"
					target="_blank">Yousef Jalali {@html blankPage}</a
				>
			</p>
		</aside>
	</footer>
</div>
