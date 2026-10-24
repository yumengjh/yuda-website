import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { getSecurityHeaders } from "./src/lib/security.ts";

const config = defineConfig(({ mode }) => ({
	server: {
		allowedHosts: true,
	},
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		nitro({
			serverDir: "server",
			prerender: {
				crawlLinks: true,
				routes: [
					"/",
					"/en",
					"/features",
					"/en/features",
					"/pricing",
					"/en/pricing",
					"/about",
					"/en/about",
					"/sitemap.xml",
					"/robots.txt",
				],
			},
			routeRules: {
				"/**": {
					headers: getSecurityHeaders(mode === "production"),
				},
			},
			rollupConfig: { external: [/^@sentry\//] },
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
}));

export default config;
