<script lang="ts">
	interface Props {
		children: import('svelte').Snippet
	}
	let { children }: Props = $props()
</script>

<div
	class="relative h-full p-4 overflow-x-hidden overflow-y-scroll lg:rounded-box pb-28 md:pb-12 lg:pb-4 [&>div]:grid [&>div]:grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] [&>div]:gap-4"
>
	{@render children()}
</div>
