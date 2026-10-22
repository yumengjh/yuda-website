import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const temporaryDirectories: string[] = [];

afterEach(async () => {
	await Promise.all(
		temporaryDirectories.splice(0).map((directory) => rm(directory, { force: true, recursive: true })),
	);
});

describe("generate-site-assets script", () => {
	it("writes configurable crawler, manifest, icon, and OG assets", async () => {
		const publicDirectory = await mkdtemp(join(tmpdir(), "tanstack-public-"));
		temporaryDirectories.push(publicDirectory);

		await execFileAsync(
			process.execPath,
			["scripts/generate-site-assets.mjs", "--public-dir", publicDirectory],
			{
				env: {
					...process.env,
					VITE_SITE_NAME: "Acme Starter",
					VITE_SITE_URL: "https://acme.example",
					VITE_SITE_OG_IMAGE: "/social/acme.png",
				},
			},
		);

		expect(await readFile(join(publicDirectory, "robots.txt"), "utf8")).toContain(
			"Sitemap: https://acme.example/sitemap.xml",
		);
		expect(await readFile(join(publicDirectory, "sitemap.xml"), "utf8")).toContain(
			"https://acme.example/en/features",
		);
		expect(JSON.parse(await readFile(join(publicDirectory, "site.webmanifest"), "utf8"))).toMatchObject({
			name: "Acme Starter",
		});
		expect((await readFile(join(publicDirectory, "social", "acme.png"))).subarray(0, 8)).toEqual(
			Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
		);
	}, 15_000);
});
