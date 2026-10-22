import { expect, it } from "vitest";
import { getResolvedTheme } from "./theme";

it("uses the system preference for auto mode", () => {
	expect(getResolvedTheme("auto", true)).toBe("dark");
	expect(getResolvedTheme("auto", false)).toBe("light");
});
