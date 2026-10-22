export type ThemeMode = "light" | "dark" | "auto";

export function getResolvedTheme(mode: ThemeMode, prefersDark: boolean) {
	return mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
}
