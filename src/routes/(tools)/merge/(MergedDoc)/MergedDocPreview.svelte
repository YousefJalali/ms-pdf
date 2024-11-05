<script lang="ts">
	import { rotationStyle } from '$lib/utils'

	let {
		largeImage,
		smallImage,
		page,
		docName
	} = $props();
</script>

<div class="h-[450px] flex justify-center items-center">
	{#if largeImage}
		<img
			class="h-full object-contain m-0"
			style={rotationStyle(page)}
			src={URL.createObjectURL(largeImage)}
			alt={`${docName} ${page.pageNum}`}
		/>
	{:else if smallImage}
		<img
			style={rotationStyle(page)}
			class="h-full object-contain m-0"
			src={URL.createObjectURL(smallImage)}
			alt={`${docName} ${page.pageNum}`}
		/>
	{:else}
		loading...
	{/if}
</div>
