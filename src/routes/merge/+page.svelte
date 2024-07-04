<script lang="ts">
	import { PDFDocument } from 'pdf-lib'
	import { v4 as uuidv4 } from 'uuid'
	import FileInput from '../../components/FileInput.svelte'
	import { dndzone } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import { getInputAsUint8Array } from '../../utils'
	import { previews, colors, pages } from '../../stores/'
	import FileCard from './FileCard.svelte'
	import { formatBytes } from '../../utils/formatBytes'

	let files: FileList | null

	type Preview = {
		id: string
		docId: string
		name: string
		size: number
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

<div class="flex gap-8 h-[calc(100vh-100px-100px)]">
	{#if $previews.length}
		<div
			class="w-full bg-gray-100 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden"
		>
			<!-- <div class="w-full p-4">
			<button class="flex gap-2 px-4 py-2 bg-gray-200 rounded-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>

				add</button
			>
		</div> -->
			<div
				class="flex flex-wrap gap-4 w-full p-4"
				use:dndzone={{ items: $previews, flipDurationMs }}
				on:consider={handleDndConsider}
				on:finalize={handleDndFinalize}
			>
				{#each $previews as file (file.id)}
					<div class="h-fit" animate:flip={{ duration: flipDurationMs }}>
						<FileCard {file} />
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div
		class="flex-1 flex flex-col justify-between h-full max-h-full overflow-hidden min-w-80 border border-slate-200 p-4 rounded-2xl"
	>
		<div class="flex flex-col flex-1 h-full">
			<!-- input -->
			<div>
				{#if $previews.length}
					<label for="file-input-button">
						<div
							class="flex gap-2 justify-center items-center border-2 border-blue-700 text-blue-700 px-3 py-4 rounded-xl text-center cursor-pointer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="size-5"
							>
								<path
									fill-rule="evenodd"
									d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
									clip-rule="evenodd"
								/>
							</svg>
							Add More Docs
						</div>
						<input
							bind:files
							type="file"
							multiple
							accept="application/pdf"
							id="file-input-button"
							class="hidden"
						/>
					</label>
				{:else}
					<FileInput bind:files />
				{/if}
			</div>

			<!-- list of docs -->

			{#if Object.values($colors).length}
				<ul class="w-full h-0 flex-auto space-y-4 py-4 overflow-y-scroll">
					{#each Object.values($colors) as c}
						<li class="flex flex-col">
							<div class="flex gap-2 text-sm">
								<div class="h-5 w-fit flex items-center justify-center">
									<span
										class="h-3 w-3 shrink-0 grow-0 rounded-full"
										style="background-color: {c.color};"
									/>
								</div>

								<span class="line-clamp-2 leading-5">{c.name}</span>
							</div>
							<div class="text-xs opacity-60 ml-5">
								<span>{$pages[c.id]} pages - </span>
								<span>{formatBytes($previews.find((e) => e.id === c.id)?.size || 0)}</span>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Merge button -->
		{#if $previews.length}
			<div class="w-full text-center">
				{#if $previews.length < 2}
					<span class="inline-block mt-2 text-sm opacity-60">Add more files</span>
				{/if}

				<button
					on:click={merge}
					class="bg-red-300 w-full p-4 rounded-xl disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
					disabled={$previews.length < 2}>Merge</button
				>
			</div>
		{/if}
	</div>
</div>

{#if mergedPdfUrl}
	<iframe height={250} width={150} src={mergedPdfUrl} title="pdf-viewer"></iframe>
{/if}
