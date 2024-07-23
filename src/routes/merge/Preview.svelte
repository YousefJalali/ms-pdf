<script>
	import { Modal } from '$lib/ui'
	import { preview, images, pageNum, pages, docs } from '$lib/stores'
	import Actions from './Actions.svelte'

	let index = 0
	$: currentPageId = $preview[index]
	$: currentPage = $pages.find((p) => p.pageId === currentPageId)
	$: doc = currentPage ? $docs[currentPage.docId] : undefined

	function next() {
		if (index >= $preview.length - 1) return
		index++
		preview.next(index)
	}

	function prev() {
		if (index <= 0) return
		index--
		preview.next(index)
	}

	function closeModal() {
		preview.clear()
		index = 0
	}

	function deleteHandler() {
		// if ($preview.length <= 1) {
		// 	closeModal()
		// } else if (index >= $preview.length - 1) {
		// 	prev()
		// } else {
		// 	next()
		// }
		// preview.remove(currentPageId)
		// pages.removePage(currentPageId, true)
	}

	$: showModal = !!$preview.length

	$: pageNumber = String($pageNum[currentPageId]).split(',')[0]
</script>

<Modal bind:showModal on:close={closeModal}>
	<div class="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-default">
		<div class="join shadow">
			<button class="join-item btn" on:click={prev}>«</button>
			<div class="join-item btn pointer-events-none">
				Page {pageNumber}
			</div>
			<button class="join-item btn" on:click={next}>»</button>
		</div>
	</div>

	{#if $images[currentPageId]}
		<div class="border border-transparent w-fit [&>img]:min-h-[600px] mx-auto">
			{#if $images[currentPageId].large}
				<img
					src={URL.createObjectURL($images[currentPageId].large)}
					alt={`preview page ${pageNumber} of ${doc?.name || ''}`}
					class="border"
				/>
			{:else if $images[currentPageId].small}
				<img
					src={URL.createObjectURL($images[currentPageId].small)}
					alt={`preview page ${pageNumber} of ${doc?.name || ''}`}
					class="border"
				/>
			{:else}
				<div class="min-h-[600px] flex justify-center items-center">
					<span class="loading loading-infinity loading-lg"></span>
				</div>
			{/if}

			<!-- {#if doc && currentPage}
				<div class="absolute top-6 left-1/2 -translate-x-1/2">
					<Actions {doc} page={currentPage} from="preview" on:delete={deleteHandler} />
				</div>
			{/if} -->
			<!-- {#if $images[pageId].thumbnail.status === 'loading'}
					<div class="min-h-[600px] flex justify-center items-center">
						<span class="loading loading-infinity loading-lg"></span>
					</div>
				{:else if $images[pageId].preview.status === 'loading'}
					<enhanced:img src={$images[pageId].thumbnail.src} alt={`${page.pageNum}`} />
				{:else}
					<enhanced:img
						src={$images[pageId].preview.src}
						alt={`preview page ${String($pageNum[pageId]).split(',')[0]} of ${doc.name}`}
					/>
				{/if} -->
		</div>
	{/if}
</Modal>
