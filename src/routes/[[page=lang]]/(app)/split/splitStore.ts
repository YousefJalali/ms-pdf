import { get, writable } from 'svelte/store'
import { docs, pages } from '$lib/stores'
import { getInputAsUint8Array } from '$lib/utils'
import { PDFDocument } from 'pdf-lib'

function handlePages() {
	const { subscribe, set, update } = writable<{ [pageIndex: number]: string }>([])

	function setAtIndex(index: number, value: string) {
		const allRanges = get(ranges)
		allRanges[index] = value

		set(allRanges)
	}

	function deleteAtIndex(index: number) {
		const allRanges = get(ranges)
		delete allRanges[index]
		set(allRanges)
	}

	return {
		subscribe,
		set,
		setAtIndex,
		deleteAtIndex
	}
}
export const ranges = handlePages()

export async function split() {
	const froms = Object.keys(get(ranges)).map((key) => +key)
	const docsSplitPromise = new Array(froms.length).fill(0).map(() => PDFDocument.create())
	const docsSplit = await Promise.all(docsSplitPromise)

	const pdfDocsPromise = Object.keys(get(docs)).map((docId) =>
		getInputAsUint8Array(get(docs)[docId].file)
			.then((src) => PDFDocument.load(src))
			.then((doc) => ({ [docId]: doc }))
	)
	const pdfDocs: {
		[docId: string]: PDFDocument
	} = Object.assign({}, ...(await Promise.all(pdfDocsPromise)))

	const copiedPagesPromise = []
	for (let i = 0; i < get(pages).length; i++) {
		const indexInFroms = findIndex(froms, i)

		copiedPagesPromise.push(
			docsSplit[indexInFroms]
				.copyPages(pdfDocs[get(pages)[i].docId], [get(pages)[i].pageNum])
				.then((pgs) => {
					pgs.forEach((pg, idx) => {
						docsSplit[indexInFroms].addPage(pgs[idx])
					})
				})
		)
	}

	await Promise.all(copiedPagesPromise)

	const urls = await Promise.all(
		docsSplit.map((doc) =>
			doc.save().then(
				(url) =>
					new Blob([url], {
						type: 'application/pdf'
					})
			)
		)
	)

	return urls
}

function findIndex(arr: number[], num: number) {
	for (let i = 0; i < arr.length; i++) {
		console.log(i, arr, arr.length - 1)
		if (num === 0) return 0
		if (num <= arr[i]) return i
	}

	return arr.length - 1
}
