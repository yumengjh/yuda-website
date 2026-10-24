import { type RefObject, useEffect, useState } from "react";

/**
 * Makes a horizontally scrollable element feel like a carousel: mouse dragging,
 * a 0..1 progress value, and a flag that flips once the visitor has scrolled.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
	const [progress, setProgress] = useState(0);
	const [moved, setMoved] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		let startX = 0;
		let startScroll = 0;
		let dragging = false;
		let travelled = 0;

		const onScroll = () => {
			const range = element.scrollWidth - element.clientWidth;
			setProgress(range > 0 ? element.scrollLeft / range : 0);
			if (element.scrollLeft > 8) setMoved(true);
		};
		const onDown = (event: PointerEvent) => {
			if (event.pointerType !== "mouse" || event.button !== 0) return;
			dragging = true;
			travelled = 0;
			startX = event.clientX;
			startScroll = element.scrollLeft;
		};
		const onMove = (event: PointerEvent) => {
			if (!dragging) return;
			travelled = Math.abs(event.clientX - startX);
			if (travelled > 4) {
				element.classList.add("is-dragging");
				element.scrollLeft = startScroll - (event.clientX - startX);
			}
		};
		const onUp = () => {
			dragging = false;
			element.classList.remove("is-dragging");
		};
		// A drag must not count as a click on the card underneath.
		const onClick = (event: MouseEvent) => {
			if (travelled > 4) {
				event.preventDefault();
				event.stopPropagation();
				travelled = 0;
			}
		};

		onScroll();
		element.addEventListener("scroll", onScroll, { passive: true });
		element.addEventListener("pointerdown", onDown);
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		element.addEventListener("click", onClick, true);
		return () => {
			element.removeEventListener("scroll", onScroll);
			element.removeEventListener("pointerdown", onDown);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			element.removeEventListener("click", onClick, true);
		};
	}, [ref]);

	return { progress, moved };
}
