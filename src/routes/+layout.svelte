<script lang="ts">
	import '../app.css'
	import Alert from '$lib/ui/Alert.svelte'
	import { blankPage, drawer, moon, sun } from '$lib/ui'
	import { onMount } from 'svelte'
	import { locale, setLang, type Lang } from '$lib/i18n'
	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()

	onMount(() => {
		const LangInLS = localStorage.getItem('lang') as Lang

		if (LangInLS && LangInLS !== $locale) setLang(LangInLS)
	})
</script>

<svelte:head>
	<meta name="google-site-verification" content="maUHEPNCAafwRrAAQo-ufXpX0pn_8GDOxfIeZEl4DYc" />
</svelte:head>

<!-- main content -->
{@render children?.()}
<Alert />

<!-- <div class="flex flex-col h-screen"> -->
<!-- <header class="navbar lg:hidden w-full px-4 lg:px-6 lg:h-[64px]">
		<div class="flex-1"><a class="btn btn-ghost btn-square" href="/">LOGO</a></div>


		<div class="flex-none lg:hidden ml-2">
			<label for="nav-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
				{@html drawer}
			</label>
		</div>
	</header> -->

<!-- <footer class="footer hidden footer-center text-base-content p-4 h-[50px]">
		<aside>
			<p>
				Build by <a
					class="link group inline-flex items-center gap-1"
					href="https://github.com/YousefJalali"
					target="_blank">Yousef Jalali {@html blankPage}</a
				>
			</p>
		</aside>
	</footer> -->
<!-- </div> -->
