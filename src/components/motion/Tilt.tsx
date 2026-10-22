import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

/** A card that leans towards the pointer and carries a soft glare under it. */
export function Tilt({
	children,
	className = "",
	max = 8,
}: {
	children: ReactNode;
	className?: string;
	max?: number;
}) {
	const root = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const element = root.current;
		if (!element || !window.matchMedia("(pointer: fine)").matches) return;
		const rx = gsap.quickTo(element, "rotationX", {
			duration: 0.6,
			ease: "power3",
		});
		const ry = gsap.quickTo(element, "rotationY", {
			duration: 0.6,
			ease: "power3",
		});
		const move = (event: PointerEvent) => {
			const box = element.getBoundingClientRect();
			const px = (event.clientX - box.left) / box.width;
			const py = (event.clientY - box.top) / box.height;
			rx((0.5 - py) * max * 2);
			ry((px - 0.5) * max * 2);
			element.style.setProperty("--glare-x", `${px * 100}%`);
			element.style.setProperty("--glare-y", `${py * 100}%`);
		};
		const leave = () => {
			rx(0);
			ry(0);
		};
		gsap.set(element, { transformPerspective: 900 });
		element.addEventListener("pointermove", move);
		element.addEventListener("pointerleave", leave);
		return () => {
			element.removeEventListener("pointermove", move);
			element.removeEventListener("pointerleave", leave);
		};
	}, [max]);
	return (
		<div ref={root} className={`tilt ${className}`}>
			{children}
		</div>
	);
}
