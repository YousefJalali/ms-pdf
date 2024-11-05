<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'

	interface Props {
		selectedItemId: any
		itemsElements: { [cardId: string]: HTMLButtonElement }
		onClose: () => void
		children?: import('svelte').Snippet
		// popover: HTMLDivElement
	}

	let popover: HTMLDivElement
	let {
		selectedItemId,
		itemsElements,
		children,
		onClose,
		// popover = $bindable(),
		...rest
	}: Props & HTMLAttributes<HTMLDivElement> = $props()

	let windowHeight: number | undefined = $state()
	// let popover: HTMLElement
	let selectedItemEleTop = $state(1)
	const popoverSize = $state({
		height: 0,
		width: 0
	})

	$effect(() => {
		if (popover && selectedItemId && selectedItemEleTop && windowHeight) {
			const { x, y, width, top, height } = itemsElements[selectedItemId].getBoundingClientRect()
			const padding = 16
			const popoverHeight = popoverSize.height || 88
			const popoverWidth = popoverSize.width || 192

			const translateX = x - padding + width - popoverWidth
			const translateY =
				top + popoverHeight + 16 > windowHeight ? y - padding - popoverHeight : y - padding + height

			popover.style.transform = `translate(${translateX}px, ${translateY}px)`
			popover.showPopover()
		}
	})

	$effect.pre(() => {
		if (popover && !popoverSize.height) {
			const { height, width } = popover.getBoundingClientRect()
			popoverSize.height = height
			popoverSize.width = width
		}
	})

	function closeHandler() {
		popover.hidePopover()
		onClose()
	}

	export function scrollHandler() {
		if (selectedItemId) {
			selectedItemEleTop = itemsElements[selectedItemId].getBoundingClientRect().top
		}
	}
</script>

<svelte:window bind:innerHeight={windowHeight} />

<div
	{...rest}
	bind:this={popover}
	popover=""
	class="m-4 bg-transparent transition ease-in-out duration-[30ms]"
	ontoggle={({ newState }) => {
		if (newState === 'closed') {
			closeHandler()
		}
	}}
>
	{#if selectedItemId}
		{@render children?.()}
	{/if}
</div>
