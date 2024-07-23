<script>
	import Modal from '../../components/Modal.svelte'
	import { preview, thumbnails, pageNum, pages, docs } from '../../stores'
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

	{#if $thumbnails[currentPageId]}
		<div class="border border-transparent w-fit [&>img]:min-h-[600px] mx-auto">
			{#if $thumbnails[currentPageId].preview.status === 'loaded'}
				<img
					src={URL.createObjectURL($thumbnails[currentPageId].preview.src)}
					alt={`preview page ${pageNumber} of ${doc?.name || ''}`}
					class="border"
				/>
			{:else}
				<div class="min-h-[600px] flex justify-center items-center">
					<span class="loading loading-infinity loading-lg"></span>
				</div>
			{/if}

			{#if doc && currentPage}
				<div class="absolute top-6 left-1/2 -translate-x-1/2">
					<Actions {doc} page={currentPage} from="preview" on:delete={deleteHandler} />
				</div>
			{/if}
			<!-- {#if $thumbnails[pageId].thumbnail.status === 'loading'}
					<div class="min-h-[600px] flex justify-center items-center">
						<span class="loading loading-infinity loading-lg"></span>
					</div>
				{:else if $thumbnails[pageId].preview.status === 'loading'}
					<enhanced:img src={$thumbnails[pageId].thumbnail.src} alt={`${page.pageNum}`} />
				{:else}
					<enhanced:img
						src={$thumbnails[pageId].preview.src}
						alt={`preview page ${String($pageNum[pageId]).split(',')[0]} of ${doc.name}`}
					/>
				{/if} -->
		</div>
	{/if}
</Modal>
