<script lang="ts">
	import { Modal } from '$lib/ui'
	import { previews, thumbnails, pageNum, pages, docs, previewModal } from '$lib/stores'

	$: currentPageIndex = $previewModal.currentPageIndex || 0
	$: currentPageId = $pages[currentPageIndex]?.pageId
	$: currentPage = $pages[currentPageIndex]
	$: doc = $docs[currentPage?.docId]

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

	$: showModal = !!Object.keys($previews).length && $previewModal.isModalVisible

	$: pageNumber = String($pageNum[currentPageId]).split(',')[0]

	let imgContainer: HTMLDivElement

	let transform: { [pageId: string]: string } = {}
	$: if (showModal && imgContainer && currentPage && $previews[currentPageId]?.src) {
		if (((currentPage.initialRotation + (currentPage.rotationDegree || 0)) / 90) % 2 !== 0) {
			let { height, width } = imgContainer.getBoundingClientRect()
			transform[currentPage.pageId] =
				`transform: rotate(${currentPage.rotationDegree}deg) scale(${(width / height) * 0.95}) translateX(-50%)`
		}
	}
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

	<div
		bind:this={imgContainer}
		class="relative border border-transparent overflow-hidden h-[70vh] w-full mx-auto"
	>
		{#if $previews[currentPageId]?.src && currentPage}
			<img
				style={transform[currentPageId]}
				src={URL.createObjectURL($previews[currentPageId].src)}
				alt={`preview page ${pageNumber} of ${doc.name}`}
				class="origin-left absolute top-0 left-1/2 -translate-x-1/2 h-full w-auto border object-scale-down select-none"
			/>
			<!-- {:else if $thumbnails[currentPageId]?.src}
			<img
				style={transform[currentPageId]}
				src={URL.createObjectURL($thumbnails[currentPageId]?.src)}
				alt={`preview page ${pageNumber} of ${doc.name}`}
				class="origin-left absolute top-0 left-1/2 -translate-x-1/2 h-full w-auto border object-scale-down select-none"
			/> -->
		{:else}
			<div class="min-h-[600px] flex justify-center items-center">
				<span data-testid="preview-loading" class="loading loading-infinity loading-lg"></span>
			</div>
		{/if}
	</div>
</Modal>
