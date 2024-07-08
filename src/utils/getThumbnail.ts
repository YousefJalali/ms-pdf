import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString()

const PREVIEW_HEIGHT = 200

let pageNumber: number | number[] = 1
export async function getThumbnail(file: File, id: string, pageNum = pageNumber) {
	let startTime = performance.now()
	let loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file))
	try {
		let pdf = await loadingTask.promise
		console.log('PDF loaded')

		if (typeof pageNum === 'number') {
			let v = await renderCanvas(pageNum)
			let endTime = performance.now()
			console.log(`Call to doSomething took ${(endTime - startTime) / 1000} s`)
			return v
		} else {
			let res = []
			for (let i = pageNum[0]; i < pageNum[1]; i++) {
				let canvas = await renderCanvas(i)
				res.push(canvas)
			}
			return res
		}

		async function renderCanvas(pageNum: number) {
			let page = await pdf.getPage(pageNum)

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

			return { id, src: canvas.toDataURL(), pageNum: pageNum, pageCount: pdf.numPages }
		}
	} catch (error) {
		console.log(error)
	}
}
