<script lang="ts">
	import { run } from 'svelte/legacy';

	import { Modal } from '$lib/ui'
	import { previews, thumbnails, pageNum, pages, docs, previewModal } from '$lib/stores'

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

	let showModal;
	run(() => {
		showModal = !!Object.keys($previews).length && $previewModal.isModalVisible
	});

	let pageNumber = $derived(String($pageNum[currentPageId]).split(',')[0])

	let imgContainer: HTMLDivElement = $state()

	let transform: { [pageId: string]: string } = $state({})
	run(() => {
		if (showModal && imgContainer && currentPage && $previews[currentPageId]?.src) {
			if (((currentPage.initialRotation + (currentPage.rotationDegree || 0)) / 90) % 2 !== 0) {
				let { height, width } = imgContainer.getBoundingClientRect()
				transform[currentPage.pageId] =
					`transform: rotate(${currentPage.rotationDegree}deg) scale(${(width / height) * 0.95}) translateX(-50%)`
			}
		}
	});
</script>

<Modal bind:showModal on:close={closeModal}>
	<div class="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-default z-10">
		<div class="join shadow">
			<button class="join-item btn" onclick={prev} disabled={currentPageIndex === 0}>«</button>
			<div class="join-item btn pointer-events-none">
				Page {pageNumber}
			</div>
			<button
				class="join-item btn"
				onclick={next}
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
