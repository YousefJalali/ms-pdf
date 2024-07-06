<script>
	import '../app.css'
	import { page } from '$app/stores'
</script>

<main class="container mx-auto max-w-5xl flex flex-col min-h-screen">
	<header class="flex items-center justify-between h-[100px]">
		<h1 class="text-3xl font-bold"><a href="/">Logo</a></h1>

		<nav>
			<ul class="flex gap-8">
				{#each ['merge', 'split'] as path}
					<li style="border-bottom: {$page.url.pathname === '/' + path ? '3px solid black' : ''};">
						<a href="/{path}" class="capitalize">{path}</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<slot />

	<!-- <footer class="bg-white rounded-lg py-6 mt-8">
		<div class="w-full mx-auto max-w-screen-xl md:flex md:items-center md:justify-between">
			<span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
				>© 2023 <a href="https://flowbite.com/" class="hover:underline">Flowbite™</a>. All Rights
				Reserved.
			</span>
			<ul
				class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0"
			>
				<li>
					<a href="#" class="hover:underline me-4 md:me-6">About</a>
				</li>
				<li>
					<a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>
				</li>
				<li>
					<a href="#" class="hover:underline me-4 md:me-6">Licensing</a>
				</li>
				<li>
					<a href="#" class="hover:underline">Contact</a>
				</li>
			</ul>
		</div>
	</footer> -->
</main>
