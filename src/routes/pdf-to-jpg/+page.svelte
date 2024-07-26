<script lang="ts">
	import { docs, thumbnails, uploadingDocs } from '$lib/stores/convert'
	import { DocItem, FileInput } from '$lib/ui'
	import UploadButton from '$lib/ui/UploadButton.svelte'
	import { getPageAsBlob } from '$lib/utils'

	let files: FileList | null

	let IMAGE_FORMATS: ('jpeg' | 'webp' | 'png')[] = ['jpeg', 'png', 'webp']
	let quality = 75
	let imageFormat = IMAGE_FORMATS[0]

	$: if (files) {
		for (const file of files) {
			docs.add(file)
		}
		files = null
	}

	let downloading = false
	async function download() {
		downloading = true
		let blobsPromise = []
		let res: Blob[] = []
		let docNames = []

		for (let doc of Object.values($docs)) {
			for (let pageId in doc.pagesPdfProxy) {
				let pagePdf = doc.pagesPdfProxy[pageId]
				docNames.push(doc.name)
				blobsPromise.push(getPageAsBlob(pagePdf, pageId, (quality * 4) / 100, true, imageFormat))
			}
		}

		if (blobsPromise.length) {
			let blobs = await Promise.all(blobsPromise)
			for (let blob of blobs) {
				if (blob instanceof Blob) {
					res.push(blob)
				}
			}
		}

		res.forEach((r, i) => {
			const link = document.createElement('a')
			link.href = URL.createObjectURL(r)
			link.download = docNames[i].split('.')[0]
			// some browser needs the anchor to be in the doc
			document.body.append(link)
			link.click()
			link.remove()
		})

		await docs.destroyAll()

		// downloadFiles(res)

		reset()
	}

	function reset() {
		files = null
		downloading = false
		quality = 75
		imageFormat = IMAGE_FORMATS[0]
	}
</script>

<!-- <div class="flex gap-8 h-[calc(100vh-100px-32px-25px)]"></div> -->
<div class="flex gap-8 h-[calc(100vh-100px-32px-25px)]">
	{#if !Object.keys($thumbnails).length && $uploadingDocs}
		<div class="prose flex flex-col items-center justify-center mx-auto text-center">
			<span class="loading loading-ring loading-lg mb-4"></span>
			<h1>Uploading Your PDFs...</h1>
			<p>
				Your PDFs are being uploaded. Please wait a moment while we securely transfer your
				documents. Once the upload is complete, you'll be able to convert them into high-quality JPG
				images.
			</p>
		</div>
	{:else if Object.keys($thumbnails).length}
		<div class="flex gap-8">
			<div class="grid grid-cols-3 gap-4 bg-base-200 rounded-xl p-4 overflow-y-scroll">
				{#each Object.keys($thumbnails) as pageId}
					<div>
						<img
							class="border rounded-lg w-[200px] h-[200px] object-scale-down"
							src={URL.createObjectURL($thumbnails[pageId])}
							alt={pageId}
						/>
					</div>
					<!-- <div class="indicator h-fit">
						<span class="indicator-item indicator-center indicator-middle badge badge-secondary">
							JPG
						</span>
						<img
							class="border rounded-lg w-[200px] h-[200px] object-scale-down"
							src={URL.createObjectURL($thumbnails[pageId])}
							alt={pageId}
						/>
					</div> -->
				{/each}
			</div>
			<div class="min-w-80 border flex flex-col rounded-xl p-4">
				<div class="mb-4">
					<UploadButton bind:files />
				</div>

				<div class="divider divider-center opacity-80 text-sm">Uploaded Docs</div>
				<ul class="w-full h-0 flex-auto p-0 overflow-y-scroll divide-y" data-testid="doc list">
					{#each Object.values($docs) as doc}
						<DocItem {doc} />
					{/each}
				</ul>

				<div class="divider divider-center opacity-80 text-sm">Download Options</div>

				<div class="pb-4 space-y-4">
					<div>
						<span class="font-semibold text-xs mb-1 inline-block opacity-60 uppercase">Quality</span
						>
						<input
							bind:value={quality}
							type="range"
							min="25"
							max="100"
							class="range range-xs range-primary"
							step="25"
						/>
						<div class="flex w-full justify-between text-xs">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span>{quality}%</span>
						</div>
					</div>

					<div>
						<span class="font-semibold text-xs mb-1 inline-block opacity-60 uppercase">Format</span>
						{#each IMAGE_FORMATS as format}
							<div class="form-control">
								<label class="label cursor-pointer checked:bg-base-300">
									<span class="label-text">{format}</span>
									<input
										type="radio"
										name="image format"
										class="radio checked:bg-primary"
										bind:group={imageFormat}
										value={format}
									/>
								</label>
							</div>
						{/each}
					</div>
				</div>

				<button class="btn btn-primary mt-2" on:click={download}>
					{#if downloading}
						<span class="loading loading-spinner"></span>
					{/if}
					Download All</button
				>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center">
			<!-- description  -->
			<div class="mb-8 prose max-w-none">
				<h1>Convert Your PDFs to JPGs Effortlessly!</h1>
				<p>
					Quickly transform your PDF files into high-quality JPG images. Simply upload your
					documents below, and easily convert single pages or entire PDFs in just a few clicks!
				</p>
			</div>

			<FileInput bind:files />
		</div>
	{/if}
</div>
