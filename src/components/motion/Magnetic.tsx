import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

/** Pulls its child towards the pointer while hovered and springs back on leave. */
export function Magnetic({
	children,
	strength = 0.35,
	className = "",
}: {
	children: ReactNode;
	strength?: number;
	className?: string;
}) {
	const root = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const element = root.current;
		if (!element || !window.matchMedia("(pointer: fine)").matches) return;
		const inner = element.firstElementChild as HTMLElement | null;
		const xTo = gsap.quickTo(element, "x", {
			duration: 0.8,
			ease: "elastic.out(1, 0.4)",
		});
		const yTo = gsap.quickTo(element, "y", {
			duration: 0.8,
			ease: "elastic.out(1, 0.4)",
		});
		const move = (event: PointerEvent) => {
			const box = element.getBoundingClientRect();
			const dx = event.clientX - (box.left + box.width / 2);
			const dy = event.clientY - (box.top + box.height / 2);
			xTo(dx * strength);
			yTo(dy * strength);
			if (inner)
				gsap.to(inner, {
					x: dx * strength * 0.4,
					y: dy * strength * 0.4,
					duration: 0.6,
				});
		};
		const leave = () => {
			xTo(0);
			yTo(0);
			if (inner)
				gsap.to(inner, {
					x: 0,
					y: 0,
					duration: 0.8,
					ease: "elastic.out(1, 0.4)",
				});
		};
		element.addEventListener("pointermove", move);
		element.addEventListener("pointerleave", leave);
		return () => {
			element.removeEventListener("pointermove", move);
			element.removeEventListener("pointerleave", leave);
		};
	}, [strength]);

	return (
		<span ref={root} className={`magnetic ${className}`}>
			{children}
		</span>
	);
}
