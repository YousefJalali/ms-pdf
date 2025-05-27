<script lang="ts">
	import { docs, pages } from '$lib/stores'
	import { cn, getInputAsUint8Array } from '$lib/utils'
	import { PDFDocument } from 'pdf-lib'
	import { t } from '$lib/i18n'
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import * as Tabs from '$lib/components/ui/tabs/index.js'
	import { Plus, XIcon } from 'lucide-svelte'
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import { Input } from '$lib/components/ui/input'

	let { activeTab } = $props()

	const description = {
		all: $t('split.all.desc'),
		range: $t('split.by.range.desc')
	}

	let ranges: { [pageIndex: number]: string } = $state({})
	let rangeInput = $state('')

	let docCount = $state(0)
	let docsLength = $derived(Object.keys($docs).length)
	let rangeError = $state('')
	let displayRanges: number[][] = $derived(
		Object.keys(ranges).map((from, i, arr) => [+from + 1, +arr[i + 1] || $pages.length])
	)

	$effect(() => {
		if (activeTab === 'all') {
			pages.showAll()
		} else {
			pages.hideAll(ranges)
		}
	})

	//if there is no range, set the first page as default
	$effect(() => {
		if ($pages.length && Object.keys(ranges).length === 0) {
			ranges[0] = $pages[0].pageId
		}
	})

	//add range if new doc is added
	$effect(() => {
		if (docsLength > docCount && docsLength > 1) {
			console.log('New doc added, updating ranges...')
			let lastDoc = $docs[Object.keys($docs)[docsLength - 1]]
			const index = $pages.length - lastDoc.pageCount

			ranges[index] = $pages[index].pageId

			docCount = docsLength
		}
	})

	function addRange() {
		rangeError = ''

		const regex = /^\s*\d+\s*(-\s*\d+)?\s*$/

		if (!regex.test(rangeInput)) {
			rangeError = 'Invalid page range.'
			return
		}

		let range: [number, number] = [1, 1]
		let r = rangeInput.replaceAll(' ', '')
		if (r.includes('-')) {
			range = [+r.split('-')[0], +r.split('-')[1]]
		} else {
			range = [+r, +r]
		}

		if (range[1] < range[0]) {
			rangeError = 'Invalid page range.'
			return
		}

		if (range[0] < 1 || range[1] > $pages.length) {
			rangeError = 'Page number must be between 1 and total pages.'
			return
		}

		let from = { [range[0] - 1]: $pages[range[0] - 1].pageId }
		let to =
			range[1] < $pages.length
				? { [range[1]]: $pages[range[1]].pageId }
				: { [$pages.length - 1]: $pages[$pages.length - 1].pageId }

		// if (!Object.keys(ranges).length) {
		// 	ranges[0] = $pages[0].pageId
		// }

		//merge ranges
		for (let i = range[0]; i < range[1]; i++) {
			delete ranges[i]
		}

		ranges = {
			...ranges,
			...from,
			...to
		}

		pages.hideAll(ranges)

		rangeInput = ''
	}

	function deleteRange(index: number) {
		// if index is 0, remove the next range
		if (index === 0) {
			const nextRange = +Object.keys(ranges)[1]

			if (nextRange) {
				delete ranges[nextRange]
			}
		} else {
			delete ranges[index]
		}

		// ranges = ranges

		pages.hideAll(ranges)
	}

	function findIndex(arr: number[], num: number) {
		for (let i = 0; i < arr.length; i++) {
			console.log(i, arr, arr.length - 1)
			if (num === 0) return 0
			if (num <= arr[i]) return i
		}

		return arr.length - 1
	}

	export async function split() {
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

		return urls
	}

	export function reset() {
		ranges = {}
		rangeInput = ''
		displayRanges = []
		docCount = 0
	}

	export function splittedDocsCount() {
		console.log('called', displayRanges.length)
		return displayRanges.length
	}
</script>

<Tabs.Content value="range" class="px-1">
	<p class="py-8 text-sm text-center opacity-80 lg:py-4">
		{description['range']}
	</p>

	<div class="flex gap-2">
		<Input
			bind:value={rangeInput}
			type="text"
			placeholder="e.g. 1-5, 8"
			class={rangeError ? 'border border-destructive' : ''}
			onblur={() => {
				if (rangeInput.length <= 0) {
					rangeError = ''
				}
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					addRange()
				}
			}}
		/>
		<Button variant="secondary" onclick={addRange}>
			<Plus class="pointer-events-none size-4" />
			<span class="ml-2 md:hidden">
				{$t('btn.range')}
			</span>
		</Button>
	</div>

	<p class="mt-2 text-destructive text-[0.8rem] font-medium">{rangeError}</p>

	<div class="flex flex-wrap gap-2 mt-3">
		{#each displayRanges as range}
			{@const pageCount = range[1] - range[0] + 1}
			<div class={cn(buttonVariants({ variant: 'secondary' }), 'flex items-center gap-1 pr-1')}>
				{range[0]} - {range[1]}
				<span class="ml-1 font-normal opacity-70">({pageCount} Page{pageCount > 1 ? 's' : ''})</span
				>

				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<Button
							class="p-0 size-9 group"
							builders={[builder]}
							size="icon"
							variant="ghost"
							onclick={() => deleteRange(range[0] - 1)}
							disabled={displayRanges.length <= 1}
						>
							<XIcon class="pointer-events-none size-4 group-hover:stroke-primary" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Delete range</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		{/each}
	</div>
</Tabs.Content>

<Tabs.Content value="all">
	<p class="py-8 text-sm text-center opacity-80 lg:py-4">
		{description['all']}
	</p>
</Tabs.Content>
