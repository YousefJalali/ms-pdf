<script lang="ts">
	import { colors, pages, previews, thumbnails } from '../../stores/'

	export let file
</script>

<div
	class="w-fit h-fit border-2 p-2"
	style="border-color: {Object.keys($colors).length > 1
		? $colors[file.parentId].color
		: 'transparent'}"
>
	<div class="relative">
		<!-- <div class="absolute top-0 left-0 h-full w-full z-10" /> -->

		{#if $thumbnails[file.docId]}
			{#if $thumbnails[file.docId].status === 'loading'}
				<p>loading...</p>
			{:else}
				<img src={$thumbnails[file.docId].src} alt="ha" />
			{/if}
		{/if}
		<!-- <canvas bind:this={canvases[file.docId]} id={file.docId} height="1" width="1"></canvas> -->
		<div>
			<p class="text-center">
				{$pages[file.docId] || 0} page{$pages[file.docId] > 1 ? 's' : ''}
			</p>
			<div class="flex justify-between">
				<button
					disabled={$pages[file.docId] <= 1}
					on:click={() => previews.split(file.docId)}
					class="disabled:bg-slate-600">split</button
				>
				<button class="text-red-600" on:click={() => previews.remove(file.docId)}>remove</button>
			</div>
			<!-- <p>{file.id}</p> -->
		</div>
	</div>
</div>
