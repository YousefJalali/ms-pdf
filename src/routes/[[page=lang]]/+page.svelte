<script lang="ts">
	import { TOOLS } from '$lib/constants'
	import { locale } from '$lib/i18n'
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion'
	import { Card, CardHeader, CardContent, CardFooter } from '$lib/components/ui/card'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import { Textarea } from '$lib/components/ui/textarea'
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert'
	import { AlertCircle, Menu, ChevronsDown } from 'lucide-svelte'
	import { Separator } from '$lib/components/ui/separator'
	import {
		Sheet,
		SheetContent,
		SheetFooter,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet'

	interface RouteProps {
		href: string
		label: string
	}

	const routeList: RouteProps[] = [
		{ href: '#tools', label: 'Tools' },
		{ href: '#features', label: 'Features' },
		{ href: '#contact', label: 'Contact' },
		{ href: '#faq', label: 'FAQ' }
	]

	let isOpen = false

	interface ContactFormProps {
		firstName: string
		lastName: string
		email: string
		subject: string
		message: string
	}

	let contactForm: ContactFormProps = {
		firstName: '',
		lastName: '',
		email: '',
		subject: 'Web Development',
		message: ''
	}

	let invalidInputForm = false

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault()
		const { firstName, lastName, email, subject, message } = contactForm
		console.log(contactForm)

		const mailToLink = `mailto:leomirandadev@gmail.com?subject=${subject}&body=Hello I am ${firstName} ${lastName}, my Email is ${email}. %0D%0A${message}`
		window.location.href = mailToLink
	}

	interface FAQProps {
		question: string
		answer: string
		value: string
	}

	const FAQList: FAQProps[] = [
		{
			question: 'Is this PDF tool free to use?',
			answer:
				'Yes, all core features are completely free to use with no hidden costs or subscriptions.',
			value: 'item-1'
		},
		{
			question: 'Will my files be saved or shared?',
			answer:
				'No. Your files are processed instantly and never stored on any server. Your privacy is our priority.',
			value: 'item-2'
		},
		{
			question: 'Can I use this tool on mobile devices?',
			answer:
				'Absolutely! The interface is fully responsive and optimized for use on phones and tablets.',
			value: 'item-3'
		},
		{
			question: 'Are there watermarks on the exported files?',
			answer: 'No watermarks are ever added. You get clean, professional results every time.',
			value: 'item-4'
		},
		{
			question: 'What types of PDF tools are available?',
			answer:
				'You can merge, split, compress, and convert PDF files with just one click. More tools coming soon!',
			value: 'item-5'
		}
	]

	// function scrollToBottom() {
	// 	if (!window || !toolsSection) return
	// 	window.scrollTo({
	// 		top: document.body.scrollHeight - toolsSection.scrollHeight - 100,
	// 		behavior: 'smooth'
	// 	})
	// }

	// let toolsSection: HTMLElement

	const features = [
		{
			name: 'Mobile Friendly',
			description:
				'Use all tools directly from your phone or tablet with a clean and responsive interface.',
			icon: `<rect width="10" height="14" x="3" y="8" rx="2"></rect><path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4"></path><path d="M8 18h.01"></path>`
		},
		{
			name: 'No Watermarks',
			description: 'Export clean, high-quality PDFs with zero branding or watermarks — always.',
			icon: `<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77"></path><path d="m9 12 l2 -2 l4 -4"></path>`
		},
		{
			name: 'Fast & Reliable',
			description:
				'Process large PDF files in seconds with optimized performance and secure handling.',
			icon: `<path d="M12,13V2l8,4-8,4"></path><path d="M20.561,10.222a9,9,0,1,1-12.55-5.29"></path><path d="M8.002,9.997a5,5,0,1,0,8.9,2.02"></path>`
		},
		{
			name: 'Intuitive Interface',
			description: 'Drag, drop, and rearrange pages easily — no learning curve required.',
			icon: `<path d="M2,10h6V4"></path><path d="m2,4 l6,6"></path><path d="M21,10V7a2,2,0,0,0-2-2h-7"></path><path d="M3,14v2a2,2,0,0,0,2,2h3"></path><rect x="12" y="14" width="10" height="7" rx="1"></rect>`
		},
		{
			name: 'One-Click Tools',
			description: 'Merge, split, convert, and compress with just one click — no setup needed.',
			icon: `<path d="M3 12h18"></path><path d="M12 3v18"></path>` // simple cross icon to match "one-click"
		},
		{
			name: 'Privacy First',
			description: 'Files are processed instantly and never stored — your data stays yours.',
			icon: `<path d="M5 12h14"></path><path d="M12 5v14"></path><circle cx="12" cy="12" r="10"></circle>` // shield-like with center lock
		}
	]
