import type { Messages } from "./zh";

export const en: Messages = {
	app: {
		brand: "Yuda",
		nav: {
			home: "Home",
			features: "Features",
			pricing: "Pricing",
			about: "About",
			menu: "Open menu",
			close: "Close menu",
		},
		cta: "Open Yuda",
		skip: "Skip to content",
		switchLocale: "中文",
		theme: {
			auto: "Auto",
			light: "Light",
			dark: "Dark",
			label: "Theme: {{mode}}. Click to change the theme.",
		},
		footer: {
			slogan: "Snap one, keep one, wear the set.",
			explore: "Explore",
			product: "Product",
			openApp: "Open the web app",
			install: "Add to home screen",
			rights: "All rights reserved.",
			privacy: "Privacy",
			terms: "Terms",
			backTop: "Back to top",
		},
		backHome: "Back to home",
	},
	intro: {
		tagline: "Digital Wardrobe · 数字衣柜",
		loading: "Opening your wardrobe",
	},
	home: {
		hero: {
			eyebrow: "AI digital wardrobe",
			lines: ["Snap one.", "Keep one."],
			sub: "Yuda turns casual photos into clean garment stickers, then puts together today's outfit for the weather and the occasion.",
			primary: "Open Yuda",
			secondary: "See how it works",
			scroll: "Scroll",
			flow: "Snap → Sort → Keep → Wear",
			badge: "Phone · Desktop · PWA",
		},
		marquee: [
			"Photo intake",
			"Background removal",
			"Category & colour",
			"What to wear today",
			"Multi-board styling",
			"Assistant",
			"OOTD try-on",
		],
		manifesto:
			"The more clothes you own, the less you seem to wear. Yuda first shows you what you actually have, then picks today's outfit from it — no guessing, and every look comes with its reasons.",
		looks: {
			eyebrow: "OOTD try-on",
			title: "See it on a body before you decide.",
			body: "Young women, young men and mature men — from cute to office-ready, every outfit in a wardrobe can become a try-on preview.",
			note: "All people shown are AI-generated virtual models; the clothes come from a real wardrobe.",
			items: [
				{
					src: "/ootd/c02.webp",
					label: "Blue polka-dot dress",
					who: "Young woman",
				},
				{
					src: "/ootd/c03.webp",
					label: "Sailor top and pleated skirt",
					who: "Young woman",
				},
				{
					src: "/ootd/c04.webp",
					label: "Pink lace sailor top",
					who: "Young woman",
				},
				{
					src: "/ootd/f01.webp",
					label: "White tee and jeans",
					who: "Young woman",
				},
				{
					src: "/ootd/f02.webp",
					label: "Varsity jacket and jeans",
					who: "Young woman",
				},
				{ src: "/ootd/f06.webp", label: "Track set", who: "Young woman" },
				{
					src: "/ootd/y05.webp",
					label: "Varsity hoodie and cargo pants",
					who: "Young man",
				},
				{
					src: "/ootd/y06.webp",
					label: "Leather jacket and washed jeans",
					who: "Young man",
				},
				{
					src: "/ootd/y07.webp",
					label: "Black tee and cargo pants",
					who: "Young man",
				},
				{
					src: "/ootd/m02.webp",
					label: "White shirt and black trousers",
					who: "Mature man",
				},
				{
					src: "/ootd/m03.webp",
					label: "Light-blue shirt and beige trousers",
					who: "Mature man",
				},
				{
					src: "/ootd/m04.webp",
					label: "Leather jacket and jeans",
					who: "Mature man",
				},
			],
		},
		film: {
			eyebrow: "Promo film",
			title: "Two minutes to see how Yuda works.",
			body: "From snapping a photo to today's outfit to a try-on preview, in one film.",
			play: "Play the promo film",
			posterAlt:
				"Yuda promo film cover: the Yuda logo and the tagline Collect, Match, Try on",
			fallback: "Your browser does not support video playback.",
		},
		process: {
			eyebrow: "How it works",
			title: "From a single photo to a full outfit.",
			steps: [
				{
					tag: "Quick intake",
					title: "Snap one, keep one",
					body: "Shoot in a burst without waiting. Yuda cuts out each garment, recognises its category and colour, and turns it into a sticker for you to confirm.",
					image: "/shots/quick-intake.jpg",
				},
				{
					tag: "Wardrobe",
					title: "See everything you own",
					body: "Filter by exact colour, search with a sentence or a photo. Similar items are flagged: you might already have this one.",
					image: "/shots/wardrobe.jpg",
				},
				{
					tag: "Today",
					title: "Today, already styled",
					body: "Full outfits based on weather, occasion and taste. Swap the set or a single piece — your feedback keeps teaching it.",
					image: "/shots/today-outfits.jpg",
				},
				{
					tag: "Boards",
					title: "Style it by hand",
					body: "Drag stickers onto boards: multiple boards, layers, transforms, export. Save the looks you like and wear them any day.",
					image: "/shots/workspace.jpg",
				},
			],
		},
		expand: {
			eyebrow: "Reasons",
			title: "Every outfit explains itself.",
			body: "Season, style, formality, the pieces you love and the ones you avoid — each score is listed. When something is uncertain, it says so: “No temperature given, assuming autumn from the date.”",
			headline: { label: "Pick #1", score: 100, unit: "pts" },
			hint: "Keep scrolling",
			chips: [
				"Style = commute / formal ✓",
				"Formality suits the office",
				"No temperature given, assuming autumn",
			],
		},
		reel: {
			eyebrow: "A day of picks",
			title: "Several outfits at once, each with its reasons.",
			hint: "Swipe sideways for more",
			items: [
				"Blue + black · commute · 100 pts",
				"White + black · commute · 100 pts",
				"White + denim blue · casual · 100 pts",
				"Black + grey · casual · 100 pts",
				"Beige + denim blue · casual · 92 pts",
				"Grey · casual · 100 pts",
				"Black + brown · casual · 100 pts",
			],
		},
		lab: {
			eyebrow: "Try it",
			title: "This is how the board feels.",
			body: "Drag the stickers below and put a look together. The real board adds layers, scaling, rotation and export, using stickers from your own wardrobe.",
			shuffle: "Shuffle",
			reset: "Tidy up",
			hint: "Drag a sticker",
			boardLabel: "Demo board with draggable garment stickers",
			drag: "Drag",
		},
		mobile: {
			eyebrow: "Mobile",
			title: "Phone and desktop, equally first-class.",
			body: "Bottom navigation, swipe paging, bottom sheets, and touch targets of at least 44px. Add it to your home screen and it opens like an app.",
		},
		promise: {
			eyebrow: "Our promise",
			title: "Reliable beats clever.",
			items: [
				{
					title: "Paid calls are your call",
					body: "Anything that uses a paid model runs only when you submit it, and is never replayed on refresh.",
				},
				{
					title: "Every pause has a next step",
					body: "If credits run out or a job fails, finished work is kept and you are told why and what to do next.",
				},
				{
					title: "Results and status, kept apart",
					body: "Image results, progress and wardrobe status are shown separately. No fake “done” states.",
				},
				{
					title: "Your input is never overwritten",
					body: "What you type is saved. When something conflicts, you review it instead of losing it silently.",
				},
			],
		},
		cta: {
			eyebrow: "Start now",
			title: "What to wear today?",
			sub: "Ask Yuda.",
			button: "Open Yuda",
			note: "Currently invite-only beta. Sign up with an invitation code.",
		},
	},
	features: {
		hero: {
			eyebrow: "Features",
			lines: ["Six modules.", "One wardrobe."],
			sub: "From intake to heading out the door, every step is laid out clearly: you can see what Yuda is doing and take over at any time.",
		},
		modules: [
			{
				tag: "01",
				title: "Quick intake",
				body: "Single items, several in one shot, or a selfie. Once submitted you can leave, refresh, and pick up where you left off.",
				points: [
					"Burst upload without waiting",
					"Background cut-out and recognition in one task centre",
					"Failures keep the photo so you can fill details by hand",
				],
				image: "/shots/quick-intake.jpg",
			},
			{
				tag: "02",
				title: "Wardrobe",
				body: "Everything you own, sorted by recent updates and pageable by keyboard or swipe.",
				points: [
					"Exact colour filters",
					"Semantic and image search",
					"Similar-item hints and a recycle bin",
				],
				image: "/shots/wardrobe.jpg",
			},
			{
				tag: "03",
				title: "What to wear today",
				body: "Complete outfits by weather and style, each with its reasons. Refresh the set or swap one piece.",
				points: [
					"Occasion, temperature, colours to avoid",
					"Scores and reasons for every pick",
					"Likes and dislikes fade back over time",
				],
				image: "/shots/today-outfits.jpg",
			},
			{
				tag: "04",
				title: "Styling boards",
				body: "Style like laying clothes on a table: drop in stickers, arrange the layers, export an image.",
				points: [
					"Multiple boards side by side",
					"Layers, scaling, rotation",
					"Assistant suggestions land on a scratch board",
				],
				image: "/shots/workspace.jpg",
			},
			{
				tag: "05",
				title: "Assistant",
				body: "Summon it from any page to tidy up, find a garment or ask for advice in plain words.",
				points: [
					"Overlays on the right without shifting the layout",
					"Streaming replies, pin or drag the panel",
					"Actions confirmed by browser receipts",
				],
				image: "/shots/assistant.jpg",
			},
			{
				tag: "06",
				title: "Style profile",
				body: "Every preference behind a recommendation comes from your feedback and wear history — visible and editable.",
				points: [
					"Restore cooled-down items in one tap",
					"Correct anything marked inaccurate",
					"Rule-based statistics, no large model",
				],
				image: "/shots/style-profile.jpg",
			},
		],
		tech: {
			eyebrow: "Under the hood",
			title: "Smart where it matters.",
			items: [
				{
					title: "Local image processing",
					body: "Cut-out and basic recognition run locally on the server; paid models are used only when needed.",
				},
				{
					title: "Vector search",
					body: "Search your wardrobe with a sentence or a photo, with similar pieces grouped automatically.",
				},
				{
					title: "Explainable picks",
					body: "The recommendation engine scores by rules, and shows where every point comes from.",
				},
			],
		},
		cta: {
			title: "Found the plan for you?",
			button: "See pricing",
		},
	},
	pricing: {
		hero: {
			eyebrow: "Pricing",
			lines: ["Pick a plan", "that fits your closet."],
			sub: "Everything is free during the beta. The plans and prices below are provisional and may change before launch.",
		},
		billing: {
			monthly: "Monthly",
			yearly: "Yearly",
			save: "2 months free",
			perMonth: "/ mo",
			perYear: "/ yr",
			billedYearly: "Billed yearly",
			free: "Free",
		},
		draft: "Draft",
		plans: [
			{
				name: "Starter",
				tagline: "Bring in the pieces you wear most.",
				monthly: 0,
				yearly: 0,
				cta: "Start free",
				features: [
					"Up to 100 items",
					"30 AI tasks per month",
					"What to wear today",
					"One styling board",
				],
			},
			{
				name: "Plus",
				tagline: "Move the whole wardrobe in.",
				monthly: 18,
				yearly: 180,
				cta: "Choose Plus",
				badge: "Popular",
				features: [
					"Unlimited items",
					"300 AI tasks per month",
					"Semantic and image search",
					"Multiple styling boards",
					"Assistant",
				],
			},
			{
				name: "Curator",
				tagline: "For people who take outfits seriously.",
				monthly: 38,
				yearly: 380,
				cta: "Choose Curator",
				features: [
					"Everything in Plus",
					"1000 AI tasks per month",
					"Personal OOTD try-on",
					"Models, poses and body tuning",
					"Priority processing queue",
				],
			},
		],
		compare: {
			title: "Compare plans",
			feature: "Feature",
			rows: [
				{ label: "Items", values: ["100", "Unlimited", "Unlimited"] },
				{ label: "AI tasks / month", values: ["30", "300", "1000"] },
				{ label: "What to wear today", values: ["✓", "✓", "✓"] },
				{ label: "Semantic & image search", values: ["—", "✓", "✓"] },
				{ label: "Styling boards", values: ["1", "Unlimited", "Unlimited"] },
				{ label: "Assistant", values: ["—", "✓", "✓"] },
				{ label: "Personal OOTD try-on", values: ["—", "—", "✓"] },
				{ label: "Priority queue", values: ["—", "—", "✓"] },
			],
		},
		faq: {
			title: "Questions",
			items: [
				{
					q: "Do I need to pay now?",
					a: "No. Yuda is an invite-only beta: sign up with an invitation code and every feature is free.",
				},
				{
					q: "What happens when AI tasks run out?",
					a: "Finished cut-outs and recognition results are kept and unprocessed photos stay safe. You can fill in details by hand or continue next cycle.",
				},
				{
					q: "If I downgrade, are extra items deleted?",
					a: "No. Items beyond the limit stay viewable and usable; you just can't add new ones for now.",
				},
				{
					q: "When will final prices be set?",
					a: "They will be announced ahead of launch, and beta users will be notified. The plans here are for reference only.",
				},
			],
		},
	},
	about: {
		hero: {
			eyebrow: "About Yuda",
			lines: ["A fish that", "tidies your closet."],
			sub: "Yuda is an independently built digital wardrobe. The goal is simple: know what you own, and decide what to wear with less effort.",
		},
		story:
			"Most wardrobes don't lack clothes — they lack visibility. The one buried at the bottom, the one bought last year and never worn, the one nearly identical to what you just bought. Yuda finds them one by one, turns them into stickers in front of you, and styles the rest together with you.",
		values: [
			{
				word: "清晰",
				latin: "Clear",
				body: "Results, status and next steps, each spelled out.",
			},
			{
				word: "克制",
				latin: "Restrained",
				body: "Shows up when needed and stays out of your way.",
			},
			{
				word: "可靠",
				latin: "Reliable",
				body: "No fake completion, no silent retries, no lost work.",
			},
		],
		refuse: {
			eyebrow: "What we won't do",
			title: "Some shortcuts we choose not to take.",
			items: [
				"Pass placeholder art off as model results",
				"Fake a “done” state with timers",
				"Throw away your work when credits run out",
				"Replay paid requests automatically",
				"Say “paused” without a next step",
			],
		},
		cta: {
			title: "Come meet your wardrobe.",
			button: "Open Yuda",
		},
	},
	notFound: {
		title: "This piece isn't in the wardrobe",
		description: "The page may have moved, or the link is wrong.",
	},
	seo: {
		home: {
			title: "AI Digital Wardrobe",
			description:
				"Yuda: photo intake, automatic cut-out and recognition, and outfit picks for the weather and occasion — a digital wardrobe for phone and desktop.",
			keywords:
				"Yuda, digital wardrobe, AI outfits, what to wear, closet organiser",
		},
		features: {
			title: "Features",
			description:
				"Quick intake, wardrobe, today's picks, styling boards, assistant and style profile: the six modules of Yuda.",
			keywords:
				"Yuda features, outfit recommendation, styling board, AI assistant",
		},
		pricing: {
			title: "Pricing",
			description: "Yuda plans and pricing (provisional during the beta).",
			keywords: "Yuda pricing, wardrobe app pricing",
		},
		about: {
			title: "About",
			description:
				"Yuda is an independently built digital wardrobe: clear, restrained, reliable.",
			keywords: "about Yuda, brand values",
		},
	},
};
