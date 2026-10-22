import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { Resvg } from "@resvg/resvg-js";

const defaults = {
	accent: "#1f5bff",
	background: "#0d0d0f",
	description: "An AI digital wardrobe for phone and desktop.",
	foreground: "#f3f0e8",
	logo: "",
	output: "public/og-default.png",
	siteName: "Yuda",
	title: "Snap one. Keep one.",
};

function escapeXml(value) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function wrapText(value, maxLength) {
	const words = value.split(/\s+/).filter(Boolean);
	const lines = [];
	let line = "";

	for (const word of words) {
		const candidate = line ? `${line} ${word}` : word;
		if (candidate.length > maxLength && line) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	}

	if (line) lines.push(line);
	return lines.slice(0, 2);
}

function textLines(lines, x, y, fontSize, lineHeight, fill, weight = 400) {
	return lines
		.map(
			(line, index) =>
				`<text x="${x}" y="${y + index * lineHeight}" fill="${fill}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="${weight}">${escapeXml(line)}</text>`,
		)
		.join("");
}

export function createOgSvg(options) {
	const config = { ...defaults, ...options };
	const title = wrapText(config.title, config.logo ? 16 : 28);
	const description = wrapText(config.description, config.logo ? 40 : 72);

	return `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect width="1200" height="630" fill="${escapeXml(config.background)}"/>
	<circle cx="1064" cy="96" r="238" fill="${escapeXml(config.accent)}" fill-opacity="0.13"/>
	<circle cx="1120" cy="576" r="300" fill="${escapeXml(config.accent)}" fill-opacity="0.08"/>
	${
		config.logo
			? `<image x="700" y="150" width="420" height="324" href="data:image/png;base64,${config.logo}"/>`
			: `<rect x="72" y="72" width="72" height="72" rx="20" fill="${escapeXml(config.accent)}"/>`
	}
	<text x="72" y="202" fill="${escapeXml(config.foreground)}" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="1.5">${escapeXml(config.siteName.toUpperCase())}</text>
	${textLines(title, 72, 322, 76, 88, config.foreground, 700)}
	${textLines(description, 72, 528, 30, 42, "#8f8b83")}
	</svg>`;
}

export async function generateOg(options = {}) {
	const config = { ...defaults, ...options };
	const output = resolve(config.output);
	const renderer = new Resvg(createOgSvg(config), {
		fitTo: { mode: "width", value: 1200 },
	});

	await mkdir(dirname(output), { recursive: true });
	await writeFile(output, renderer.render().asPng());
	return output;
}

function parseArguments(argumentsList) {
	const config = {};
	const aliases = {
		"site-name": "siteName",
	};

	for (let index = 0; index < argumentsList.length; index += 2) {
		const flag = argumentsList[index];
		const value = argumentsList[index + 1];
		if (!flag?.startsWith("--") || !value) {
			throw new Error(
				"Usage: node scripts/generate-og.mjs --title <title> [--description <description>] [--site-name <name>] [--accent <hex>] [--background <hex>] [--foreground <hex>] [--output <path>]",
			);
		}
		const key = aliases[flag.slice(2)] ?? flag.slice(2);
		if (!(key in defaults)) throw new Error(`Unknown option: ${flag}`);
		config[key] = value;
	}

	return config;
}

if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) {
	generateOg(parseArguments(process.argv.slice(2)))
		.then((output) => console.log(`Generated ${output}`))
		.catch((error) => {
			console.error(error.message);
			process.exitCode = 1;
		});
}
