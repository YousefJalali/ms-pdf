<script lang="ts">
	import { PDFDocument } from 'pdf-lib'
	import { v4 as uuidv4 } from 'uuid'
	import FileInput from '../components/FileInput.svelte'

	function randomColor() {
		return '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
	}

	const _loadOptions = {
		ignoreEncryption: true
	}
	type SupportedTypes = File | Uint8Array | ArrayBuffer | Blob | URL
	let value: string
	let files: FileList | null
	// let docs: File[] = []
	type Preview = {
		id: string
		name: string
		parentId: string
		file: File
	}
	let previews: Preview[] = []

	let mergedPdfUrl: string

	$: if (files) {
		for (const file of files) {
			console.log(file)
			console.log(`${file.name}: ${file.size} bytes`)
			// docs = [...docs, file]
			let id = uuidv4()
			previews = previews.concat({
				id,
				name: file.name,
				parentId: id,
				file
			})
		}
		files = null
		numOfPages = getPages(previews)
	}

	let colors: { [key: string]: { name: string; color: string } } = {}
	$: if (previews) {
		for (let f of previews) {
			if (!colors[f.parentId]) {
				colors[f.parentId] = {
					name: f.name,
					color: randomColor()
				}
			}
		}
	}

	let numOfPages: Promise<{ [key: string]: number }> = getPages(previews)

	async function merge() {
		try {
			let merger = await PDFDocument.create()

			// docs.push(new URL('https://pdf-lib.js.org/assets/with_update_sections.pdf'))
			for (const file of previews) {
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

	async function getPages(files: Preview[]) {
		let pages: { [key: string]: number } = {}
		for (let file of files) {
			const src = await _getInputAsUint8Array(file.file)
			const pdfDoc = await PDFDocument.load(src, _loadOptions)

			pages[file.id] = pdfDoc.getPages().length
		}

		return pages
	}

	async function split(fileId: string, pages = undefined) {
		let inputIndex = previews.findIndex((f) => f.id === fileId)
		let file = previews[inputIndex].file
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

			newDocs = [...newDocs, { ...previews[inputIndex], id: uuidv4(), file }]
		}
		previews = [...previews.slice(0, inputIndex), ...newDocs, ...previews.slice(inputIndex + 1)]

		numOfPages = getPages(previews)
	}

	function remove(fileId: string) {
		previews = previews.filter((f) => f.id !== fileId)
	}

	function addPdfFromUrl() {
		if (!value) return
	}
</script>

{#if Object.values(colors).length > 1}
	<ul>
		{#each Object.values(colors) as c}
			<li class="flex items-center gap-2">
				<span class="inline-block h-4 w-4 rounded-full" style="background-color: {c.color};" />
				{c.name}
			</li>
		{/each}
	</ul>
{/if}

<div class="flex gap-8">
	<div class="flex flex-wrap gap-8 w-full bg-slate-200 rounded-2xl p-6">
		{#each previews as file, i}
			<div
				class="w-fit h-fit border-2 p-2"
				style="border-color: {Object.keys(colors).length > 1
					? colors[file.parentId].color
					: 'transparent'}"
			>
				<iframe height={250} width={150} src={URL.createObjectURL(file.file)} title="pdf-viewer"
				></iframe>

				{#await numOfPages}
					<p>...waiting</p>
				{:then page}
					<div>
						<p class="text-center">{page[file.id] || 0} page{page[file.id] > 1 ? 's' : ''}</p>
						<div class="flex justify-between">
							<button
								disabled={page[file.id] <= 1}
								on:click={() => split(file.id)}
								class="disabled:bg-slate-600">split</button
							>
							<button class="text-red-600" on:click={() => remove(file.id)}>remove</button>
						</div>
						<!-- <p>{file.id}</p> -->
					</div>
				{:catch error}
					<p style="color: red">error</p>
				{/await}
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

		{#if previews.length}
			<button on:click={merge} class="bg-red-300 w-full p-4 rounded-xl mt-12">Merge</button>
		{/if}
	</div>
</div>

{#if mergedPdfUrl}
	<iframe height={250} width={150} src={mergedPdfUrl} title="pdf-viewer"></iframe>
{/if}
