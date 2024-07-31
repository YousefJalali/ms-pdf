<script>
	import '../app.css'
	import { page } from '$app/stores'
	import Alert from '$lib/ui/Alert.svelte'

	const newPage = `<svg width="12" height="12" class="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 11H37V29" stroke="currentColor" stroke-width="4" stroke-linecap="butt" stroke-linejoin="bevel"></path><path d="M11.5439 36.4559L36.9997 11" stroke="currentColor" stroke-width="4" stroke-linecap="butt" stroke-linejoin="bevel"></path></svg>`
</script>

<div class="drawer container mx-auto max-w-5xl">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="navbar w-full lg:h-[100px]">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-6 w-6 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</label>
			</div>
			<div class="mx-2 flex-1 px-2"><a href="/">LOGO</a></div>
			<div class="hidden flex-none lg:block">
				<ul class="menu menu-horizontal">
					<!-- Navbar menu content here -->
					<li><a href="/merge">Merge PDF</a></li>
					<li><a href="/split">Split PDF</a></li>
					<li><a href="/compress">Compress PDF</a></li>
					<li><a href="/pdf-to-image">PDF to Image</a></li>
				</ul>
			</div>
		</div>

		<!-- Page content here -->
		<!-- <main class="relative flex flex-col min-h-screen"> -->
		<slot />

		<Alert />

		<footer class="footer footer-center text-base-content p-4 h-[50px]">
			<aside>
				<p>
					Build by <a
						class="link group inline-flex items-center gap-1"
						href="https://github.com/YousefJalali"
						target="_blank">Yousef Jalali {@html newPage}</a
					>
				</p>
			</aside>
		</footer>
		<!-- </main> -->
	</div>

	<div class="drawer-side">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 min-h-full w-80 p-4">
			<!-- Sidebar content here -->
			<li><a href="/merge">Merge PDF</a></li>
			<li><a href="/split">Split PDF</a></li>
			<li><a href="/compress">Compress PDF</a></li>
			<li><a href="/pdf-to-image">PDF to Image</a></li>
		</ul>
	</div>
</div>
