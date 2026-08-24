import React from 'react';

export default function Logo({ size = 32, accentColor = '#6247AA', textColor = '#1C1528', showText = true }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="0" fill={accentColor} />
        <path
          d="M10 13L16 28L20 18L24 28L30 13"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <rect x="18" y="9" width="4" height="4" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
