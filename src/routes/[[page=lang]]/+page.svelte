<script lang="ts">
	import { TOOLS } from '$lib/constants'
	import { locale } from '$lib/i18n'

	function scrollToBottom() {
		if (!window || !toolsSection) return
		window.scrollTo({
			top: document.body.scrollHeight - toolsSection.scrollHeight - 100,
			behavior: 'smooth'
		})
	}

	let toolsSection: HTMLElement
</script>

<!-- Landing Page -->
<div class="px-6 lg:p-0">
	<section class="flex items-center justify-center min-h-[calc(100vh-64px)]">
		<div class="text-center prose lg:prose-xl max-w-4xl">
			<h1>Transform PDFs Like a Pro</h1>
			<p>
				Step into a world where managing PDFs is as thrilling as a magician's trick! With our
				cutting-edge app, you can merge and split PDFs effortlessly. Fuse documents into a single
				masterpiece or break them apart with pinpoint accuracy. Turn your PDF tasks into a breeze
				and unleash your productivity!
			</p>
			<button class="btn btn-primary" onclick={scrollToBottom}>Get Started</button>
		</div>
	</section>

	<section class="mb-6 lg:mb-24 max-w-4xl mx-auto" bind:this={toolsSection}>
		<h2 class="text-2xl lg:text-4xl font-black mb-8">Our Tools</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each TOOLS as tool}
				<a
					href={`${$locale}/${tool.link}`}
					class="flex-1 border rounded-box p-4 lg:p-6 hover:bg-base-200"
				>
					<div class="flex lg:flex-col lg:items-start items-center gap-4 mb-3">
						<span>{@html tool.icon}</span>
						<h3 class="font-bold text-lg">{tool.name}</h3>
					</div>
					<p class="opacity-80">{tool.description}</p>
				</a>
			{/each}
		</div>
	</section>
</div>
