<script lang="ts">
	import { Modal } from '$lib/ui'
	import { previews, thumbnails, pageNum, pages, docs } from '$lib/stores'
	import { rotationStyle } from '$lib/utils'
	// import Actions from './Actions.svelte'

	let index = 0
	$: currentPageId = Object.keys($previews)[index]
	$: currentPage = $pages.find((p) => p.pageId === currentPageId)
	$: doc = currentPage ? $docs[currentPage.docId] : undefined

	function next() {
		if (index >= Object.keys($previews).length - 1) return
		index++
		// preview.next(index)
	}

	function prev() {
		if (index <= 0) return
		index--
		// preview.next(index)
	}

	function closeModal() {
		// preview.clear()
		index = 0
	}

	$: showModal = !!$previews.length

	$: pageNumber = String($pageNum[currentPageId]).split(',')[0]
</script>

<Modal bind:showModal on:close={closeModal}>
	<div class="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-default z-10">
		<div class="join shadow">
			<button class="join-item btn" on:click={prev} disabled={index === 0}>«</button>
			<div class="join-item btn pointer-events-none">
				Page {pageNumber}
			</div>
			<button
				class="join-item btn"
				on:click={next}
				disabled={index === Object.keys($previews).length - 1}>»</button
			>
		</div>
	</div>

	{#if $previews[currentPageId] && currentPage}
		<div class="border border-transparent w-fit [&>img]:min-h-[600px] mx-auto">
			{#if $previews[currentPageId].src}
				<img
					style={rotationStyle(currentPage)}
					src={URL.createObjectURL($previews[currentPageId].src)}
					alt={`preview page ${pageNumber} of ${doc?.name || ''}`}
					class="border object-contain select-none"
				/>
			{:else if $thumbnails[currentPageId].src}
				<img
					style={rotationStyle(currentPage)}
					src={URL.createObjectURL($thumbnails[currentPageId].src)}
					alt={`preview page ${pageNumber} of ${doc?.name || ''}`}
					class="border object-contain w-full"
				/>
			{:else}
				<div class="min-h-[600px] flex justify-center items-center">
					<span class="loading loading-infinity loading-lg"></span>
				</div>
			{/if}
		</div>
	{/if}
</Modal>
