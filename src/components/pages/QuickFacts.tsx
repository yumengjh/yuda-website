interface QuickFactsCopy {
	eyebrow: string;
	title: string;
	items: { key: string; title: string; body: string }[];
	facts: string[];
}

/** The whole product in six lines, for visitors who skim: what it does, what it costs them, who it is for. */
export function QuickFacts({ copy }: { copy: QuickFactsCopy }) {
	return (
		<section className="quick shell" id="quick">
			<div className="quick-head">
				<p className="eyebrow" data-reveal>
					{copy.eyebrow}
				</p>
				<h2 className="quick-title" data-reveal>
					{copy.title}
				</h2>
			</div>
			<ol className="quick-grid">
				{copy.items.map((item) => (
					<li key={item.title} className="quick-item" data-reveal>
						<span className="quick-key" aria-hidden="true">
							{item.key}
						</span>
						<h3 className="quick-name">{item.title}</h3>
						<p className="quick-body">{item.body}</p>
					</li>
				))}
			</ol>
			<ul className="quick-facts">
				{copy.facts.map((fact) => (
					<li key={fact}>{fact}</li>
				))}
			</ul>
		</section>
	);
}
