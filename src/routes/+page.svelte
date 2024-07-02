<script lang="ts">
	import { onMount } from 'svelte'

	onMount(async () => {
		await import('@lottiefiles/lottie-player')
		// @ts-ignore
		// const { create } = await import('@lottiefiles/lottie-interactivity')
		// handleLoad(create)
	})
	// @ts-ignore
	// const handleLoad = (method) => {
	// 	method({
	// 		mode: 'normal',
	// 		player: '#firstLottie',
	// 		actions: [
	// 			{
	// 				visibility: [0, 1],
	// 				type: 'seek',
	// 				frames: [0, 500]
	// 			}
	// 		]
	// 	})
	// }

	let tools = [
		{
			name: 'Merge PDF',
			link: '/merge',
			description:
				'Combine multiple PDF files into a single, organized document with our Merge Tool. Perfect for consolidating reports, presentations, or any other documents, this tool allows you to seamlessly join files, ensuring a smooth and efficient workflow.'
		},
		{
			name: 'Split PDF',
			link: '/split',
			description:
				'Easily separate a large PDF into individual pages or custom segments. Whether you need to extract a single page or divide a document into multiple sections'
		}
	]
</script>

<section class="flex items-center h-[60vh]">
	<div>
		<h1 class="text-5xl font-black mb-4">Transform PDFs Like a Pro</h1>
		<p class="opacity-60 leading-relaxed">
			Step into a world where managing PDFs is as thrilling as a magician's trick! With our
			cutting-edge app, you can merge and split PDFs effortlessly. Fuse documents into a single
			masterpiece or break them apart with pinpoint accuracy. Turn your PDF tasks into a breeze and
			unleash your productivity!
		</p>
	</div>

	<div class="w-2/3">
		<!-- <lottie-player
			id="firstLottie"
			src="https://lottie.host/691a7996-25af-4446-9c6b-78d23cf930f1/uJjkoYOdpk.json"
			style="width:400px; height: 400px;"
			on:load={handleLoad}
		>
		</lottie-player> -->
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
	<h1 class="text-6xl font-black mb-8">Our Tools</h1>

	<div class="flex gap-8">
		{#each tools as tool}
			<a href={tool.link} class="flex-1 max-w-sm border rounded-2xl p-6 hover:bg-slate-100">
				<h2 class="font-bold text-2xl mb-2">{tool.name}</h2>
				<p class="opacity-60 leading-relaxed">{tool.description}</p>
			</a>
		{/each}
	</div>
</section>
