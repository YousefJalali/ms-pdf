import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const PREVIEW_HEIGHT = 600
const THUMBNAIL_HEIGHT = 200

export async function getCanvasDataURL(
	file: File,
	id: string,
	pageNum = 1,
	type: 'thumbnail' | 'preview' = 'thumbnail'
) {
	// let startTime = performance.now()
	let loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file))
	try {
		let pdf = await loadingTask.promise
		// console.log('PDF loaded')

		let page = await pdf.getPage(pageNum)

		const scale =
			(type === 'thumbnail' ? THUMBNAIL_HEIGHT : PREVIEW_HEIGHT) /
			page.getViewport({ scale: 1 }).height
		const viewport = page.getViewport({ scale })

		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		if (!context) throw 'no context'

		canvas.height = viewport.height
		canvas.width = viewport.width

		const renderContext = {
			canvasContext: context,
			viewport: viewport
		}

		let renderTask = page.render(renderContext)

		await renderTask.promise
		// console.log('Page rendered')

		return { id, src: canvas.toDataURL(), pageNum: pageNum, pageCount: pdf.numPages, type }
	} catch (error) {
		console.log(error)
	}
}
