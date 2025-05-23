<script lang="ts">
	import { docs } from '$lib/stores'
	import type { Doc } from '$lib/types'
	import { more } from '$lib/ui'
	import Popover from '$lib/ui/Popover.svelte'
	import { formatBytes } from '$lib/utils'
	import type { SvelteComponent } from 'svelte'
	import type { HTMLAttributes } from 'svelte/elements'

	interface Props {
		withOptions?: boolean
		moreOptions?: import('svelte').Snippet
	}

	let { withOptions = false, moreOptions }: Props = $props()

	let popoverRef:
		| (SvelteComponent<Props & HTMLAttributes<HTMLDivElement>, any, any> & {
				scrollHandler: () => void
		  } & { $$bindings: '' })
		| undefined = $state()

	let selectedDoc: null | Doc = $state(null)
	let docsEle: { [docId: string]: HTMLButtonElement } = $state({})
</script>

<ul
	data-testid="doc list"
	onscroll={() => {
		if (popoverRef && withOptions) {
			popoverRef.scrollHandler()
		}
	}}
>
	{#each Object.values($docs) as doc}
		<li class="relative group py-3 px-1 hover:rounded-box hover:bg-base-300 border rounded-box">
			<div class="flex justify-between gap-2">
				<div class="flex gap-2">
					<span class="w-fit flex items-center justify-center [&_svg]:size-8">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<path
								d="M21 14.25C21 14.4489 20.921 14.6397 20.7803 14.7803C20.6397 14.921 20.4489 15 20.25 15H18V16.5H19.5C19.6989 16.5 19.8897 16.579 20.0303 16.7197C20.171 16.8603 20.25 17.0511 20.25 17.25C20.25 17.4489 20.171 17.6397 20.0303 17.7803C19.8897 17.921 19.6989 18 19.5 18H18V19.5C18 19.6989 17.921 19.8897 17.7803 20.0303C17.6397 20.171 17.4489 20.25 17.25 20.25C17.0511 20.25 16.8603 20.171 16.7197 20.0303C16.579 19.8897 16.5 19.6989 16.5 19.5V14.25C16.5 14.0511 16.579 13.8603 16.7197 13.7197C16.8603 13.579 17.0511 13.5 17.25 13.5H20.25C20.4489 13.5 20.6397 13.579 20.7803 13.7197C20.921 13.8603 21 14.0511 21 14.25ZM8.625 16.125C8.625 16.8212 8.34844 17.4889 7.85616 17.9812C7.36387 18.4734 6.69619 18.75 6 18.75H5.25V19.5C5.25 19.6989 5.17098 19.8897 5.03033 20.0303C4.88968 20.171 4.69891 20.25 4.5 20.25C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25C3.75 14.0511 3.82902 13.8603 3.96967 13.7197C4.11032 13.579 4.30109 13.5 4.5 13.5H6C6.69619 13.5 7.36387 13.7766 7.85616 14.2688C8.34844 14.7611 8.625 15.4288 8.625 16.125ZM7.125 16.125C7.125 15.8266 7.00647 15.5405 6.7955 15.3295C6.58452 15.1185 6.29837 15 6 15H5.25V17.25H6C6.29837 17.25 6.58452 17.1315 6.7955 16.9205C7.00647 16.7095 7.125 16.4234 7.125 16.125ZM15.375 16.875C15.375 17.7701 15.0194 18.6285 14.3865 19.2615C13.7535 19.8944 12.8951 20.25 12 20.25H10.5C10.3011 20.25 10.1103 20.171 9.96967 20.0303C9.82902 19.8897 9.75 19.6989 9.75 19.5V14.25C9.75 14.0511 9.82902 13.8603 9.96967 13.7197C10.1103 13.579 10.3011 13.5 10.5 13.5H12C12.8951 13.5 13.7535 13.8556 14.3865 14.4885C15.0194 15.1215 15.375 15.9799 15.375 16.875ZM13.875 16.875C13.875 16.3777 13.6775 15.9008 13.3258 15.5492C12.9742 15.1975 12.4973 15 12 15H11.25V18.75H12C12.4973 18.75 12.9742 18.5525 13.3258 18.2008C13.6775 17.8492 13.875 17.3723 13.875 16.875ZM3.75 10.5V3.75C3.75 3.35218 3.90804 2.97064 4.18934 2.68934C4.47064 2.40804 4.85218 2.25 5.25 2.25H14.25C14.3485 2.24992 14.4461 2.26926 14.5371 2.3069C14.6282 2.34454 14.7109 2.39975 14.7806 2.46938L20.0306 7.71938C20.1003 7.78908 20.1555 7.87182 20.1931 7.96286C20.2307 8.05391 20.2501 8.15148 20.25 8.25V10.5C20.25 10.6989 20.171 10.8897 20.0303 11.0303C19.8897 11.171 19.6989 11.25 19.5 11.25C19.3011 11.25 19.1103 11.171 18.9697 11.0303C18.829 10.8897 18.75 10.6989 18.75 10.5V9H14.25C14.0511 9 13.8603 8.92098 13.7197 8.78033C13.579 8.63968 13.5 8.44891 13.5 8.25V3.75H5.25V10.5C5.25 10.6989 5.17098 10.8897 5.03033 11.0303C4.88968 11.171 4.69891 11.25 4.5 11.25C4.30109 11.25 4.11032 11.171 3.96967 11.0303C3.82902 10.8897 3.75 10.6989 3.75 10.5ZM15 7.5H17.6897L15 4.81031V7.5Z"
								fill={doc.color}
							/>
						</svg>
					</span>

					<div>
						<span class="line-clamp-2 leading-normal">{doc.name}</span>
						<div class="text-xs opacity-60 mt-1">
							<span>{doc.pageCount} page{doc.pageCount > 1 ? 's' : ''} - </span>
							<span>{formatBytes(doc.size)}</span>
						</div>
					</div>
				</div>

				{#if withOptions}
					<button
						aria-label="doc-options-btn"
						class="btn btn-circle btn-sm btn-ghost"
						onclick={() => (selectedDoc = doc)}
						bind:this={docsEle[doc.docId]}
					>
						{@html more}
					</button>
				{/if}
			</div>

			<!-- <ul class="ml-4 pt-2 border-l pl-2 text-sm [&>li]:py-2">
				<li>Page 1 to Page 5</li>
				<li>Page 5 to Page 8</li>
			</ul> -->
		</li>
	{/each}
</ul>

{#if withOptions}
	<Popover
		bind:this={popoverRef}
		id="doc-options"
		data-testid="doc-options"
		selectedItemId={selectedDoc?.docId}
		itemsElements={docsEle}
		onClose={() => (selectedDoc = null)}
	>
		{#if selectedDoc}
			<ul
				aria-label="doc-options-dropdown"
				class="dropdown-content menu min-w-48 xl:min-w-56 bg-base-100 rounded-box z-[1000] w-fit p-2 shadow-lg"
			>
				{@render moreOptions?.()}
				<li>
					<label class="label cursor-pointer">
						<span class="label-text">Show Pages</span>
						<input
							type="checkbox"
							class="toggle toggle-primary toggle-sm"
							checked={selectedDoc.showPages || selectedDoc.pageCount <= 1}
							onchange={() => {
								if (selectedDoc) {
									docs.toggleShowPages(selectedDoc.docId)
								}
							}}
							disabled={selectedDoc.pageCount <= 1}
						/>
					</label>
				</li>
				<li>
					<a
						aria-label="delete document"
						class="text-error"
						href={null}
						onclick={() => {
							if (selectedDoc) {
								docs.deleteDoc(selectedDoc.docId)
							}
						}}
					>
						Delete Document
					</a>
				</li>
			</ul>
		{/if}
	</Popover>
{/if}
