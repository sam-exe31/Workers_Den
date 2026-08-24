import React from 'react';
import { useTheme } from '../../theme/ThemeContext';

export default function Footer() {
  const { theme: t } = useTheme();

  return (
    <footer
      className="pt-6 pb-10 border-t flex flex-col sm:flex-row justify-between items-center gap-3 wd-mono text-xs max-w-6xl w-full mx-auto px-4 sm:px-8"
      style={{ borderColor: t.border, color: t.muted }}
    >
      <div>© 2026 WORKERS DEN · ALL RIGHTS RESERVED</div>
      <div>PUNE, MAHARASHTRA</div>
    </footer>
  );
}
