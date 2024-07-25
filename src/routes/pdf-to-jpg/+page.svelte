<script lang="ts">
	import { FileInput } from '$lib/ui'

	let files: FileList | null

	$: if (files) {
		for (const file of files) {
			console.log(file)
			console.log(`${file.name}: ${file.size} bytes`)
		}
		files = null
	}
</script>

<div class="flex-1 flex flex-col justify-center">
	<!-- description  -->
	<div class="mb-8 prose max-w-none">
		<h1>Convert Your PDFs to JPGs Effortlessly!</h1>
		<p>
			Quickly transform your PDF files into high-quality JPG images. Simply upload your documents
			below, and easily convert single pages or entire PDFs in just a few clicks!
		</p>
	</div>

	<FileInput bind:files />
</div>
