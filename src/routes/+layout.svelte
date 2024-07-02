<script>
	import '../app.css'
</script>

<main class="container mx-auto">
	<header class="py-8 mb-16 flex justify-between">
		<h1 class="text-3xl font-bold"><a href="/">Logo</a></h1>

		<nav>
			<ul class="flex gap-8">
				<li><a href="/merge">Merge</a></li>
				<li><a href="/split">Split</a></li>
			</ul>
		</nav>
	</header>

	<slot />
</main>
