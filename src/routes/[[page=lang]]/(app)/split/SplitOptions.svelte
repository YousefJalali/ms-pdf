<script lang="ts">
	import { docs, pages } from '$lib/stores'
	import { ranges } from './splitStore'
	import { cn } from '$lib/utils'
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

	let rangeInput = $state('')

	let docCount = $state(0)
	let docsLength = $derived(Object.keys($docs).length)
	let rangeError = $state('')
	let displayRanges: number[][] = $derived(
		Object.keys($ranges).map((from, i, arr) => [+from + 1, +arr[i + 1] || $pages.length])
	)

	$effect(() => {
		if (activeTab === 'all') {
			pages.showAll()
		} else {
			pages.hideAll($ranges)
		}
	})

	//if there is no range, set the first page as default
	$effect(() => {
		if ($pages.length && Object.keys($ranges).length === 0) {
			ranges.setAtIndex(0, $pages[0].pageId)
			// $ranges[0] = $pages[0].pageId
		}
	})

	//add range if new doc is added
	$effect(() => {
		if (docsLength > docCount && docsLength > 1) {
			console.log('New doc added, updating ranges...')
			let lastDoc = $docs[Object.keys($docs)[docsLength - 1]]
			const index = $pages.length - lastDoc.pageCount

			// $ranges[index] = $pages[index].pageId
			ranges.setAtIndex(index, $pages[index].pageId)

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
			ranges.deleteAtIndex(i)
		}

		ranges.set({
			...$ranges,
			...from,
			...to
		})

		pages.hideAll($ranges)

		rangeInput = ''
	}

	function deleteRange(index: number) {
		// if index is 0, remove the next range
		if (index === 0) {
			const nextRangeIndex = +Object.keys($ranges)[1]

			if (nextRangeIndex) {
				ranges.deleteAtIndex(nextRangeIndex)
			}
		} else {
			ranges.deleteAtIndex(index)
		}

		// ranges = ranges

		pages.hideAll($ranges)
	}

	export function reset() {
		ranges.set({})
		rangeInput = ''
		displayRanges = []
		docCount = 0
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

	<div class="flex flex-wrap gap-2 mt-3" data-testid="split-ranges">
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
							<span class="sr-only">Delete range</span>
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
