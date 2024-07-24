import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

export async function getPdfPage(file: File) {
	let loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file))
	try {
		let pdf = await loadingTask.promise

		const pages = []
		for (let i = 1; i <= pdf.numPages; i++) {
			pages.push(pdf.getPage(i))
		}

		return Promise.all(pages)
	} catch (error) {
		console.log(error)
	}
}
