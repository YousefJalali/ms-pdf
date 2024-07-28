<script lang="ts">
	import { TOOLS } from '$lib/constants'
	import { onMount } from 'svelte'

	onMount(async () => {
		await import('@lottiefiles/lottie-player')
	})
</script>

<section class="flex items-center h-[60vh]">
	<div class="prose">
		<h1 class="text-5xl font-black">Transform PDFs Like a Pro</h1>
		<p>
			Step into a world where managing PDFs is as thrilling as a magician's trick! With our
			cutting-edge app, you can merge and split PDFs effortlessly. Fuse documents into a single
			masterpiece or break them apart with pinpoint accuracy. Turn your PDF tasks into a breeze and
			unleash your productivity!
		</p>
	</div>

	<div class="w-2/3 min-w-[400px]">
		<lottie-player
			src="https://lottie.host/691a7996-25af-4446-9c6b-78d23cf930f1/uJjkoYOdpk.json"
			background="#FFFFFF"
			speed="1"
			style="width: 400px; height: 400px"
			loop
			autoplay
			direction="1"
			mode="normal"
		></lottie-player>
	</div>
</section>

<section class="my-24">
	<h2 class="text-6xl font-black mb-8">Our Tools</h2>

	<div class="flex flex-wrap gap-8">
		{#each TOOLS as tool}
			<a
				href={tool.link}
				class="prose min-w-96 flex-1 max-w-sm border rounded-2xl p-6 hover:bg-base-200"
			>
				<span>{@html tool.icon}</span>
				<h3>{tool.name}</h3>
				<p>{tool.description}</p>
			</a>
		{/each}
	</div>
</section>
