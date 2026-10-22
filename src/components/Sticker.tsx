import type { CSSProperties } from "react";

/**
 * Garment stickers drawn in the logo's style: cream, electric blue and lilac fills
 * with an ink outline, plus the white die-cut edge the product gives every item.
 */
type Part = {
	d: string;
	fill?: string;
	/** Stroke-only parts such as straps and stitching. */
	line?: number;
	dash?: string;
	color?: string;
};

const CREAM = "var(--c-cream)";
const BLUE = "#1f5bff";
const DEEP = "#1440c4";
const LILAC = "#d7b6ff";
const INK = "#0d0d0f";
const WHITE = "#fff";

export const stickers = {
	tee: [
		{
			d: "M62 40 L88 30 Q100 46 112 30 L138 40 L172 66 L154 94 L140 86 L140 168 Q100 178 60 168 L60 86 L46 94 L28 66 Z",
			fill: CREAM,
		},
		{ d: "M88 30 Q100 54 112 30", line: 5 },
		{ d: "M112 98 H134 V118 Q123 126 112 118 Z", fill: BLUE },
		{ d: "M66 150 Q100 158 134 150", line: 3, dash: "6 7", color: BLUE },
	],
	jeans: [
		{ d: "M58 26 H142 L152 176 H110 L100 88 L90 176 H48 Z", fill: BLUE },
		{ d: "M58 26 H142 V46 H58 Z", fill: DEEP },
		{ d: "M100 46 V88", line: 3, dash: "6 6", color: WHITE },
		{ d: "M66 52 Q72 74 92 70", line: 3, dash: "5 6", color: WHITE },
		{ d: "M134 52 Q128 74 108 70", line: 3, dash: "5 6", color: WHITE },
		{ d: "M56 160 H90 M110 160 H148", line: 3, dash: "5 6", color: WHITE },
	],
	cap: [
		{ d: "M46 116 Q46 50 104 46 Q160 50 160 116 Z", fill: BLUE },
		{ d: "M80 116 Q82 62 104 48 Q126 62 128 116 Z", fill: CREAM },
		{
			d: "M36 116 Q104 98 184 118 Q182 138 152 136 Q104 126 40 132 Z",
			fill: CREAM,
		},
		{ d: "M96 40 Q104 30 112 40 Z", fill: CREAM },
		{ d: "M92 80 Q100 70 112 78 Q108 92 94 90 Z", fill: BLUE },
	],
	sneaker: [
		{ d: "M20 138 Q16 164 42 164 L174 164 Q192 162 188 138 Z", fill: WHITE },
		{
			d: "M28 140 Q30 96 62 90 L92 80 Q108 104 140 108 Q180 114 186 140 Z",
			fill: CREAM,
		},
		{ d: "M66 128 Q108 104 156 124 Q116 122 74 140 Z", fill: LILAC },
		{ d: "M92 90 L104 84 M98 100 L112 92 M106 108 L120 100", line: 4 },
		{ d: "M26 152 H186", line: 3, dash: "6 7", color: BLUE },
	],
	jacket: [
		{
			d: "M70 32 L100 46 L130 32 L152 44 L152 172 L48 172 L48 44 Z",
			fill: LILAC,
		},
		{ d: "M48 44 L24 70 L18 162 L44 164 L50 96 Z", fill: CREAM },
		{ d: "M152 44 L176 70 L182 162 L156 164 L150 96 Z", fill: CREAM },
		{ d: "M70 32 L100 80 L130 32", line: 5 },
		{ d: "M100 80 V172", line: 4 },
		{ d: "M48 160 H152", line: 6, color: BLUE },
		{ d: "M66 98 Q74 92 82 98 Q78 110 66 108 Z", fill: BLUE },
	],
	skirt: [
		{ d: "M72 44 H128 L164 158 Q100 174 36 158 Z", fill: CREAM },
		{ d: "M72 44 H128 V60 H72 Z", fill: BLUE },
		{ d: "M86 60 L72 162 M100 60 V166 M114 60 L128 162", line: 4 },
		{ d: "M44 150 Q100 164 156 150", line: 3, dash: "6 7", color: BLUE },
	],
	bag: [
		{ d: "M74 84 Q72 30 100 30 Q128 30 126 84", line: 10, color: BLUE },
		{ d: "M40 80 H160 L150 172 H50 Z", fill: CREAM },
		{ d: "M40 80 H160 V98 H40 Z", fill: LILAC },
		{ d: "M86 122 Q100 108 120 120 Q112 140 90 136 Z", fill: BLUE },
		{ d: "M120 120 L132 112 L130 132 Z", fill: BLUE },
	],
	spark: [
		{
			d: "M100 18 Q108 92 182 100 Q108 108 100 182 Q92 108 18 100 Q92 92 100 18 Z",
			fill: LILAC,
		},
	],
	fish: [
		{ d: "M30 100 Q80 40 140 100 Q80 160 30 100 Z", fill: BLUE },
		{ d: "M136 100 L176 70 L170 100 L176 130 Z", fill: BLUE },
		{ d: "M64 92 a6 6 0 1 0 0.1 0", fill: CREAM },
		{ d: "M96 74 Q108 100 96 126", line: 4, color: CREAM },
	],
} satisfies Record<string, Part[]>;

export type StickerKind = keyof typeof stickers;

export function Sticker({
	kind,
	className = "",
	style,
	outline = true,
}: {
	kind: StickerKind;
	className?: string;
	style?: CSSProperties;
	outline?: boolean;
}) {
	const parts: Part[] = stickers[kind];
	return (
		<svg
			className={`sticker ${className}`}
			style={style}
			viewBox="0 0 200 200"
			aria-hidden="true"
			focusable="false"
		>
			{outline ? (
				<g
					fill={WHITE}
					stroke={WHITE}
					strokeWidth={22}
					strokeLinejoin="round"
					strokeLinecap="round"
					className="sticker-edge"
				>
					{parts
						.filter((part) => !part.dash)
						.map((part) => (
							<path
								key={part.d}
								d={part.d}
								fill={part.line ? "none" : WHITE}
								strokeWidth={part.line ? part.line + 22 : 22}
							/>
						))}
				</g>
			) : null}
			<g strokeLinejoin="round" strokeLinecap="round">
				{parts.map((part) =>
					part.line ? (
						<path
							key={part.d}
							d={part.d}
							fill="none"
							stroke={part.color ?? INK}
							strokeWidth={part.line}
							strokeDasharray={part.dash}
						/>
					) : (
						<path
							key={part.d}
							d={part.d}
							fill={part.fill}
							stroke={INK}
							strokeWidth={5}
						/>
					),
				)}
			</g>
		</svg>
	);
}
