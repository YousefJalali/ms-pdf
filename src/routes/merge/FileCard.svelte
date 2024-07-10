<script lang="ts">
	import { docs, pages, thumbnails } from '../../stores/'
	import type { Page } from '../../types'

	export let page: Page

	$: doc = $docs[page.docId]

	const zoom = `<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
				/>
			</svg>`

	const trash = `<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
				/>
			</svg>`

	const split = `<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
				/>
			</svg>`

	const rotate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
`
</script>

{#if doc && page}
	<div
		class="relative group flex flex-col justify-between bg-gray-200 p-3 rounded-xl w-[180px] h-[280px] overflow-hidden"
	>
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1/2 rounded-b-xl"
			style="background-color: {doc.color};"
		/>
		{#if $thumbnails[page.pageId]}
			{#if $thumbnails[page.pageId].status === 'loading'}
				<div class="w-full h-[200px]">
					<p>loading...</p>
				</div>
			{:else}
				<img class="shadow mx-auto" src={$thumbnails[page.pageId].src} alt="ha" />
			{/if}
		{/if}

		<div class="text-center text-sm flex flex-col">
			<span class="truncate">{doc.name} {doc.showPages ? `(page ${page.pageNum})` : ''}</span>
			<span class="opacity-40">{doc.showPages ? '1 page' : `${doc.pageCount} pages`} </span>
			<!-- <span>{doc.showPages} / {page.pageVisible}</span> -->
		</div>
		<!-- <canvas bind:this={canvases[page.docId]} id={page.docId} height="1" width="1"></canvas> -->
		<div
			class="absolute top-0 left-0 hidden group-hover:flex justify-around bg-gray-200 *:text-black w-full p-2 py-4"
		>
			<button
				disabled={!doc.pageCount || doc.pageCount <= 1}
				on:click={() => docs.toggleShowPages(page.docId)}
				class="disabled:text-gray-400 disabled:cursor-not-allowed"
				>{@html split}
			</button>

			<button class="text-red-600" on:click={() => pages.removePage(page.pageId)}
				>{@html trash}
			</button>

			<button>{@html zoom}</button>

			<button>{@html rotate}</button>
		</div>
	</div>
{/if}
