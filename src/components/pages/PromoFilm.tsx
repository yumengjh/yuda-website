import { useState } from "react";
import { siteConfig } from "../../config/site";

interface PromoFilmCopy {
	eyebrow: string;
	title: string;
	body: string;
	play: string;
	posterAlt: string;
	fallback: string;
}

// The film is large, so nothing is requested until the visitor presses play.
export function PromoFilm({ copy }: { copy: PromoFilmCopy }) {
	const [playing, setPlaying] = useState(false);

	return (
		<section className="film shell" id="film">
			<div className="film-head">
				<p className="eyebrow" data-reveal>
					{copy.eyebrow}
				</p>
				<h2 className="title" data-reveal>
					{copy.title}
				</h2>
				<p className="lead" data-reveal>
					{copy.body}
				</p>
			</div>
			<div className="film-frame" data-reveal>
				{playing ? (
					// biome-ignore lint/a11y/useMediaCaption: subtitles are burned into the picture
					<video
						className="film-video"
						src={siteConfig.promoVideoUrl}
						poster={siteConfig.promoPoster}
						controls
						autoPlay
						playsInline
						preload="auto"
					>
						{copy.fallback}
					</video>
				) : (
					<button
						type="button"
						className="film-poster"
						onClick={() => setPlaying(true)}
						aria-label={copy.play}
					>
						<img
							src={siteConfig.promoPoster}
							alt={copy.posterAlt}
							loading="lazy"
							width={1280}
							height={720}
						/>
						<span className="film-play" aria-hidden="true">
							<svg
								viewBox="0 0 24 24"
								width="28"
								height="28"
								fill="currentColor"
							>
								<title>{copy.play}</title>
								<path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
							</svg>
						</span>
					</button>
				)}
			</div>
		</section>
	);
}
