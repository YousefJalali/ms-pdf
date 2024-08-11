<script lang="ts">
	import '../app.css'
	import { page } from '$app/stores'
	import Alert from '$lib/ui/Alert.svelte'
	import { TOOLS } from '$lib/constants/'
	import { blankPage } from '$lib/ui'

	let drawer: HTMLDivElement
</script>

<div class="drawer container mx-auto max-w-5xl">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" bind:this={drawer} />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="navbar w-full px-4 lg:h-[100px] border-b lg:p-0 lg:border-0">
			<div class="mx-2 flex-1 px-2"><a href="/">LOGO</a></div>
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
			<div class="hidden flex-none lg:block">
				<!-- Navbar menu content here -->
				<ul class="menu menu-horizontal">
					{#each TOOLS as tool}
						<li>
							<a href={tool.link} class={$page.url.pathname === tool.link ? 'active' : ''}
								>{tool.name}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Page content here -->
		<!-- <main> -->
		<slot />

		<Alert />

		<footer class="footer footer-center text-base-content p-4 h-[50px]">
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
		<!-- </main> -->
	</div>

	<div class="drawer-side z-50">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 min-h-full w-80 p-4">
			<!-- Sidebar content here -->
			{#each TOOLS as tool}
				<li>
					<a
						href={tool.link}
						class={$page.url.pathname === tool.link ? 'active' : ''}
						on:click={() => drawer.click()}
					>
						{tool.name}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
