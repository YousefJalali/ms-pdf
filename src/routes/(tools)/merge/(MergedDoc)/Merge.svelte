<script lang="ts">
	import { docs, mergedPdf, pages, previews } from '$lib/stores'
	import type { CreateImage } from '$lib/types'
	import { getInputAsUint8Array } from '$lib/utils'
	import { degrees, PDFDocument } from 'pdf-lib'

	async function merge() {
		mergedPdf.setLoading(true)

		const allPages = [...$pages]
		const allDocs = { ...$docs }
		let docPages: {
			[docId: string]: { pageNumber: number[]; pageRotation: (number | undefined)[] }
		} = {}

		try {
			let merger = await PDFDocument.create()

			let unloadedPreviews: CreateImage = {}
			// let unloadedThumbnails: CreateImage = {}

			for (let page of allPages) {
				if (!$previews[page.pageId]) {
					unloadedPreviews[page.pageId] = {
						pdfPage: $docs[page.docId].pagesPdfProxy[page.pageId],
						docId: page.docId
					}
				}
				// if (!$thumbnails[page.pageId]) {
				// 	unloadedThumbnails[page.pageId] = {
				// 		pdfPage: $docs[page.docId].pagesPdfProxy[page.docId],
				// 		docId: page.docId
				// 	}
				// }

				if (!docPages[page.docId]) docPages[page.docId] = { pageNumber: [], pageRotation: [] }
				docPages[page.docId].pageNumber.push(page.pageNum)
				docPages[page.docId].pageRotation.push(
					page.rotationDegree ? page.rotationDegree + page.initialRotation : undefined
				)
			}

			// thumbnails.create(unloadedThumbnails)
			await previews.create(unloadedPreviews)

			for (let docId in docPages) {
				let src = await getInputAsUint8Array(allDocs[docId].file)
				let pdfDoc = await PDFDocument.load(src)
				const copiedPages = await merger.copyPages(pdfDoc, docPages[docId].pageNumber)

				for (let [index, copiedPage] of copiedPages.entries()) {
					let rotation = docPages[docId].pageRotation[index]
					if (rotation) {
						copiedPage.setRotation(degrees(rotation))
					}
					merger.addPage(copiedPage)
				}
			}

			const merged = await merger.save()
			let blob = new Blob([merged], {
				type: 'application/pdf'
			})

			mergedPdf.setSrc(URL.createObjectURL(blob))

			mergedPdf.setLoading(false)
		} catch (error) {
			mergedPdf.setLoading(false)
			console.log(error)
		}
	}
</script>

<button
	on:click={merge}
	class="btn btn-primary flex-1"
	disabled={$pages.length < 2 || $mergedPdf.loading}
>
	{#if $mergedPdf.loading}
		<span class="loading loading-spinner"></span>Merging...
	{:else}
		Merge
	{/if}
</button>
