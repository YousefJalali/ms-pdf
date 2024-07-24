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

		let pdfPages = await Promise.all(pages)

		return {
			pdfPages,
			destroy: async () => {
				pdfPages.forEach((p) => {
					p.cleanup()
				})
				await pdf.destroy()
				// await loadingTask.destroy()
				return loadingTask.destroyed
			}
		}
	} catch (error) {
		console.log(error)
	}
}
