import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
	gsap.registerPlugin(
		useGSAP,
		ScrollTrigger,
		SplitText,
		Draggable,
		InertiaPlugin,
	);
	gsap.defaults({ ease: "expo.out", duration: 1 });
}

export const EASE_IN_OUT = "expo.inOut";

export function prefersReducedMotion() {
	return (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

export { Draggable, gsap, ScrollTrigger, SplitText, useGSAP };
