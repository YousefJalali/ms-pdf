<script lang="ts">
	import { previews, pageNum, pages, docs, previewModal } from '$lib/stores'
	import * as Dialog from '$lib/components/ui/dialog/index.js'
	import { Button } from '$lib/components/ui/button'
	import { ChevronLeft } from 'lucide-svelte'
	import { ChevronRight, Reload } from 'svelte-radix'

	let currentPageIndex = $derived($previewModal.currentPageIndex || 0)
	let currentPageId = $derived($pages[currentPageIndex]?.pageId)
	let currentPage = $derived($pages[currentPageIndex])
	let doc = $derived($docs[currentPage?.docId])

	function next() {
		previewModal.next()
	}

	function prev() {
		previewModal.prev()
	}

	function closeModal() {
		previewModal.hide()
		transform = {}
	}

	let showModal = $state(false)
	$effect(() => {
		showModal = !!Object.keys($previews).length && $previewModal.isModalVisible
	})

	let pageNumber = $derived(String($pageNum[currentPageId]).split(',')[0])

	let imgContainer: HTMLDivElement | undefined = $state()

	let transform: { [pageId: string]: string } = $state({})
	$effect(() => {
		if (showModal && imgContainer && currentPage && $previews[currentPageId]?.src) {
			if (((currentPage.initialRotation + (currentPage.rotationDegree || 0)) / 90) % 2 !== 0) {
				let { height, width } = imgContainer.getBoundingClientRect()
				transform[currentPage.pageId] =
					`transform: rotate(${currentPage.rotationDegree}deg) scale(${(width / height) * 0.95}) translateX(-50%)`
			}
		}
	})
</script>

<Dialog.Root open={showModal} onOpenChange={closeModal}>
	<Dialog.Content class="sm:max-w-[425px]">
		<!-- <Dialog.Header>
			<Dialog.Title>{doc.name}</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header> -->
		<div bind:this={imgContainer} class="relative overflow-hidden h-[70vh] w-full mx-auto">
			{#if $previews[currentPageId]?.src && currentPage}
				<img
					style={transform[currentPageId]}
					src={URL.createObjectURL($previews[currentPageId].src)}
					alt={`preview page ${pageNumber} of ${doc.name}`}
					class="absolute top-0 object-scale-down w-auto h-full origin-left -translate-x-1/2 select-none left-1/2"
				/>
			{:else}
				<div class="flex items-center justify-center h-full bg-muted">
					<Reload data-testid="preview-loading" class="size-5 animate-spin" />
				</div>
			{/if}
		</div>
		<Dialog.Footer>
			<div class="flex items-center justify-between mx-auto w-fit">
				<Button size="icon" variant="outline" onclick={prev} disabled={currentPageIndex === 0}>
					<ChevronLeft class="pointer-events-none size-5" />
					<span class="sr-only">Back</span>
				</Button>
				<div class="px-4 text-sm">
					Page {pageNumber}
				</div>
				<Button
					size="icon"
					variant="outline"
					onclick={next}
					disabled={currentPageIndex === $pages.length - 1}
				>
					<ChevronRight class="pointer-events-none size-5" />
					<span class="sr-only">Next</span>
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
