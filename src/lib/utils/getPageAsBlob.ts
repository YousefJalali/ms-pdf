import type { PDFPageProxy } from 'pdfjs-dist'

const LARGE = 600
const SMALL = 200

export async function getPageAsBlob(
	page: PDFPageProxy,
	pageId: string,
	type: 'small' | 'large' = 'small'
) {
	try {
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

		return {
			pageId,
			src,
			type
		}
	} catch (error) {
		console.log(error)
	}
}
