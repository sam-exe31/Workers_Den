import React from 'react';

/**
 * Workers Den mark — a bold "W" crowned by a hex nut where its last stroke rises.
 * Letter + tool, in one glyph. Monochrome so it stamps in any ink and scales from
 * a 16px favicon to a hero seal. It is the visual sibling of the status stamp used
 * across the app.
 *
 * Props:
 *  - size        px, square (default 32)
 *  - color       primary ink of the mark (alias: accentColor, kept for back-compat)
 *  - variant     'solid' → filled tile with a light mark (default)
 *                'ink'   → transparent tile, mark drawn in `color`
 *  - tileColor   tile fill for the solid variant (defaults to `color`)
 *  - markColor   the W/nut colour (defaults: paper on solid, `color` on ink)
 *  - showText    also render the WORKERS·DEN wordmark
 *  - textColor   wordmark ink
 */
export default function Logo({
  size = 32,
  color,
  accentColor,
  variant = 'solid',
  tileColor,
  markColor,
  showText = false,
  textColor = '#18202E',
}) {
  const ink = color || accentColor || '#1D4E89';
  const solid = variant === 'solid';
  const tile = solid ? tileColor || ink : 'transparent';
  const mark = markColor || (solid ? '#FCFBF7' : ink);
  const sw = 4.6;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.34) }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Workers Den"
      >
        {/* stamp tile */}
        <rect
          x={solid ? 1 : 2}
          y={solid ? 1 : 2}
          width={solid ? 46 : 44}
          height={solid ? 46 : 44}
          rx="10"
          fill={tile}
          stroke={solid ? 'none' : ink}
          strokeWidth={solid ? 0 : 2.6}
        />
        {/* faint inner keyline — the "seal" ring */}
        {solid && (
          <rect x="5" y="5" width="38" height="38" rx="6.5" fill="none" stroke={mark} strokeOpacity="0.26" strokeWidth="1.4" />
        )}

        {/* the W — down, up, down, then a short up-stroke into the nut */}
        <path
          d="M10.5 15 L16 33 L24 22 L30 33 L33 20.5"
          stroke={mark}
          strokeWidth={sw}
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* hex nut crowning the last stroke */}
        <polygon
          points="35.2,20.9 30.9,18.4 30.9,13.4 35.2,10.9 39.5,13.4 39.5,18.4"
          fill="none"
          stroke={mark}
          strokeWidth="2.8"
          strokeLinejoin="miter"
        />
        <circle cx="35.2" cy="15.9" r="1.7" fill={mark} />
      </svg>

      {showText && (
        <span
          className="wd-display"
          style={{ fontWeight: 800, letterSpacing: '-0.01em', color: textColor, fontSize: Math.round(size * 0.6), lineHeight: 1 }}
        >
          WORKERS<span style={{ color: ink }}>DEN</span>
        </span>
      )}
    </span>
  );
}
