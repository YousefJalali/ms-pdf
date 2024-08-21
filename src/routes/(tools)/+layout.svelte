<script lang="ts">
	import { page } from '$app/stores'
	import { TOOLS } from '$lib/constants'

	let drawer: HTMLDivElement
</script>

<div class="drawer lg:drawer-open">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" bind:this={drawer} />
	<div class="drawer-content flex flex-col">
		<!-- <main> -->
		<div
			class="flex gap-8 min-h-[calc(100vh-64px-25px)] lg:min-h-[calc(100vh-64px-32px-25px)] lg:max-h-[calc(100vh-64px-32px-25px)] p-6 pt-0 lg:p-0"
		>
			<slot />
		</div>
		<!-- </main> -->
	</div>

	<!-- nav -->
	<div class="drawer-side z-50 lg:h-[calc(100vh-64px-32px-25px)] lg:border-r">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-100 min-h-full xl:min-w-56 lg:rounded-box w-80 lg:w-fit p-4">
			<!-- Sidebar content here -->
			{#each TOOLS as tool}
				<li>
					<a
						href={tool.link}
						class={$page.url.pathname === tool.link
							? 'active [&>span>svg>g>*]:fill-neutral-content'
							: ''}
						on:click={() => drawer.click()}
					>
						<span
							class="[&>svg>g>*]:fill-neutral opacity-80 [&_svg]:size-6 lg:[&_svg]:size-8 xl:[&_svg]:size-6"
							>{@html tool.icon}</span
						>
						<span class="lg:hidden xl:inline-block">{tool.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
