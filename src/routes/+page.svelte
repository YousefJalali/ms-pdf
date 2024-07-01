<script lang="ts">
	import { derived, writable, type Readable, type Writable } from 'svelte/store'
	import { PDFDocument } from 'pdf-lib'
	import { v4 as uuidv4 } from 'uuid'
	import FileInput from '../components/FileInput.svelte'
	import { dndzone } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
	pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
		'pdfjs-dist/build/pdf.worker.min.mjs',
		import.meta.url
	).toString()

	function randomColor() {
		return '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
	}

	const PREVIEW_HEIGHT = 150

	const _loadOptions = {
		ignoreEncryption: true
	}

	let value: string
	let files: FileList | null

	type Preview = {
		id: string
		docId: string
		name: string
		parentId: string
		file: File
	}
	let previews = writable<Preview[]>([])

	let pages: Readable<{ [ket: string]: number }> = derived(
		previews,
		($st, set) => {
			Promise.resolve(getNumOfPages($st)).then((value) => {
				set(value)
			})
		},
		{}
	)

	type Thumbnail = {
		[key: string]: {
			status: 'loading' | 'loaded' | 'failed'
			src: string | null
		}
	}
	let thumbnails: Readable<Thumbnail> = derived(
		previews,
		($st, set, update) => {
			let hasNewItem = false
			let thumbnailsToBeRemoved = { ...$thumbnails }

			Promise.allSettled(
				$st.map((f) => {
					//remove existing thumbnail from temp object
					if (thumbnailsToBeRemoved[f.docId]) {
						delete thumbnailsToBeRemoved[f.docId]
					}

					if (!$thumbnails[f.docId]) {
						hasNewItem = true
						let newThumbnail: Thumbnail = {
							[f.docId]: { status: 'loading', src: null }
						}
						update((thumb) => ({
							...thumb,
							...newThumbnail
						}))

						return getThumbnail(f)
					} else {
						return []
					}
				})
			).then((value) => {
				if (hasNewItem) {
					value.forEach((v) => {
						if (v.status === 'fulfilled') {
							update((thumb) => ({
								...thumb,
								//@ts-ignore
								[v.value.id]: { status: 'loaded', src: v.value.src }
							}))
						}
					})
					hasNewItem = false
				}

				//remove thumbnails of removed pages
				if (Object.keys(thumbnailsToBeRemoved).length) {
					let temp = { ...$thumbnails }
					for (let key in thumbnailsToBeRemoved) {
						delete temp[key]
					}
					set(temp)
					thumbnailsToBeRemoved = {}
				}
			})
		},
		{}
	)

	let mergedPdfUrl: string

	$: if (files) {
		for (const file of files) {
			console.log(file)
			console.log(`${file.name}: ${file.size} bytes`)
			// docs = [...docs, file]
			let id = uuidv4()

			previews.update((d) => [
				...d,
				{
					id,
					docId: id,
					name: file.name,
					parentId: id,
					file
				}
			])
		}
		files = null
	}

	let colors: Readable<{ [key: string]: { name: string; color: string } }> = derived(
		previews,
		($st, set, update) => {
			let colorsToBeRemoved = { ...$colors }
			for (let f of $st) {
				delete colorsToBeRemoved[f.parentId]

				if (!$colors[f.parentId]) {
					let newColor = {
						[f.parentId]: { name: f.name, color: randomColor() }
					}
					update((c) => ({ ...c, ...newColor }))
				}
			}

			//clear colors of removed docs
			if (Object.keys(colorsToBeRemoved).length) {
				let temp = { ...$colors }
				for (let key in colorsToBeRemoved) {
					delete temp[key]
				}
				set(temp)
				colorsToBeRemoved = {}
			}
		},
		{}
	)

	async function merge() {
		try {
			let merger = await PDFDocument.create()

			// docs.push(new URL('https://pdf-lib.js.org/assets/with_update_sections.pdf'))
			for (const file of $previews) {
				let src = await _getInputAsUint8Array(file.file)
				let pdfDoc = await PDFDocument.load(src)

				let indices = pdfDoc.getPageIndices()
				const copiedPages = await merger.copyPages(pdfDoc, indices)

				for (let page of copiedPages) {
					merger.addPage(page)
				}
			}

			const mergedPdf = await merger.save()
			let blob = new Blob([mergedPdf], {
				type: 'application/pdf'
			})
			mergedPdfUrl = URL.createObjectURL(blob)
		} catch (error) {
			console.log(error)
		}
	}

	async function _getInputAsUint8Array(input: any) {
		// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
		if (input instanceof Uint8Array) {
			return input
		}

		// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
		if (
			input instanceof ArrayBuffer ||
			Object.prototype.toString.call(input) === '[object ArrayBuffer]'
		) {
			return new Uint8Array(input)
		}

		// see https://developer.mozilla.org/en-US/docs/Web/API/Blob
		if (typeof Blob !== 'undefined' && input instanceof Blob) {
			const aBuffer = await input.arrayBuffer()
			return new Uint8Array(aBuffer)
		}

		// see https://developer.mozilla.org/en-US/docs/Web/API/URL
		if (input instanceof URL) {
			if (typeof fetch === 'undefined') {
				throw new Error('fetch is not defined. You need to use a polyfill for this to work.')
			}
			const res = await fetch(input)
			const aBuffer = await res.arrayBuffer()
			return new Uint8Array(aBuffer)
		}

		// throw a meaningful error if input type is unknown or invalid
		const allowedTypes = ['Uint8Array', 'ArrayBuffer', 'File', 'Blob', 'URL']
		let errorMsg = `pdf-input must be of type ${allowedTypes.join(', ')}, a valid filename or url!`
		if (typeof input === 'string' || input instanceof String) {
			errorMsg += ` Input was "${input}" wich is not an existing file, nor a valid URL!`
		} else {
			errorMsg += ` Input was of type "${typeof input}" instead.`
		}
		throw new Error(errorMsg)
	}

	//to be enhanced
	async function getNumOfPages(files: Preview[]) {
		let pages: { [key: string]: number } = {}
		for (let file of files) {
			const src = await _getInputAsUint8Array(file.file)
			const pdfDoc = await PDFDocument.load(src, _loadOptions)

			pages[file.docId] = pdfDoc.getPages().length
		}

		return pages
	}

	async function split(fileId: string, pages = undefined) {
		let inputIndex = $previews.findIndex((f) => f.docId === fileId)
		let file = $previews[inputIndex].file
		const src = await _getInputAsUint8Array(file)
		const pdfDoc = await PDFDocument.load(src, _loadOptions)

		const numberOfPages = pdfDoc.getPages().length
		let newDocs: Preview[] = []
		for (let i = 0; i < numberOfPages; i++) {
			// Create a new "sub" document
			const subDocument = await PDFDocument.create()
			// copy the page at current index
			const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
			subDocument.addPage(copiedPage)
			const pdfBytes = await subDocument.save()
			const blob = new Blob([pdfBytes], {
				type: 'application/pdf'
			})
			let metadata = {
				type: 'application/pdf'
			}
			let file = new File([blob], `file-${i + 1}.pdf`, metadata)

			let id = uuidv4()
			newDocs = [...newDocs, { ...$previews[inputIndex], id, docId: id, file }]
		}
		previews.update((d) => [...d.slice(0, inputIndex), ...newDocs, ...d.slice(inputIndex + 1)])
	}

	function remove(fileId: string) {
		previews.update((d) => d.filter((f) => f.docId !== fileId))
		// delete colors[fileId]
	}

	function addPdfFromUrl() {
		if (!value) return
	}

	const flipDurationMs = 300
	function handleDndConsider(e: CustomEvent<DndEvent<Preview>>) {
		previews.set(e.detail.items)
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Preview>>) {
		previews.set(e.detail.items)
	}

	async function getThumbnail(file: Preview) {
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

	// let canvases: { [key: string]: HTMLCanvasElement } = {}
</script>

{#if Object.values($colors).length > 1}
	<ul>
		{#each Object.values($colors) as c}
			<li class="flex items-center gap-2">
				<span class="inline-block h-4 w-4 rounded-full" style="background-color: {c.color};" />
				{c.name}
			</li>
		{/each}
	</ul>
{/if}

<div class="flex gap-8">
	<div
		class="flex flex-wrap gap-8 w-full bg-slate-200 rounded-2xl p-6"
		use:dndzone={{ items: $previews, flipDurationMs }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each $previews as file (file.id)}
			<div
				class="w-fit h-fit border-2 p-2"
				style="border-color: {Object.keys($colors).length > 1
					? $colors[file.parentId].color
					: 'transparent'}"
				animate:flip={{ duration: flipDurationMs }}
			>
				<div class="relative">
					<!-- <div class="absolute top-0 left-0 h-full w-full z-10" /> -->

					{#if $thumbnails[file.docId]}
						{#if $thumbnails[file.docId].status === 'loading'}
							<p>loading...</p>
						{:else}
							<img src={$thumbnails[file.docId].src} alt="ha" />
						{/if}
					{/if}
					<!-- <canvas bind:this={canvases[file.docId]} id={file.docId} height="1" width="1"></canvas> -->
					<div>
						<p class="text-center">
							{$pages[file.docId] || 0} page{$pages[file.docId] > 1 ? 's' : ''}
						</p>
						<div class="flex justify-between">
							<button
								disabled={$pages[file.docId] <= 1}
								on:click={() => split(file.docId)}
								class="disabled:bg-slate-600">split</button
							>
							<button class="text-red-600" on:click={() => remove(file.docId)}>remove</button>
						</div>
						<!-- <p>{file.id}</p> -->
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="flex flex-col gap-8 items-center w-1/2 mx-auto bg-slate-200 p-6 rounded-2xl">
		<div class="flex w-full">
			<input bind:value type="text" class="border w-full" />
			<button on:click={addPdfFromUrl}>add</button>
		</div>

		<span
			class="w-full h-0.5 bg-black relative before:absolute before:-top-[calc(1.25rem/2)] before:-translate-x-1/2 before:px-2 before:bg-slate-200 before:text-sm before:font-bold opacity-30 before:left-1/2 before:content-['OR']"
		></span>

		<FileInput bind:files />

		{#if $previews.length}
			<button on:click={merge} class="bg-red-300 w-full p-4 rounded-xl mt-12">Merge</button>
		{/if}
	</div>
</div>

{#if mergedPdfUrl}
	<iframe height={250} width={150} src={mergedPdfUrl} title="pdf-viewer"></iframe>
{/if}
