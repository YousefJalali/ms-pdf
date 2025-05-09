<script lang="ts">
	import JSZip from 'jszip'
	import { docs, pages, previews, thumbnails, uploadingDocs } from '$lib/stores'
	import { arrowLongRight, PageLoadingState, plus, trash } from '$lib/ui'
	import { generateFileName, getInputAsUint8Array } from '$lib/utils'
	import Layout from '../Layout.svelte'
	import OtherTools from '../OtherTools.svelte'
	import DraggableCards from '../DraggableCards.svelte'
	import PageCard from '../(PageCard)/PageCard.svelte'
	import Preview from '../(PageCard)/Preview.svelte'
	import { PDFDocument } from 'pdf-lib'
	import { t } from '$lib/i18n'
	import DocList from '../DocList.svelte'

	const description = {
		all: $t('split.all.desc'),
		range: $t('split.by.range.desc')
	}

	let splitType = $state('range')
	let downloading = $state(false)
	let downloaded = $state(false)
	let ranges: { [pageIndex: number]: string } = $state({})
	let rangeFrom = $state(1)
	let rangeTo = $state(1)
	let displayRanges: number[][] = $state([])
	let docCount = $state(0)
	let docsLength = $derived(Object.keys($docs).length)

	$effect(() => {
		displayRanges = Object.keys(ranges).map((from, i, arr) => {
			return [+from + 1, +arr[i + 1] || $pages.length]
		})
	})

	$effect(() => {
		if ($pages.length && !ranges[0]) {
			ranges[0] = $pages[0].pageId
		}
	})

	//add range if new doc is added
	$effect(() => {
		if (docsLength > docCount && docsLength > 1) {
			let lastDoc = $docs[Object.keys($docs)[docsLength - 1]]
			const index = $pages.length - lastDoc.pageCount

			ranges[index] = $pages[index].pageId

			docCount = docsLength
		}
	})

	// delete range if doc is removed
	$effect(() => {
		if (ranges[0] && docCount > docsLength) {
			let pageExist = false
			for (let pageId of Object.values(ranges)) {
				$pages.forEach((p) => {
					if (pageId === p.pageId) {
						pageExist = true
					}
				})
				if (!pageExist) {
					for (let [key, val] of Object.entries(ranges)) {
						if (val === pageId) {
							delete ranges[key]
						}
						console.log(key, val)
					}
					console.log('page removed', pageId, ranges, $pages)
				}
				pageExist = false
			}

			docCount = docsLength
		}
	})

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

	async function download(blobs: Blob[]) {
		let blob: Blob | null = null

		if (blobs.length === 1) {
			if (blobs[0] instanceof Blob) {
				blob = blobs[0]
			}
		} else {
			const zip = new JSZip()

			let i = 0
			for (let blob of blobs) {
				if (blob instanceof Blob) {
					zip.file(`Split (${i}).pdf`, blob, {
						base64: true
					})

					i++
				}
			}

			blob = await zip.generateAsync({ type: 'blob' })
		}

		downloading = false
		if (!blob) return

		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = generateFileName('Split')
		document.body.append(link)
		link.click()
		link.remove()

		await docs.reset()

		downloaded = true
	}

	function findIndex(arr: number[], num: number) {
		for (let i = 0; i < arr.length; i++) {
			console.log(i, arr, arr.length - 1)
			if (num === 0) return 0
			if (num <= arr[i]) return i
		}

		return arr.length - 1
	}

	async function split() {
		downloading = true

		const froms = Object.keys(ranges).map((key) => +key)
		const docsSplitPromise = new Array(froms.length).fill(0).map(() => PDFDocument.create())
		const docsSplit = await Promise.all(docsSplitPromise)

		const pdfDocsPromise = Object.keys($docs).map((docId) =>
			getInputAsUint8Array($docs[docId].file)
				.then((src) => PDFDocument.load(src))
				.then((doc) => ({ [docId]: doc }))
		)
		const pdfDocs: {
			[docId: string]: PDFDocument
		} = Object.assign({}, ...(await Promise.all(pdfDocsPromise)))

		const copiedPagesPromise = []
		for (let i = 0; i < $pages.length; i++) {
			const indexInFroms = findIndex(froms, i)

			copiedPagesPromise.push(
				docsSplit[indexInFroms]
					.copyPages(pdfDocs[$pages[i].docId], [$pages[i].pageNum])
					.then((pgs) => {
						pgs.forEach((pg, idx) => {
							docsSplit[indexInFroms].addPage(pgs[idx])
						})
					})
			)
		}

		await Promise.all(copiedPagesPromise)

		const urls = await Promise.all(
			docsSplit.map((doc) =>
				doc.save().then(
					(url) =>
						new Blob([url], {
							type: 'application/pdf'
						})
				)
			)
		)

		download(urls)
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

	function adjustRangeTo() {
		if (rangeTo < rangeFrom) rangeTo = rangeFrom
	}

	function reset() {
		downloading = false
		downloaded = false
		ranges = {}
		rangeFrom = 1
		rangeTo = 1
		displayRanges = []
		docCount = 0
	}
</script>

<svelte:head>
	<title>Split PDF</title>
	<meta
		name="description"
		content="Split PDFs instantly with our free online PDF splitter. Separate pages or extract custom page ranges in seconds, without downloads or sign-ups. Secure, fast, and optimized for all devices. Simplify your PDF management today!"
	/>
</svelte:head>

{#if downloading}
	<PageLoadingState
		loading
		title={$t('split.downloading.title')}
		description={$t('split.downloading.description')}
	/>
{:else if downloaded}
	<PageLoadingState
		title={$t('split.downloaded.title')}
		description={$t('split.downloaded.description')}
	>
		<button class="btn btn-primary btn-outline btn-wide" onclick={reset}>Start Over</button>

		<OtherTools />
	</PageLoadingState>
{:else if !Object.keys($thumbnails).length && $uploadingDocs}
	<PageLoadingState
		loading
		title={$t('split.uploading.title')}
		description={$t('split.uploading.description')}
	/>
{:else}
	<Layout>
		{#snippet cards()}
			<DraggableCards>
				{#snippet children({ page, pageIndex })}
					<PageCard {page} />
				{/snippet}
			</DraggableCards>
			{#if Object.keys($previews).length && $pages.length}
				<Preview />
			{/if}
		{/snippet}

		{#snippet side()}
			<DocList withOptions>
				{#snippet moreOptions()}
					<li>
						<a aria-label="split document" href={null} onclick={() => console.log('split')}>
							Split Document
						</a>
					</li>
				{/snippet}
			</DocList>
		{/snippet}

		{#snippet cta()}
			{$t('btn.split')}
		{/snippet}

		{#snippet download()}
			<button class="btn btn-primary flex-1" onclick={split}>
				{#if downloading}
					<span class="loading loading-spinner"></span>
				{/if}
				{$t('download')}
				{splitType === 'all'
					? `(${$pages.length} PDFs)`
					: Object.keys(ranges).length > 1
						? `(${Object.keys(ranges).length} PDFs)`
						: '(1 PDF)'}
			</button>
		{/snippet}
	</Layout>
{/if}

<!-- ['range', 'all'] -->
<!-- <div class="bg-base-200 p-1.5 h-fit my-4 rounded-btn">
	<div class="flex gap-1">
		{#each ['range', 'all'] as split}
			<input
				class="btn btn-sm btn-ghost text-primary flex-1 whitespace-nowrap"
				type="radio"
				aria-label={split === 'range' ? $t('btn.split.by.range') : $t('btn.split.all')}
				bind:group={splitType}
				onchange={splitTypeHandler}
				value={split}
			/>
		{/each}
	</div>
</div> -->

<!-- descriptions -->
<!-- <p class="text-sm opacity-80 text-center py-8 lg:p-4">
	{#if splitType === 'all'}
		{description['all']}
	{:else}
		{description['range']}
	{/if}
</p> -->

<!-- {#if splitType === 'range'} -->
<!-- add range -->
<!-- <div class="flex items-center gap-2 mt-8 w-full">
		<input
			type="number"
			min={1}
			max={$pages.length}
			class="input input-sm input-bordered w-full text-[1rem]"
			placeholder="From"
			bind:value={rangeFrom}
			onblur={adjustRangeTo}
		/>

		<div>{@html arrowLongRight}</div>
		<input
			type="number"
			min={1}
			max={$pages.length}
			class="input input-sm input-bordered w-full text-[1rem]"
			placeholder="To"
			bind:value={rangeTo}
			onblur={adjustRangeTo}
		/>
		<button class="btn btn-sm btn-primary btn-outline [&>svg]:size-5" onclick={addRange}
			>{@html plus}{$t('btn.range')}</button
		>
	</div> -->

<!-- range list -->
<!-- <ul class="my-4 space-y-2 w-full flex-auto p-0 overflow-y-scroll lg:h-0">
		{#each displayRanges as range, index}
			<li class="flex justify-between items-center bg-base-200 rounded-box p-2">
				<span class="font-semibold text-sm flex items-center gap-4">
					{$t('page')}
					{range[0]}
					<span class="opacity-60 font-normal">{@html arrowLongRight} </span>
					{$t('page')}
					{range[1]}
				</span>

				{#if index > 0}
					<button class="link link-sm text-error" onclick={() => deleteRange(range[0] - 1)}>
						{@html trash}
					</button>
				{/if}
			</li>
		{/each}
	</ul>
{/if} -->
