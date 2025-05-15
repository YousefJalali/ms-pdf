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
					class="origin-left absolute top-0 left-1/2 -translate-x-1/2 h-full w-auto object-scale-down select-none"
				/>
			{:else}
				<div class="h-full flex justify-center items-center bg-muted">
					<Reload data-testid="preview-loading" class="size-5 animate-spin" />
				</div>
			{/if}
		</div>
		<Dialog.Footer>
			<div class="flex justify-between items-center w-fit mx-auto">
				<Button variant="outline" onclick={prev} disabled={currentPageIndex === 0}>
					<ChevronLeft class="size-5" />
				</Button>
				<div class="text-sm px-4">
					Page {pageNumber}
				</div>
				<Button variant="outline" onclick={next} disabled={currentPageIndex === $pages.length - 1}>
					<ChevronRight class="size-5" />
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
