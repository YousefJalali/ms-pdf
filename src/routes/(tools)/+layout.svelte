<script lang="ts">
	import { page } from '$app/stores'
	import { TOOLS } from '$lib/constants'

	let drawer: HTMLDivElement
</script>

<div class="drawer lg:drawer-open lg:px-6">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" bind:this={drawer} />
	<div class="drawer-content flex flex-col">
		<!-- <main> -->
		<div
			class="flex gap-8 min-h-[calc(100vh-64px-50px)] lg:min-h-[calc(100vh-64px-50px)] lg:max-h-[calc(100vh-64px-50px)] px-6 lg:p-0"
		>
			<slot />
		</div>
		<!-- </main> -->
	</div>

	<!-- nav -->
	<div class="drawer-side z-50 lg:h-[calc(100vh-64px-50px)] lg:mr-6">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 min-h-full xl:min-w-56 lg:rounded-box w-80 lg:w-fit p-4">
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
							class="[&>svg>g>*]:fill-neutral dark:[&>svg>g>*]:fill-neutral-content opacity-80 [&_svg]:size-6"
							>{@html tool.icon}</span
						>
						<span class="lg:hidden xl:inline-block">{tool.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