</script>

<header
	class="w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border z-40 rounded-2xl flex justify-between items-center p-2 bg-card shadow-md dark:shadow-dark shadow-light"
>
	<a href="/" class="font-bold text-lg flex items-center">
		<ChevronsDown
			class="bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white"
		/>
		PDF Daddy
	</a>

	<!-- Mobile -->
	<div class="flex items-center lg:hidden">
		<Sheet bind:open={isOpen}>
			<SheetTrigger>
				<Menu on:click={() => (isOpen = true)} class="cursor-pointer" />
			</SheetTrigger>

			<SheetContent
				side="left"
				class="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card"
			>
				<div>
					<SheetHeader class="mb-4 ml-4">
						<SheetTitle class="flex items-center">
							<a href="/" class="flex items-center">
								<ChevronsDown
									class="bg-gradient-to-tr from-primary/70 via-primary to-primary/70 rounded-lg size-9 mr-2 border text-white"
								/>
								ShadcnSvelte
							</a>
						</SheetTitle>
					</SheetHeader>

					<div class="flex flex-col gap-2">
						{#each routeList as { href, label }}
							<a on:click={() => (isOpen = false)} {href}>
								<Button variant="ghost" class="justify-start text-base w-full">
									{label}
								</Button>
							</a>
						{/each}
					</div>
				</div>

				<SheetFooter class="flex-col sm:flex-col justify-start items-start">
					<Separator class="mb-2" />
					<!-- <ToggleTheme /> -->
				</SheetFooter>
			</SheetContent>
		</Sheet>
	</div>
	<div class="hidden lg:flex items-center gap-1">
		<!-- Navigation Links -->
		{#each routeList as { href, label }}
			<a {href} class={buttonVariants({ variant: 'ghost', size: 'default' })}>
				{label}
			</a>
		{/each}
	</div>

	<!-- <div class="hidden lg:flex">
    <ToggleTheme />
    <Button size="sm" variant="ghost" aria-label="View on GitHub">
      <a
        aria-label="View on GitHub"
        href="https://github.com/zxce3/shadcn-sveltekit-landing-page.git"
        target="_blank"
      >
        <GithubIcon class_="size-5" />
      </a>
    </Button>
  </div> -->
</header>

<section class="container">
	<div class="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
		<div class="text-center space-y-8">
			<span
				class="focus:ring-ring inline-flex items-center rounded-full border px-2.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-foreground text-sm py-2"
				><span class="mr-2 text-primary"
					><span
						class="focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/80 border-transparent"
						>New</span
					></span
				> <span>Design is out now!</span></span
			>
			<div class="max-w-screen-md mx-auto text-center text-5xl md:text-6xl font-bold">
				<h1>
					Transform <span
						class="text-transparent bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text"
						>PDFs</span
					> Like a Pro
				</h1>
			</div>

			<p class="max-w-screen-sm mx-auto text-xl text-muted-foreground">
				Manage PDFs like magic! Effortlessly merge, split, and transform documents with our powerful
				app — boosting your productivity with ease.
			</p>

			<div class="space-y-4 md:space-y-0 md:space-x-4">
				<Button>Get Started</Button>
			</div>
		</div>
		<div class="relative group mt-14">
			<div
				class="absolute -top-6 right-12 w-[90%] h-12 lg:h-[80%] bg-primary/50 blur-3xl rounded-full img-shadow-animation svelte-1ec698p"
			></div>
			<img
				class="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-t-primary/30 img-border-animation svelte-1ec698p"
				src="hero-image-light.jpg"
				alt="dashboard using shadcn-svelte"
			/>
			<div
				class="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"
			></div>
		</div>
	</div>
</section>

<section id="tools" class="container py-24 sm:py-32">
	<div class="grid lg:grid-cols-2 place-items-center lg:gap-24">
		<div>
			<h2 class="text-lg text-primary mb-2 tracking-wider">Tools</h2>
			<h2 class="text-3xl md:text-4xl font-bold mb-4">Powerful PDF Tools in One Place</h2>
			<p class="text-xl text-muted-foreground mb-8">
				Merge or split your PDFs effortlessly. Our tools help you organize documents with speed and
				precision.
			</p>
		</div>
		<div class="grid lg:grid-cols-2 gap-4 w-full">
			{#each TOOLS as tool, i}
				<a
					href={`${$locale}/${tool.link}`}
					class="text-card-foreground rounded-lg border shadow-sm bg-muted/50 dark:bg-card hover:bg-background dark:hover:bg-background transition-all delay-75 group/number"
				>
					<div class="flex flex-col space-y-1.5 p-6 pb-0">
						<div class="flex justify-between">
							<span class="mb-6">{@html tool.icon}</span>

							<span
								class="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30"
								>0{i + 1}</span
							>
						</div>
						<div
							role="heading"
							aria-level="3"
							class="text-2xl font-semibold leading-none tracking-tight"
						>
							{tool.name}
						</div>
					</div>

					<div class="p-6 text-muted-foreground">
						{tool.description}
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<section id="features" class="container py-24 sm:py-32">
	<h2 class="text-lg text-primary text-center mb-2 tracking-wider">Features</h2>
	<h2 class="text-3xl md:text-4xl text-center font-bold mb-4">
		What Makes Our PDF Tools Stand Out
	</h2>
	<h3 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
		All-in-one PDF toolkit built for speed, simplicity, and control — no downloads, no watermarks,
		just productivity.
	</h3>
	<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each features as feature}
			<div class="text-card-foreground rounded-lg h-full bg-background border-0 shadow-none">
				<div class="flex-col space-y-1.5 p-6 pb-0 flex justify-center items-center">
					<div class="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide-icon lucide lucide-tablet-smartphone size-6 text-primary"
							>{@html feature.icon}</svg
						>
					</div>
					<div
						role="heading"
						aria-level="3"
						class="text-2xl font-semibold leading-none tracking-tight"
					>
						{feature.name}
					</div>
				</div>

				<div class="p-6 text-muted-foreground text-center">
					{feature.description}
				</div>
			</div>
		{/each}
	</div>
</section>

<section id="contact" class="container py-24 sm:py-32">
	<section class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<div>
			<div class="mb-4">
				<h2 class="text-lg text-primary mb-2 tracking-wider">Contact</h2>
				<h2 class="text-3xl md:text-4xl font-bold">Connect With Us</h2>
			</div>
			<p class="mb-8 text-muted-foreground lg:w-5/6">
				Have questions or feedback? We'd love to hear from you. Whether you're facing an issue or
				have a suggestion, reach out and we’ll get back to you as soon as possible.
			</p>
		</div>

		<!-- Form -->
		<Card class="bg-muted/60 dark:bg-card">
			<CardHeader class="text-primary text-2xl" />
			<CardContent>
				<form on:submit={handleSubmit} class="grid gap-4">
					<div class="flex flex-col md:flex-row gap-8">
						<div class="flex flex-col w-full gap-1.5">
							<Label for="firstName">First Name</Label>
							<Input
								id="firstName"
								type="text"
								placeholder="Leopoldo"
								bind:value={contactForm.firstName}
							/>
						</div>

						<div class="flex flex-col w-full gap-1.5">
							<Label for="lastName">Last Name</Label>
							<Input
								id="lastName"
								type="text"
								placeholder="Miranda"
								bind:value={contactForm.lastName}
							/>
						</div>
					</div>

					<div class="flex flex-col gap-1.5">
						<Label for="contactEmail">Email</Label>
						<Input
							id="contactEmail"
							type="email"
							placeholder="leomirandadev@gmail.com"
							bind:value={contactForm.email}
						/>
					</div>

					<div class="flex flex-col gap-1.5">
						<Label for="contactSubject">Subject</Label>
						<Input
							id="contactSubject"
							type="text"
							placeholder="Facing an issue?"
							bind:value={contactForm.email}
						/>
					</div>

					<div class="flex flex-col gap-1.5">
						<Label for="contactMessage">Message</Label>
						<Textarea
							id="contactMessage"
							placeholder="Your message..."
							rows={5}
							bind:value={contactForm.message}
						/>
					</div>

					{#if invalidInputForm}
						<Alert variant="destructive">
							<AlertCircle class="w-4 h-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>
								There is an error in the form. Please check your input.
							</AlertDescription>
						</Alert>
					{/if}

					<Button class="mt-4">Send message</Button>
				</form>
			</CardContent>
			<CardFooter />
		</Card>
	</section>
</section>

<section id="faq" class="container md:w-[700px] py-24 sm:py-32">
	<div class="text-center mb-8">
		<h2 class="text-lg text-primary text-center mb-2 tracking-wider">FAQS</h2>
		<h2 class="text-3xl md:text-4xl text-center font-bold">Common Questions</h2>
	</div>

	<Accordion type="single" class="w-full">
		{#each FAQList as { question, answer, value }}
			<AccordionItem {value}>
				<AccordionTrigger class="text-left">
					{question}
				</AccordionTrigger>
				<AccordionContent>
					{answer}
				</AccordionContent>
			</AccordionItem>
		{/each}
	</Accordion>

	<h3 class="font-medium mt-4">
		Still have questions?
		<a href="#contact" class="text-muted-foreground">
			<span class="underline">Contact us</span>
		</a>
	</h3>
</section>

<footer id="footer" class="container py-24 pb-16 sm:py-32 sm:pb-24">
	<div class="p-10 bg-muted/50 dark:bg-card border rounded-2xl">
		<div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
			<div class="col-span-full xl:col-span-2">
				<a href="/" class="flex font-bold items-center">
					<ChevronsDown
						class="bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white"
					/>
					<h3 class="text-2xl">PDF Daddy</h3>
				</a>
			</div>

			<div class="flex flex-col gap-2">
				<h3 class="font-bold text-lg">Contact</h3>
				<div><a href="https://github.com" class="opacity-60 hover:opacity-100">Github</a></div>
				<div><a href="https://twitter.com" class="opacity-60 hover:opacity-100">Twitter</a></div>
				<div>
					<a href="https://instagram.com" class="opacity-60 hover:opacity-100">Instagram</a>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<h3 class="font-bold text-lg">Platforms</h3>
				<div><span class="opacity-60 hover:opacity-100 cursor-default">iOS</span></div>
				<div><span class="opacity-60 hover:opacity-100 cursor-default">Android</span></div>
				<div><span class="opacity-60 hover:opacity-100 cursor-default">Web</span></div>
			</div>

			<div class="flex flex-col gap-2">
				<h3 class="font-bold text-lg">Help</h3>
				<div><a href="#contact" class="opacity-60 hover:opacity-100">Contact Us</a></div>
				<div><a href="#faq" class="opacity-60 hover:opacity-100">FAQ</a></div>
				<div><a href="#contact" class="opacity-60 hover:opacity-100">Feedback</a></div>
			</div>

			<div class="flex flex-col gap-2">
				<h3 class="font-bold text-lg">Socials</h3>
				<div><a href="https://twitch.tv" class="opacity-60 hover:opacity-100">Twitch</a></div>
				<div><a href="https://discord.com" class="opacity-60 hover:opacity-100">Discord</a></div>
				<div><a href="https://dribbble.com" class="opacity-60 hover:opacity-100">Dribbble</a></div>
			</div>
		</div>

		<Separator class="my-6" />

		<section>
			<h3>
				&copy; {new Date().getFullYear()} Designed and developed by
				<a
					target="_blank"
					href="https://github.com/yousefjalali"
					class="text-primary transition-all border-primary hover:border-b-2"
					rel="noreferrer"
				>
					Yousef Jalali
				</a>
			</h3>
		</section>
	</div>
</footer>

<style>
	.shadow-light {
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.085);
	}

	.shadow-dark {
		box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.141);
	}
</style>
