<script lang="ts">
	import { Modal } from '$lib/ui'
	import { previews, thumbnails, pageNum, pages, docs, previewModal } from '$lib/stores'
	import { rotationStyle } from '$lib/utils'
	// import Actions from './Actions.svelte'

	$: currentPageIndex = $previewModal.currentPageIndex || 0
	$: currentPageId = $pages[currentPageIndex].pageId
	$: currentPage = $pages[currentPageIndex]
	$: doc = $docs[currentPage.docId]

	function createPreview(pageId: string) {
		if (!$previews[pageId]) previews.create({ [pageId]: doc.pagesPdfProxy[pageId] }, doc.docId)
	}

	function next() {
		previewModal.next()
		// createPreview($pages[currentPageIndex].pageId)
		// if (currentPageIndex >= $pages.length - 1) return
		// currentPageIndex++
		// previewModal.setCurrentPage($pages[currentPageIndex].pageId)
		// preview.next(index)
	}

	function prev() {
		previewModal.prev()
		// if (currentPageIndex <= 0) return
		// currentPageIndex--
		// previewModal.setCurrentPage($pages[currentPageIndex].pageId)
		// createPreview($pages[currentPageIndex].pageId)
		// preview.next(index)
	}

	function closeModal() {
		previewModal.hide()
	}

	$: showModal = !!Object.keys($previews).length && $previewModal.isModalVisible

	$: pageNumber = String($pageNum[currentPageId]).split(',')[0]
</script>

<Modal bind:showModal on:close={closeModal}>
	<div class="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-default z-10">
		<div class="join shadow">
			<button class="join-item btn" on:click={prev} disabled={currentPageIndex === 0}>«</button>
			<div class="join-item btn pointer-events-none">
				Page {pageNumber}
			</div>
			<button
				class="join-item btn"
				on:click={next}
				disabled={currentPageIndex === $pages.length - 1}>»</button
			>
		</div>
	</div>

	<div class="border border-transparent w-fit [&>img]:min-h-[600px] mx-auto">
		{#if $previews[currentPageId]?.src && currentPage}
			<img
				style={rotationStyle(currentPage)}
				src={URL.createObjectURL($previews[currentPageId].src)}
				alt={`preview page ${pageNumber} of ${doc.name}`}
				class="border object-contain select-none"
			/>
		{:else if $thumbnails[currentPageId]?.src}
			<img
				style={rotationStyle(currentPage)}
				src={URL.createObjectURL($thumbnails[currentPageId].src)}
				alt={`preview page ${pageNumber} of ${doc.name}`}
				class="border object-contain w-full"
			/>
		{:else}
			<div class="min-h-[600px] flex justify-center items-center">
				<span class="loading loading-infinity loading-lg"></span>
			</div>
		{/if}
	</div>
</Modal>
