import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

import { Resvg } from "@resvg/resvg-js";
import { loadEnv } from "vite";

import { generateOg } from "./generate-og.mjs";

const defaultConfig = {
	description: "鱼搭：拍照入柜、自动整理、按天气与场景推荐今天穿什么的 AI 数字衣柜。",
	name: "鱼搭",
	ogImage: "/og-default.png",
	url: "https://example.com",
};

const routes = [
	"/",
	"/features",
	"/pricing",
	"/about",
	"/en",
	"/en/features",
	"/en/pricing",
	"/en/about",
];

const logo = readFileSync(new URL("./logo-256.png", import.meta.url)).toString("base64");

function getConfig() {
	const env = { ...loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "VITE_"), ...process.env };
	const url = new URL(env.VITE_SITE_URL?.trim() || defaultConfig.url);

	return {
		description: env.VITE_SITE_DESCRIPTION?.trim() || defaultConfig.description,
		name: env.VITE_SITE_NAME?.trim() || defaultConfig.name,
		ogImage: env.VITE_SITE_OG_IMAGE?.trim() || defaultConfig.ogImage,
		url: url.origin,
	};
}

function getOption(argumentsList, name, fallback) {
	const index = argumentsList.indexOf(name);
	return index === -1 ? fallback : argumentsList[index + 1] || fallback;
}

function iconSvg() {
	return `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect width="512" height="512" rx="112" fill="#f3f0e8"/><image x="56" y="92" width="400" height="309" xlink:href="data:image/png;base64,${logo}" href="data:image/png;base64,${logo}"/></svg>`;
}

function absoluteAssetPath(publicDirectory, assetPath) {
	if (!assetPath.startsWith("/")) return null;
	const target = resolve(publicDirectory, `.${assetPath}`);
	if (relative(publicDirectory, target).startsWith("..")) {
		throw new Error("VITE_SITE_OG_IMAGE must stay inside public/ when using a local path");
	}
	return target;
}

async function writeIcon(output, width) {
	await mkdir(dirname(output), { recursive: true });
	const renderer = new Resvg(iconSvg(), { fitTo: { mode: "width", value: width } });
	await writeFile(output, renderer.render().asPng());
}

export async function generateSiteAssets({ publicDirectory } = {}) {
	const config = getConfig();
	const targetDirectory = resolve(publicDirectory ?? "public");
	const sitemap = routes
		.map((path) => `  <url><loc>${new URL(path, `${config.url}/`).toString()}</loc></url>`)
		.join("\n");

	await mkdir(targetDirectory, { recursive: true });
	await Promise.all([
		writeFile(
			join(targetDirectory, "robots.txt"),
			`User-agent: *\nAllow: /\n\nSitemap: ${config.url}/sitemap.xml\n`,
		),
		writeFile(
			join(targetDirectory, "sitemap.xml"),
			`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`,
		),
		writeFile(
			join(targetDirectory, "site.webmanifest"),
			`${JSON.stringify(
				{
					name: config.name,
					short_name: config.name.slice(0, 24),
					icons: [
						{ src: "/icon-192.png", sizes: "192x192", type: "image/png" },
						{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
					],
					theme_color: "#0d0d0f",
					background_color: "#f3f0e8",
					display: "standalone",
				},
				null,
				2,
			)}\n`,
		),
		writeFile(join(targetDirectory, "favicon.svg"), iconSvg()),
		writeIcon(join(targetDirectory, "apple-touch-icon.png"), 180),
		writeIcon(join(targetDirectory, "icon-192.png"), 192),
		writeIcon(join(targetDirectory, "icon-512.png"), 512),
	]);

	const localOgImage = absoluteAssetPath(targetDirectory, config.ogImage);
	if (localOgImage) {
		// The OG renderer has no bundled CJK font, so the card text stays Latin.
		await generateOg({
			description: "An AI digital wardrobe: photo intake, auto cut-out, and outfits for today.",
			output: localOgImage,
			siteName: "Yuda",
			title: "Snap one. Keep one.",
			logo,
		});
	}

	return { config, publicDirectory: targetDirectory };
}

if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) {
	generateSiteAssets({
		publicDirectory: getOption(process.argv.slice(2), "--public-dir", "public"),
	})
		.then(({ publicDirectory }) => console.log(`Generated site assets in ${publicDirectory}`))
		.catch((error) => {
			console.error(error.message);
			process.exitCode = 1;
		});
}
