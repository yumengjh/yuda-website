import { describe, expect, it } from "vitest";
import { localeFromPathname, localizePath } from "./routing";

describe("locale routing", () => {
	it("uses Chinese without a prefix", () => {
		expect(localeFromPathname("/features")).toBe("zh");
		expect(localizePath("/features", "zh")).toBe("/features");
	});

	it("uses an /en prefix for English", () => {
		expect(localeFromPathname("/en/demo")).toBe("en");
		expect(localizePath("/demo", "en")).toBe("/en/demo");
	});
});
