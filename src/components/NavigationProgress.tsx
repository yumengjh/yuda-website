import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const INITIAL_PROGRESS = 10;
const MAX_PROGRESS = 90;
const PROGRESS_TIME_CONSTANT_MS = 2800;

type NavigationProgressProps = {
	delayMs: number;
};

type ProgressState = {
	progress: number;
	visible: boolean;
};

export function NavigationProgress({ delayMs }: NavigationProgressProps) {
	const isLoading = useRouterState({
		select: (state) => state.isLoading,
	});
	const [state, setState] = useState<ProgressState>({
		progress: 0,
		visible: false,
	});

	useEffect(() => {
		if (isLoading) {
			let frame = 0;
			const start = () => {
				setState({ progress: INITIAL_PROGRESS, visible: true });
				const startedAt = window.performance.now();
				const advance = (now: number) => {
					const elapsed = now - startedAt;
					const progress =
						MAX_PROGRESS -
						(MAX_PROGRESS - INITIAL_PROGRESS) *
							Math.exp(-elapsed / PROGRESS_TIME_CONSTANT_MS);

					setState({ progress, visible: true });
					frame = window.requestAnimationFrame(advance);
				};

				frame = window.requestAnimationFrame(advance);
			};
			const delay = window.setTimeout(start, delayMs);

			return () => {
				window.clearTimeout(delay);
				window.cancelAnimationFrame(frame);
			};
		}

		setState((current) =>
			current.visible ? { progress: 100, visible: true } : current,
		);
		const completionTimeout = window.setTimeout(() => {
			setState({ progress: 0, visible: false });
		}, 220);

		return () => window.clearTimeout(completionTimeout);
	}, [delayMs, isLoading]);

	return (
		<div
			id="page-navigation-progress"
			className="page-navigation-progress"
			data-active={isLoading}
			data-visible={state.visible}
			aria-hidden="true"
		>
			<span
				className="page-navigation-progress__bar"
				style={{ transform: `scaleX(${state.progress / 100})` }}
			/>
		</div>
	);
}
