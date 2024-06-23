<script lang="ts">
	import { PDFDocument } from 'pdf-lib';
	import { v4 as uuidv4 } from 'uuid';

	let files: FileList;
	let docs: File[] = [];
	type Preview = {
		id: string;
		file: File;
		pages: number;
	};

	let mergedPdfUrl: string;

	$: if (files) {
		for (const file of files) {
			console.log(`${file.name}: ${file.size} bytes`);
			docs = [...docs, file];
			// const pages = await getPages(file);
			// console.log();
		}
		numOfPages = getPages(docs);
	}

	let previews: Preview[] = [];
	$: previews = docs.map((file) => ({
		id: uuidv4(),
		file,
		pages: 0
	}));

	let numOfPages = getPages(docs);

	async function merge() {
		try {
			let merger = await PDFDocument.create();
			for (const file of docs) {
				let src = await _getInputAsUint8Array(file);
				let doc = await PDFDocument.load(src);

				let indices = doc.getPageIndices();

				console.log(indices);

				const copiedPages = await merger.copyPages(doc, indices);
				copiedPages.forEach((page) => {
					merger.addPage(page);
				});
			}
			// await merger.setMetadata({
			// 	producer: 'pdf-merger-js based script'
			// });
			//@ts-ignore
			// const mergedPdf = await merger.saveAsBase64({ dataUri: true });
			const mergedPdf = await merger.save();
			let blob = new Blob([mergedPdf], {
				type: 'application/pdf'
			});
			mergedPdfUrl = URL.createObjectURL(blob);
			console.log(mergedPdfUrl);
		} catch (error) {
			console.log(error);
		}
	}

	async function _getInputAsUint8Array(input: any) {
		// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
		if (input instanceof Uint8Array) {
			return input;
		}

		// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
		if (
			input instanceof ArrayBuffer ||
			Object.prototype.toString.call(input) === '[object ArrayBuffer]'
		) {
			return new Uint8Array(input);
		}

		// see https://developer.mozilla.org/en-US/docs/Web/API/Blob
		if (typeof Blob !== 'undefined' && input instanceof Blob) {
			const aBuffer = await input.arrayBuffer();
			return new Uint8Array(aBuffer);
		}

		// see https://developer.mozilla.org/en-US/docs/Web/API/URL
		if (input instanceof URL) {
			if (typeof fetch === 'undefined') {
				throw new Error('fetch is not defined. You need to use a polyfill for this to work.');
			}
			const res = await fetch(input);
			const aBuffer = await res.arrayBuffer();
			return new Uint8Array(aBuffer);
		}

		// throw a meaningful error if input type is unknown or invalid
		const allowedTypes = ['Uint8Array', 'ArrayBuffer', 'File', 'Blob', 'URL'];
		let errorMsg = `pdf-input must be of type ${allowedTypes.join(', ')}, a valid filename or url!`;
		if (typeof input === 'string' || input instanceof String) {
			errorMsg += ` Input was "${input}" wich is not an existing file, nor a valid URL!`;
		} else {
			errorMsg += ` Input was of type "${typeof input}" instead.`;
		}
		throw new Error(errorMsg);
	}

	async function getPage(file: any) {
		const src = await _getInputAsUint8Array(file);
		const pdfDoc = await PDFDocument.load(src, _loadOptions);

		return pdfDoc.getPages().length;
	}

	async function getPages(files: any) {
		let pages: number[] = [];
		for (let file of files) {
			const src = await _getInputAsUint8Array(file);
			const pdfDoc = await PDFDocument.load(src, _loadOptions);

			pages = [...pages, pdfDoc.getPages().length];
		}

		return pages;
	}

	const _loadOptions = {
		ignoreEncryption: true
	};
	async function getPagesFromDocument(input: any, pages = undefined) {
		let file = input.file;
		const src = await _getInputAsUint8Array(file);
		const pdfDoc = await PDFDocument.load(src, _loadOptions);

		const numberOfPages = pdfDoc.getPages().length;
		let newDocs: Preview[] = [];
		for (let i = 0; i < numberOfPages; i++) {
			// Create a new "sub" document
			const subDocument = await PDFDocument.create();
			// copy the page at current index
			const [copiedPage] = await subDocument.copyPages(pdfDoc, [i]);
			subDocument.addPage(copiedPage);
			const pdfBytes = await subDocument.save();
			const blob = await new Blob([pdfBytes], {
				type: 'application/pdf'
			});
			let metadata = {
				type: 'application/pdf'
			};
			let file = new File([blob], `file-${i + 1}.pdf`, metadata);
			// const pdfBytes = await subDocument.save();
			newDocs = [...newDocs, { id: uuidv4(), file, pages: 1 }];
		}
		previews = previews.filter((f) => f.id !== input.id);
		previews = [...previews, ...newDocs];
		// let indices = []
		// if (pages === undefined) {
		//   // add the whole document
		//   indices = srcDoc.getPageIndices()
		// } else {
		//   // add selected pages switching to a 0-based index
		//   indices = pages.map(p => p - 1)
		// }

		// const copiedPages = await this._doc.copyPages(srcDoc, indices)
		// copiedPages.forEach((page) => {
		//   this._doc.addPage(page)
		// }
	}
</script>

<input bind:files type="file" accept="application/pdf" />

<div class="border-2 flex gap-8">
	{#each previews as file, i}
		<div class="border-2 w-fit">
			{#if !file.pages}
				{#await numOfPages}
					<p>...waiting</p>
				{:then number}
					<div>
						<p>The number is {number[i]}</p>
						<button
							disabled={number[i] <= 1}
							on:click={() => getPagesFromDocument(file)}
							class="disabled:bg-slate-600">split</button
						>
					</div>
				{:catch error}
					<p style="color: red">error</p>
				{/await}
			{:else}
				<div>
					<p>The number is {file.pages}</p>
					<button
						disabled={file.pages <= 1}
						on:click={() => getPagesFromDocument(file)}
						class="disabled:bg-slate-600">split</button
					>
				</div>
			{/if}
			<iframe height={250} width={150} src={URL.createObjectURL(file.file)} title="pdf-viewer"
			></iframe>
		</div>
	{/each}
</div>

<button on:click={merge}>merge</button>

{#if mergedPdfUrl}
	<iframe height={250} width={150} src={mergedPdfUrl} title="pdf-viewer"></iframe>
{/if}
