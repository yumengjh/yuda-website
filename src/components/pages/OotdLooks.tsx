interface OotdLooksCopy {
	eyebrow: string;
	title: string;
	body: string;
	note: string;
	items: { src: string; label: string; who: string }[];
}

/** A scroll-snap row of generated try-on previews: young women, young men and mature men. */
export function OotdLooks({ copy }: { copy: OotdLooksCopy }) {
	return (
		<section className="looks" id="looks">
			<div className="looks-head shell">
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
			<ul className="looks-track" data-reveal>
				{copy.items.map((item) => (
					<li key={item.src} className="look">
						<img
							src={item.src}
							alt={`${item.who}：${item.label}`}
							loading="lazy"
							width={640}
							height={960}
						/>
						<p className="look-who">{item.who}</p>
						<p className="look-label">{item.label}</p>
					</li>
				))}
			</ul>
			<p className="looks-note shell">{copy.note}</p>
		</section>
	);
}
