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
