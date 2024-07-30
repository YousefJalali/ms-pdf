<script>
	import '../app.css'
	import { page } from '$app/stores'
	import Alert from '$lib/ui/Alert.svelte'

	const newPage = `<svg width="12" height="12" class="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 11H37V29" stroke="currentColor" stroke-width="4" stroke-linecap="butt" stroke-linejoin="bevel"></path><path d="M11.5439 36.4559L36.9997 11" stroke="currentColor" stroke-width="4" stroke-linecap="butt" stroke-linejoin="bevel"></path></svg>`
</script>

<main class="relative container mx-auto max-w-5xl flex flex-col min-h-screen">
	<header class="navbar bg-base-100 h-[100px] pr-6 lg:p-0">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h8m-8 6h16"
						/>
					</svg>
				</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
				>
					<li><a href="/merge">Merge PDF</a></li>
					<li><a href="/split">Split PDF</a></li>
					<li><a href="/compress">Compress PDF</a></li>
					<li><a href="/pdf-to-image">PDF to Image</a></li>
				</ul>
			</div>

			<a class="btn btn-ghost text-xl" href="/">PDF Baba</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/merge">Merge PDF</a></li>
				<li><a href="/split">Split PDF</a></li>
				<li><a href="/compress">Compress PDF</a></li>
				<li><a href="/pdf-to-image">PDF to Image</a></li>
			</ul>
		</div>
		<div class="navbar-end">
			<a class="btn" href="/">Get Started</a>
		</div>
	</header>

	<!-- <header class="navbar p-0 bg-base-100 h-[100px]">
		<div class="flex-1">
			<a class="link link-hover text-4xl" href="/">Logo</a>
		</div>

		<nav class="flex-none">
			<ul class="menu menu-horizontal px-1">
				{#each ['merge', 'split', 'compress'] as path}
					<li>
						<a href="/{path}" class="capitalize {$page.url.pathname === '/' + path ? 'active' : ''}"
							>{path} PDF</a
						>
					</li>
				{/each}
				<li>
					<a
						href="/pdf-to-image"
						class="capitalize {$page.url.pathname === '/' + 'pdf-to-image' ? 'active' : ''}"
						>PDF to Image</a
					>
				</li>
			</ul>
		</nav>
	</header> -->

	<div
		class="flex gap-8 min-h-[calc(100vh-100px-32px-25px)] lg:h-[calc(100vh-100px-32px-25px)] p-6 lg:p-0"
	>
		<slot />
	</div>

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
</main>
