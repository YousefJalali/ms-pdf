<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let selectedItemId: any
	export let itemsElements: { [cardId: string]: HTMLButtonElement } = {}

	let windowHeight: number
	let popover: HTMLElement
	let selectedItemEleTop = 1
	$: if (selectedItemId && selectedItemEleTop) {
		const { x, y, width, top } = itemsElements[selectedItemId].getBoundingClientRect()
		const padding = 10
		const popoverHeight = 180
		const popoverWidth = 132

		const translateX = x - padding + width - 16 - popoverWidth
		const translateY =
			top + popoverHeight + 16 > windowHeight ? y - padding - popoverHeight + 48 : y - padding + 36

		popover.style.transform = `translate(${translateX}px, ${translateY}px)`
		popover.showPopover()
	}

	const dispatch = createEventDispatcher()

	function closeHandler() {
		popover.hidePopover()
		dispatch('close')
	}
</script>

<svelte:window
	bind:innerHeight={windowHeight}
	on:scroll={() => {
		if (selectedItemId) {
			selectedItemEleTop = itemsElements[selectedItemId].getBoundingClientRect().top
		}
	}}
/>

<div
	{...$$restProps}
	bind:this={popover}
	popover=""
	class="m-4 bg-transparent"
	on:toggle={({ newState }) => {
		if (newState === 'closed') {
			closeHandler()
		}
	}}
>
	{#if selectedItemId}
		<slot />
	{/if}
</div>
