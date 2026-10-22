/**
 * Page entrance animations wait until nothing covers the page: the first-load intro
 * and the route transition curtain each hold the gate while they are on screen.
 */
type Listener = () => void;

let holds = 1; // The intro holds the gate from the first client render.
let listeners: Listener[] = [];

export function holdReveal() {
	holds += 1;
}

export function releaseReveal() {
	holds = Math.max(0, holds - 1);
	if (holds > 0) return;
	const queued = listeners;
	listeners = [];
	for (const listener of queued) listener();
}

/** Runs `listener` once the page is visible; returns a cancel function. */
export function onReveal(listener: Listener) {
	if (holds === 0) {
		const frame = window.requestAnimationFrame(listener);
		return () => window.cancelAnimationFrame(frame);
	}
	listeners.push(listener);
	return () => {
		listeners = listeners.filter((item) => item !== listener);
	};
}
