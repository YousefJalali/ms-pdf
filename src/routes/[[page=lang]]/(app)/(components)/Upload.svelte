<script lang="ts">
	import { MAX_FILE_UPLOAD } from '$lib/constants'
	import { alerts, docs } from '$lib/stores'
	import type { Snippet } from 'svelte'

	interface Props {
		Component: any
		showPages?: boolean
		placeholder?: Snippet
		props?: any
	}

	let { Component, showPages = false, placeholder, props }: Props = $props()

	let files: FileList | null | undefined = $state()

	const maxFileReached = () =>
		alerts.add('error', `The maximum number of files you can upload is ${MAX_FILE_UPLOAD}`)

	$effect(() => {
		if (files) {
			let count = Object.keys($docs).length

			if (count < MAX_FILE_UPLOAD) {
				for (const file of files) {
					count++
					if (count > MAX_FILE_UPLOAD) {
						maxFileReached()
						break
					} else {
						docs.create(file, showPages)
					}
				}
				files = null
			} else {
				maxFileReached()
			}
		}
	})
</script>

<Component bind:files {placeholder} {props} />
