<script lang="ts">
	import { docs, pageNum, pages } from '$lib/stores'
	import type { Page } from '$lib/types'
	import PageCardOptions from './PageCardOptions.svelte'
	import PageCardThumbnail from './PageCardThumbnail.svelte'

	export let page: Page
	export let pageIndex: number

	let optionsModal: HTMLDialogElement

	$: doc = $docs[page.docId]
	$: pageNumber = $pageNum[page.pageId]
	$: multiPages = typeof pageNumber === 'number' ? false : true
</script>

{#if doc && page}
	{#if multiPages}
		<div
			class="absolute -top-1.5 -left-1.5 h-full w-full bg-base-200 rounded-xl border border-base-300"
			data-testid="page stack"
		/>
	{/if}

	<div
		class={`relative z-10 flex flex-col justify-between bg-base-200 border border-base-400 p-3 rounded-xl aspect-[180/280] ${multiPages ? 'shadow-sm' : ''}`}
	>
		<!-- Document Color -->
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1/2 rounded-b-xl"
			style="background-color: {doc.color};"
		/>

		<!-- Thumbnail -->
		<div class="h-full flex items-center">
			<PageCardThumbnail {page} />
		</div>

		<!-- Document name & page number in $pages -->
		<div class="text-center text-sm flex flex-col">
			<span class="truncate">{doc.name} </span>
			<span class="opacity-40 text-xs mt-1">
				Page
				{typeof pageNumber === 'number' ? pageNumber : `${pageNumber[0]} to ${pageNumber[1]}`}
			</span>
		</div>

		<!-- desktop -->
		<div class="absolute top-2 left-0 w-full hidden lg:group-hover:inline-flex">
			<ul class="bg-neutral text-neutral-content menu menu-horizontal rounded-box mx-auto">
				<PageCardOptions {doc} {page} {pageIndex} on:delete={() => pages.deletePage(page.pageId)} />
			</ul>
		</div>

		<!-- mobile -->
		<button
			class="btn btn-sm btn-ghost btn-circle bg-base-100 border border-base-300 absolute right-1 top-1 lg:hidden"
			on:click={() => optionsModal.showModal()}
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
				/>
			</svg>
		</button>
		<dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle" bind:this={optionsModal}>
			<div class="modal-box p-0">
				<ul class="menu p-0">
					<PageCardOptions
						{doc}
						{page}
						{pageIndex}
						on:delete={() => optionsModal.close()}
						on:preview={() => optionsModal.close()}
					/>
				</ul>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button></button>
			</form>
		</dialog>
	</div>
{/if}
