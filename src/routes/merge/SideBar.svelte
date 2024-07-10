<script lang="ts">
	import { PDFDocument } from 'pdf-lib'
	import FileInput from '../../components/FileInput.svelte'
	import { docs, mergedPdf, pages } from '../../stores/'
	import { getInputAsUint8Array } from '../../utils'
	import { formatBytes } from '../../utils/formatBytes'

	let files: FileList | null

	$: if (files) {
		for (const file of files) {
			console.log(file)
			console.log(`${file.name}: ${file.size} bytes`)

			docs.add(file)
		}
		files = null
	}

	async function merge() {
		try {
			let merger = await PDFDocument.create()

			// docs.push(new URL('https://pdf-lib.js.org/assets/with_update_sections.pdf'))
			for (const page of $pages) {
				let src = await getInputAsUint8Array(page.file)
				let pdfDoc = await PDFDocument.load(src)

				let indices = pdfDoc.getPageIndices()
				const copiedPages = await merger.copyPages(pdfDoc, indices)

				for (let page of copiedPages) {
					merger.addPage(page)
				}
			}

			const merged = await merger.save()
			let blob = new Blob([merged], {
				type: 'application/pdf'
			})

			mergedPdf.set(URL.createObjectURL(blob))
		} catch (error) {
			console.log(error)
		}
	}

	const trash = `<svg
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
					d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
				/>
			</svg>`
</script>

<div
	class={`relative flex flex-col justify-center flex-[2] min-w-80 border-slate-200 rounded-2xl ${$pages.length ? 'p-4 border justify-between [&>*:first-child]:hidden' : ''}`}
>
	<!-- description  -->
	<div class="mb-8">
		<h1 class="text-5xl font-black mb-4">Merge Your PDFs Seamlessly!</h1>
		<p class="opacity-60 leading-relaxed">
			Easily combine your PDF files into one cohesive document. Simply upload your files below. You
			can select multiple files at once for a quick and efficient merge!
		</p>
	</div>

	<div class={`flex flex-col ${$pages.length ? 'h-full' : ''}`}>
		<!-- input -->
		<div>
			{#if $pages.length}
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
		{#if Object.values($docs).length}
			<ul class="w-full h-0 flex-auto mt-3 py-4 overflow-y-scroll divide-y">
				{#each Object.values($docs) as doc}
					<li class="group flex justify-between gap-2 hover:bg-gray-100 py-3 px-1">
						<div>
							<div class="flex gap-2 text-sm">
								<div class="h-5 w-fit flex items-center justify-center">
									<span
										class="h-3 w-3 shrink-0 grow-0 rounded-full"
										style="background-color: {doc.color};"
									/>
								</div>

								<span class="line-clamp-2 leading-5">{doc.name}</span>
							</div>
							<div class="text-xs opacity-60 ml-5">
								<span>{doc.pageCount} page{doc.pageCount > 1 ? 's' : ''} - </span>
								<span>{formatBytes(doc.size)}</span>
							</div>
						</div>
						<div class="hidden group-hover:block">
							<button class="opacity-60" on:click={() => docs.removeDoc(doc.docId)}
								>{@html trash}</button
							>
							<label>
								show pages
								<input
									type="checkbox"
									checked={doc.showPages}
									on:change={() => docs.toggleShowPages(doc.docId)}
								/>
							</label>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<!-- Merge button -->
	{#if $pages.length}
		<div class="w-full text-center">
			<span
				class="inline-block mt-2 text-sm opacity-60"
				style="opacity: {$pages.length < 2 ? 1 : 0}">Add more files to merge</span
			>

			<button
				on:click={merge}
				class="bg-red-300 w-full p-4 rounded-xl disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
				disabled={$pages.length < 2}>Merge</button
			>
		</div>
	{/if}
</div>
