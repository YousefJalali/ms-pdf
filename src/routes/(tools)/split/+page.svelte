<script lang="ts">
	import JSZip from 'jszip'
	import { page } from '$app/stores'
	import { docs, pages, previews, thumbnails, uploadingDocs } from '$lib/stores'
	import { DocItem, DocItemOptions, PageLoadingState, trash } from '$lib/ui'
	import { getPageAsBlob } from '$lib/utils'
	import { writable } from 'svelte/store'
	import { beforeNavigate } from '$app/navigation'
	import { states, TOOLS } from '$lib/constants/'
	import Layout from '../Layout.svelte'
	import OtherTools from '../OtherTools.svelte'
	import Cards from '../merge/(Cards)/Cards.svelte'
	import PageCard from '../merge/(Cards)/(PageCard)/PageCard.svelte'
	import Preview from '../merge/(Cards)/Preview.svelte'

	let splitType = 'range'
	let downloaded = false
	let ranges: { [pageIndex: number]: string } = {}
	let rangeFrom = 1
	let rangeTo = 1
	let displayRanges = []
	$: displayRanges = Object.keys(ranges).map((from, i, arr) => {
		return [+from + 1, +arr[i + 1] || $pages.length]
	})

	$: if ($pages.length && !ranges[0]) {
		ranges[0] = $pages[0].pageId
	}

	//add range if new doc is added
	let docCount = 0
	$: docsLength = Object.keys($docs).length
	$: if (docsLength > docCount && docsLength > 1) {
		let lastDoc = $docs[Object.keys($docs)[docsLength - 1]]
		const index = $pages.length - lastDoc.pageCount

		ranges[index] = $pages[index].pageId

		docCount = docsLength
	}

	// $: if (rangeTo > $pages.length) rangeTo = $pages.length
	// $: if (rangeFrom > $pages.length) rangeFrom = $pages.length
	// $: if (rangeTo < rangeFrom) rangeTo = rangeFrom
	//[[], [], []]
	function addRange() {
		let from = { [rangeFrom - 1]: $pages[rangeFrom - 1].pageId }
		let to =
			rangeTo < $pages.length
				? { [rangeTo]: $pages[rangeTo].pageId }
				: { [$pages.length - 1]: $pages[$pages.length - 1].pageId }

		if (!Object.keys(ranges).length) {
			ranges[0] = $pages[0].pageId
		}

		//merge ranges
		for (let i = rangeFrom; i < rangeTo; i++) {
			delete ranges[i]
		}

		ranges = {
			...ranges,
			...from,
			...to
		}

		pages.hideAll(ranges)
	}

	function deleteRange(index: number) {
		delete ranges[index]

		ranges = ranges
		pages.hideAll(ranges)
	}

	let downloading = false
	async function download() {}

	function reset() {
		// files = null
		downloading = false
		downloaded = false
	}

	function splitTypeHandler(e: Event) {
		//@ts-ignore
		const { value } = e.target
		if (value === 'all') {
			pages.showAll()
		} else {
			pages.hideAll(ranges)
		}
	}

	const description = {
		all: 'Split your PDF into individual pages, creating a separate file for each page. Ideal for when you need to extract every page separately.',
		range:
			'Specify the page ranges you want to split. Enter the start and end page numbers to extract specific sections of your PDF. '
	}
</script>

{#if downloading}
	<PageLoadingState
		loading
		title={states[$page.url.pathname].downloading.title}
		description={states[$page.url.pathname].downloading.description}
	/>
{:else if downloaded}
	<PageLoadingState
		title={states[$page.url.pathname].downloaded.title}
		description={states[$page.url.pathname].downloaded.description}
	>
		<button class="btn btn-primary btn-outline btn-wide" on:click={reset}>Start Over</button>

		<OtherTools />
	</PageLoadingState>
{:else if !Object.keys($thumbnails).length && $uploadingDocs}
	<PageLoadingState
		loading
		title={states[$page.url.pathname].uploading.title}
		description={states[$page.url.pathname].uploading.description}
	/>
{:else}
	<Layout>
		<svelte:fragment slot="cards">
			<Cards let:page let:pageIndex>
				{#if page.isVisible}
					<PageCard {page} {pageIndex} />
				{/if}
				<!-- {#if ranges[pageIndex - 1]}
					<div
						class="absolute top-0 -right-2 h-full w-[2px] aspect-[180/280] bg-black inline-block"
					/>
				{/if} -->
			</Cards>
			{#if Object.keys($previews).length && $pages.length}
				<Preview />
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="side">
			<!-- <ul class="w-full h-0 flex-auto p-0 overflow-y-scroll hidden lg:block" data-testid="doc list">
				{#each Object.values($docs) as doc}
					<DocItem {doc}>
						<DocItemOptions {doc} />
					</DocItem>
				{/each}
			</ul> -->

			<div class="bg-base-200 p-1.5 h-fit my-4 rounded-xl">
				<div class="flex gap-1">
					{#each ['range', 'all'] as split}
						<input
							class="btn btn-sm btn-ghost text-primary flex-1"
							type="radio"
							name="Split By Range"
							aria-label={split === 'range' ? 'Split By Range' : 'Split All'}
							bind:group={splitType}
							on:change={splitTypeHandler}
							value={split}
						/>
					{/each}
				</div>
			</div>

			<p class="text-sm opacity-80">
				{#if splitType === 'all'}
					{description['all']}
				{:else}
					{description['range']}
				{/if}
			</p>

			{#if splitType === 'range'}
				<div class="join mt-4">
					<input
						type="number"
						min={1}
						max={$pages.length}
						class="join-item input input-sm input-bordered w-full"
						placeholder="From"
						bind:value={rangeFrom}
					/>
					<input
						type="number"
						min={1}
						max={$pages.length}
						class="join-item input input-sm input-bordered w-full"
						placeholder="To"
						bind:value={rangeTo}
					/>
					<button class="join-item btn btn-sm btn-primary" on:click={addRange}>Add Range</button>
				</div>

				<ul class="mt-4 space-y-2">
					{#each displayRanges as range, index}
						<li class="flex justify-between items-center border border-base-300 rounded-lg p-2">
							<span class="font-semibold text-sm flex items-center gap-4">
								Page {range[0]}
								<span class="opacity-60 font-normal"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-6 inline-block"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
										/>
									</svg>
								</span>
								Page {range[1]}
							</span>

							{#if index > 0}
								<button class="link link-sm text-error" on:click={() => deleteRange(range[0] - 1)}>
									{@html trash}
								</button>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="cta">
			<button disabled class="btn btn-primary flex-1" on:click={download}>
				{#if downloading}
					<span class="loading loading-spinner"></span>
				{/if}
				Split {splitType === 'all'
					? `(${$pages.length} PDFs)`
					: Object.keys(ranges).length > 1
						? `(${Object.keys(ranges).length} PDFs)`
						: ''}
			</button>
		</svelte:fragment>
	</Layout>
{/if}
