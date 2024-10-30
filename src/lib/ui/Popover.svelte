<script lang="ts">
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte'

	export let selectedItemId: any
	export let itemsElements: { [cardId: string]: HTMLButtonElement } = {}

	let windowHeight: number
	let popover: HTMLElement
	let selectedItemEleTop = 1
	const popoverSize = {
		height: 0,
		width: 0
	}
	$: if (popover && selectedItemId && selectedItemEleTop) {
		const { x, y, width, top, height } = itemsElements[selectedItemId].getBoundingClientRect()
		const padding = 16
		const popoverHeight = popoverSize.height
		const popoverWidth = popoverSize.width

		const translateX = x - padding + width - popoverWidth
		const translateY =
			top + popoverHeight + 16 > windowHeight ? y - padding - popoverHeight : y - padding + height

		popover.style.transform = `translate(${translateX}px, ${translateY}px)`
		popover.showPopover()
	}

	afterUpdate(() => {
		const { height, width } = popover.getBoundingClientRect()
		popoverSize.height = height
		popoverSize.width = width
	})

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
	class="m-4 bg-transparent transition ease-in-out duration-[30ms]"
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
