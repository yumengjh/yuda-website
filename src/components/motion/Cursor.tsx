import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

/**
 * A ring that trails the pointer on fine-pointer devices. Elements with `data-cursor`
 * enlarge it and show their label; the system cursor stays visible for precision.
 */
export function Cursor() {
	const ring = useRef<HTMLDivElement>(null);
	const label = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const element = ring.current;
		if (!element || !window.matchMedia("(pointer: fine)").matches) return;
		const xTo = gsap.quickTo(element, "x", { duration: 0.5, ease: "power3" });
		const yTo = gsap.quickTo(element, "y", { duration: 0.5, ease: "power3" });
		let active: Element | null = null;

		const move = (event: PointerEvent) => {
			xTo(event.clientX);
			yTo(event.clientY);
			element.dataset.visible = "true";
			const target =
				(event.target as Element | null)?.closest("[data-cursor], a, button") ??
				null;
			if (target === active) return;
			active = target;
			const text = target?.getAttribute("data-cursor") ?? "";
			if (label.current) label.current.textContent = text;
			element.dataset.state = target ? (text ? "label" : "hover") : "idle";
		};
		const leave = () => {
			element.dataset.visible = "false";
		};
		const down = () => gsap.to(element, { scale: 0.8, duration: 0.2 });
		const up = () => gsap.to(element, { scale: 1, duration: 0.4 });

		window.addEventListener("pointermove", move, { passive: true });
		document.documentElement.addEventListener("pointerleave", leave);
		window.addEventListener("pointerdown", down);
		window.addEventListener("pointerup", up);
		return () => {
			window.removeEventListener("pointermove", move);
			document.documentElement.removeEventListener("pointerleave", leave);
			window.removeEventListener("pointerdown", down);
			window.removeEventListener("pointerup", up);
		};
	}, []);

	return (
		<div
			ref={ring}
			className="cursor"
			data-state="idle"
			data-visible="false"
			aria-hidden="true"
		>
			<span className="cursor-ring" />
			<span ref={label} className="cursor-label" />
		</div>
	);
}
