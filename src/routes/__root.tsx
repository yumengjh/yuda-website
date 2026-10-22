import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { LocaleProvider } from "../components/LocaleProvider";
import { Cursor } from "../components/motion/Cursor";
import { Intro } from "../components/motion/Intro";
import { PageTransitionProvider } from "../components/motion/PageTransition";
import { SmoothScroll } from "../components/motion/SmoothScroll";
import { NavigationProgress } from "../components/NavigationProgress";
import { NotFoundPage } from "../components/NotFoundPage";
import { appNavigationProgress } from "../config/app-navigation-progress";
import { siteConfig } from "../config/site";
import { localeFromPathname } from "../i18n/routing";

import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
			},
			{
				title: siteConfig.name,
			},
			{
				name: "robots",
				content: "noindex, nofollow",
			},
			{
				name: "theme-color",
				content: "#0d0d0f",
			},
		],
		links: [
			{
				rel: "preload",
				href: "/yuda-logo-720.webp",
				as: "image",
				type: "image/webp",
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml",
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "manifest",
				href: "/site.webmanifest",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: NotFoundPage,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const locale = localeFromPathname(pathname);

	return (
		<html lang={locale === "zh" ? "zh-CN" : "en"} suppressHydrationWarning>
			<head>
				<script>{THEME_INIT_SCRIPT}</script>
				<HeadContent />
			</head>
			<body className="font-sans antialiased">
				{appNavigationProgress.enabled ? (
					<NavigationProgress delayMs={appNavigationProgress.delayMs} />
				) : null}
				<SmoothScroll>
					<LocaleProvider locale={locale}>
						<PageTransitionProvider>
							<Header />
							{children}
							<Footer />
						</PageTransitionProvider>
						<Intro />
					</LocaleProvider>
				</SmoothScroll>
				<Cursor />
				<div className="grain" aria-hidden="true" />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
