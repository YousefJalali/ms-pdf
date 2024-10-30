<script>
	import { page } from '$app/stores'
	import { TOOLS } from '$lib/constants'

	export let drawer
</script>

<ul class="menu bg-base-100 min-h-full xl:min-w-64 w-[70vw] md:w-64 lg:w-fit p-0 py-6 gap-2">
	{#each TOOLS as tool}
		<li>
			<a
				aria-label={tool.name}
				href={tool.link}
				class={`rounded-none !bg-base-100 hover:!bg-primary/10 active:!bg-primary/20  ${$page.url.pathname === tool.link ? '!bg-gradient-to-r from-primary/20 [&_*]:!fill-primary [&_*]:!text-primary' : '[&_*]:!fill-neutral/70 [&_*]:!text-neutral/70'}`}
				on:click={() => drawer.click()}
			>
				<span class="[&_*]:fill-neutral dark:[&_>*]:fill-neutral-content [&_svg]:size-5"
					>{@html tool.icon}</span
				>
				<span class="lg:hidden xl:inline-block">{tool.name}</span>
			</a>
		</li>
	{/each}
</ul>
