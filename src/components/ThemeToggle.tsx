import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getResolvedTheme, type ThemeMode } from "../lib/theme";

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") return "auto";
	const stored = window.localStorage.getItem("theme");
	return stored === "light" || stored === "dark" || stored === "auto"
		? stored
		: "auto";
}

function applyThemeMode(mode: ThemeMode) {
	const resolved = getResolvedTheme(
		mode,
		window.matchMedia("(prefers-color-scheme: dark)").matches,
	);
	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolved);
	if (mode === "auto") document.documentElement.removeAttribute("data-theme");
	else document.documentElement.setAttribute("data-theme", mode);
	document.documentElement.style.colorScheme = resolved;
}

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("auto");
	const { t } = useTranslation();
	useEffect(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		applyThemeMode(initialMode);
	}, []);
	useEffect(() => {
		const sync = (event: Event) =>
			setMode((event as CustomEvent<ThemeMode>).detail);
		window.addEventListener("themechange", sync);
		return () => window.removeEventListener("themechange", sync);
	}, []);
	useEffect(() => {
		if (mode !== "auto") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeMode("auto");
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, [mode]);
	function toggleMode() {
		const nextMode: ThemeMode =
			mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
		setMode(nextMode);
		applyThemeMode(nextMode);
		window.localStorage.setItem("theme", nextMode);
		window.dispatchEvent(new CustomEvent("themechange", { detail: nextMode }));
	}
	const label = t("app.theme.label", { mode: t(`app.theme.${mode}`) });
	return (
		<button
			type="button"
			onClick={toggleMode}
			aria-label={label}
			title={label}
			className="pill-toggle"
		>
			<span className="theme-dot" data-mode={mode} aria-hidden="true" />
			<span>{t(`app.theme.${mode}`)}</span>
		</button>
	);
}
