<script lang="ts">
	import JSZip from 'jszip'
	import { docs, pages, previews, thumbnails, uploadingDocs } from '$lib/stores'
	import { generateFileName, getInputAsUint8Array } from '$lib/utils'
	import Layout from '../(components)/Layout.svelte'
	import OtherTools from '../(components)/OtherTools.svelte'
	import DraggableCards from '../(components)/DraggableCards.svelte'
	import PageCard from '../(components)/(PageCard)/PageCard.svelte'
	import Preview from '../(components)/(PageCard)/Preview.svelte'
	import { PDFDocument } from 'pdf-lib'
	import { t } from '$lib/i18n'
	import { Button } from '$lib/components/ui/button'
	import { Reload } from 'svelte-radix'
	import * as Tabs from '$lib/components/ui/tabs/index.js'
	import * as Table from '$lib/components/ui/table/index.js'
	import { ArrowRight, LoaderCircle, Plus, RotateCcw, Split, Trash } from 'lucide-svelte'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import EmptyStatePage from '../(components)/EmptyStatePage.svelte'
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte'

	const description = {
		all: $t('split.all.desc'),
		range: $t('split.by.range.desc')
	}

	let splitType = $state('range')
	let downloaded = $state(false)
	let downloading = $state(false)
	let ranges: { [pageIndex: number]: string } = $state({})
	let rangeFrom = $state(1)
	let rangeTo = $state(1)
	let displayRanges: number[][] = $state([])
	let docCount = $state(0)
	let docsLength = $derived(Object.keys($docs).length)

	//
	$effect(() => {
		displayRanges = Object.keys(ranges).map((from, i, arr) => {
			console.log(ranges)
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
	<EmptyStatePage
		Icon={LoaderCircle}
		title={$t('split.downloading.title')}
		description={$t('split.downloading.description')}
	/>
{:else if downloaded}
	<EmptyStatePage
		title={$t('split.downloaded.title')}
		description={$t('split.downloaded.description')}
	>
		<Button variant="outline" onclick={reset}>
			<RotateCcw class="h-4 w-4 mr-2" />
			Start Over
		</Button>

		<OtherTools />
	</EmptyStatePage>
{:else if !Object.keys($thumbnails).length && $uploadingDocs}
	<EmptyStatePage
		Icon={LoaderCircle}
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
			<div>
				<span class="font-semibold leading-none tracking-tight">Split Options</span>
				<p class="text-muted-foreground text-sm line-clamp-1">Adjust the below</p>
			</div>

			<ScrollArea class="h-full mt-4">
				<Tabs.Root value="range" class="">
					<Tabs.List class="grid w-full grid-cols-2 sticky top-0 z-10">
						<Tabs.Trigger value="range">Range</Tabs.Trigger>
						<Tabs.Trigger value="all">All</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="range">
						<p class="text-sm opacity-80 text-center py-8 lg:py-4">
							{description['range']}
						</p>

						<Table.Root class="relative">
							<Table.Header class="sticky top-0">
								<Table.Row>
									<Table.Head>From</Table.Head>
									<Table.Head></Table.Head>
									<Table.Head>To</Table.Head>
									<Table.Head></Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell class="w-[200px]">
										<Label for="from" class="sr-only">From</Label>
										<Input
											id="from"
											type="number"
											min={1}
											max={$pages.length}
											bind:value={rangeFrom}
											onblur={adjustRangeTo}
										/>
									</Table.Cell>

									<Table.Cell class="font-semibold">-</Table.Cell>

									<Table.Cell class="w-[200px]">
										<Label for="to" class="sr-only">To</Label>
										<Input
											id="to"
											type="number"
											min={1}
											max={$pages.length}
											bind:value={rangeTo}
											onblur={adjustRangeTo}
										/>
									</Table.Cell>

									<Table.Cell>
										<Button variant="secondary" onclick={addRange} class="w-full">
											<Plus class="size-4" />
											<span class="md:hidden ml-2">
												{$t('btn.range')}
											</span>
										</Button>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>

						<Table.Root>
							<Table.Body>
								{#each displayRanges as range, index}
									<Table.Row>
										<Table.Cell class="w-[200px]">
											{$t('page')}
											{range[0]}
										</Table.Cell>

										<Table.Cell class="font-semibold"
											><ArrowRight class="size-4 opacity-40" /></Table.Cell
										>

										<Table.Cell class="w-[200px]">
											{$t('page')}
											{range[1]}
										</Table.Cell>

										<Table.Cell>
											<Button
												variant="ghost"
												onclick={() => deleteRange(range[0] - 1)}
												class="w-full text-red-500 disabled:text-gray-400"
												disabled={index === 0}
											>
												<Trash class="size-4 " />
											</Button>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</Tabs.Content>

					<Tabs.Content value="all">
						<p class="text-sm opacity-80 text-center py-8 lg:py-4">
							{description['all']}
						</p>
					</Tabs.Content>
				</Tabs.Root>
			</ScrollArea>
		{/snippet}

		{#snippet cta()}
			<Split class="size-4 mr-2" />
			{$t('btn.split')}
		{/snippet}

		{#snippet download()}
			<Button onclick={split} class="w-full">
				{#if downloading}
					<Reload class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				{$t('download')}
				{splitType === 'all'
					? `(${$pages.length} PDFs)`
					: Object.keys(ranges).length > 1
						? `(${Object.keys(ranges).length} PDFs)`
						: '(1 PDF)'}
			</Button>
		{/snippet}
	</Layout>
{/if}
