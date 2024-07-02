<script lang="ts">
	import { PDFDocument } from 'pdf-lib'
	import { v4 as uuidv4 } from 'uuid'
	import FileInput from '../../components/FileInput.svelte'
	import { dndzone } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import { getInputAsUint8Array } from '../../utils'
	import { previews, colors } from '../../stores/'
	import FileCard from './FileCard.svelte'

	let files: FileList | null

	type Preview = {
		id: string
		docId: string
		name: string
		parentId: string
		file: File
	}

	let mergedPdfUrl: string

	$: if (files) {
		for (const file of files) {
			console.log(file)
			console.log(`${file.name}: ${file.size} bytes`)
			// docs = [...docs, file]
			let id = uuidv4()

			previews.add({ id, name: file.name, file })
		}
		files = null
	}

	async function merge() {
		try {
			let merger = await PDFDocument.create()

			// docs.push(new URL('https://pdf-lib.js.org/assets/with_update_sections.pdf'))
			for (const file of $previews) {
				let src = await getInputAsUint8Array(file.file)
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

	const flipDurationMs = 300
	function handleDndConsider(e: CustomEvent<DndEvent<Preview>>) {
		previews.set(e.detail.items)
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Preview>>) {
		previews.set(e.detail.items)
	}
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
			<div animate:flip={{ duration: flipDurationMs }}>
				<FileCard {file} />
			</div>
		{/each}
	</div>

	<div class="flex flex-col gap-8 items-center w-1/2 mx-auto bg-slate-200 p-6 rounded-2xl">
		<!-- <div class="flex w-full">
			<input bind:value type="text" class="border w-full" />
			<button on:click={addPdfFromUrl}>add</button>
		</div>

		<span
			class="w-full h-0.5 bg-black relative before:absolute before:-top-[calc(1.25rem/2)] before:-translate-x-1/2 before:px-2 before:bg-slate-200 before:text-sm before:font-bold opacity-30 before:left-1/2 before:content-['OR']"
		></span> -->

		<FileInput bind:files />

		{#if $previews.length}
			<button on:click={merge} class="bg-red-300 w-full p-4 rounded-xl mt-12">Merge</button>
		{/if}
	</div>
</div>

{#if mergedPdfUrl}
	<iframe height={250} width={150} src={mergedPdfUrl} title="pdf-viewer"></iframe>
{/if}
