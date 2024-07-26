<script>
	import '../app.css'
	import { page } from '$app/stores'

	const newPage = `<svg width="12" height="12" class="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 11H37V29" stroke="currentColor" stroke-width="4" stroke-linecap="butt" stroke-linejoin="bevel"></path><path d="M11.5439 36.4559L36.9997 11" stroke="currentColor" stroke-width="4" stroke-linecap="butt" stroke-linejoin="bevel"></path></svg>`

	let smallDevice = false

	//@ts-ignore
	const attachListener = (e) => {
		const mediaQuery = window.matchMedia('(width <= 640px)')

		mediaQuery.addEventListener('change', ({ matches }) => {
			smallDevice = matches
		})
	}
</script>

<svelte:window use:attachListener />

{#if smallDevice}
	<div class="h-screen w-screen flex flex-col text-center p-6 justify-center items-center prose">
		<h1>😔</h1>
		<h2>Mobile Device Not Supported</h2>
		<p>
			We're sorry, but it looks like you're using a mobile device. Unfortunately, our PDF merging
			service isn't supported on mobile at the moment. Please try opening this application on a
			desktop for the best experience. Thank you for your understanding.
		</p>
	</div>
{:else}
	<main class="container mx-auto max-w-5xl flex flex-col min-h-screen">
		<header class="navbar p-0 bg-base-100 h-[100px]">
			<div class="flex-1">
				<a class="link link-hover text-4xl" href="/">Logo</a>
			</div>

			<nav class="flex-none">
				<ul class="menu menu-horizontal px-1">
					{#each ['merge', 'split', 'compress'] as path}
						<li>
							<a
								href="/{path}"
								class="capitalize {$page.url.pathname === '/' + path ? 'active' : ''}">{path} PDF</a
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
		</header>

		<slot />

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
{/if}
