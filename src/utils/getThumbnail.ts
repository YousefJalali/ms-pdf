import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const PREVIEW_HEIGHT = 200

type Preview = {
	id: string
	docId: string
	name: string
	parentId: string
	file: File
}

export async function getThumbnail(file: Preview) {
	let loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file.file))
	try {
		let pdf = await loadingTask.promise
		console.log('PDF loaded')

		let pageNumber = 1
		let page = await pdf.getPage(pageNumber)

		const scale = PREVIEW_HEIGHT / page.getViewport({ scale: 1 }).height
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
		console.log('Page rendered')

		return { id: [file.docId], src: canvas.toDataURL() }
	} catch (error) {
		console.log(error)
	}
}
