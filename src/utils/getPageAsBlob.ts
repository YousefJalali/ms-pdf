import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const LARGE = 600
const SMALL = 200

export async function getPageAsBlob(
	file: File,
	id: string,
	pageNum = 1,
	type: 'small' | 'large' = 'small'
) {
	// let startTime = performance.now()
	let loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file))
	try {
		let pdf = await loadingTask.promise
		// console.log('PDF loaded')

		let page = await pdf.getPage(pageNum)

		const scale = (type === 'small' ? SMALL : LARGE) / page.getViewport({ scale: 1 }).height
		const viewport = page.getViewport({ scale })

		// const canvas = document.getElementById(id) as HTMLCanvasElement
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		if (!context || !canvas) throw 'no context'

		canvas.height = viewport.height
		canvas.width = viewport.width

		const renderContext = {
			canvasContext: context,
			viewport: viewport
		}

		let renderTask = page.render(renderContext)

		await renderTask.promise

		const src = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp'))

		// console.log('Page rendered')

		return {
			id,
			src,
			pageNum: pageNum,
			type
		}
	} catch (error) {
		console.log(error)
	}
}
