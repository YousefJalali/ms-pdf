<script lang="ts">
	import { PDFDocument } from 'pdf-lib'
	import FileInput from '../../../components/FileInput.svelte'
	import { docs, mergedPdf, pages } from '../../../stores'
	import { getInputAsUint8Array } from '../../../utils'
	import SideBarList from './SideBarList.svelte'

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
			<SideBarList />
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
				class="btn btn-primary disabled:cursor-not-allowed"
				disabled={$pages.length < 2}>Merge</button
			>
		</div>
	{/if}
</div>
