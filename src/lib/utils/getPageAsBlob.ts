import type { PDFPageProxy } from 'pdfjs-dist'

const LARGE = 1200
const SMALL = 200

export async function getPageAsBlob(
	page: PDFPageProxy,
	size: 'small' | 'large' | number = 'small',
	type: 'jpeg' | 'webp' | 'png' = 'webp'
) {
	try {
		const scale =
			typeof size === 'number'
				? size
				: (size === 'small' ? SMALL : LARGE) / page.getViewport({ scale: 1 }).height

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

		const src = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, `image/${type}`, 1)
		)

		return src
	} catch (error) {
		console.log(error)
	}
}
