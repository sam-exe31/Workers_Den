// Workers Den — "Work Docket" light theme.
//
// Rooted in the world of Pune tradespeople: the carbon-copy bill-book, blue-black
// ballpoint ink, ruled ledger rows, and the red rubber stamp that marks a job's
// status. Two inks on manila paper — deliberately NOT the cream + terracotta + serif
// look that reads as generic. High contrast so every component pops; warm paper so
// it never strains the eye.
//
// This object is the single source of truth for colour. Pages read it via
// useTheme() as `t`; App.jsx and index.css mirror a few literals from here.

export const PALETTE = {
  // ── paper ──────────────────────────────────────────────
  bg: '#E7E4D8',          // manila desk paper (kraft — cooler & greyer than AI-cream)
  bgAlt: '#DED9C9',       // deeper paper for footers / page insets
  surface: '#FCFBF7',     // a fresh form laid on the desk — this is what "pops"
  surfaceCard: '#FCFBF7', // alias kept for existing consumers
  cardHover: '#F1EEE3',   // ruled alt-row / hover / inset field  (was missing before)

  // ── ink ────────────────────────────────────────────────
  text: '#18202E',        // blue-black ballpoint
  muted: '#6E6A5B',       // pencil / graphite
  faint: '#9A9483',       // light annotation

  // ── rules ──────────────────────────────────────────────
  border: '#CCC5B2',      // ruled hairline on manila
  borderHover: '#18202E', // interactive borders snap to ink
  borderStrong: '#A79E86',

  // ── brand / action: ballpoint blue (NOT terracotta) ────
  accent: '#1D4E89',
  accentHover: '#163C6B',
  accentSoft: 'rgba(29, 78, 137, 0.10)',
  accentText: '#FCFBF7',  // paper, for text on the blue

  // ── rubber stamp: vermilion. status + urgency + errors ─
  //    ("red = attention" everywhere, so stamp and error share it)
  stamp: '#C23B1E',
  stampHover: '#A62F16',
  stampSoft: 'rgba(194, 59, 30, 0.10)',

  // ── status inks ────────────────────────────────────────
  success: '#2F7D4F',     // ledger green (COMPLETED / paid)
  successSoft: 'rgba(47, 125, 79, 0.12)',
  warning: '#B7791F',     // ochre
  warningSoft: 'rgba(183, 121, 31, 0.12)',
  error: '#C23B1E',       // = stamp red
  errorSoft: 'rgba(194, 59, 30, 0.10)',
};

// Job status → stamp treatment. Used by <StatusStamp> and status chips.
// Label is the human word inked on the stamp; colour is the ink.
export const STATUS_STAMP = {
  OPEN:        { label: 'POSTED',      color: PALETTE.accent  },
  ACCEPTED:    { label: 'ASSIGNED',    color: PALETTE.warning },
  IN_PROGRESS: { label: 'IN PROGRESS', color: PALETTE.warning },
  COMPLETED:   { label: 'DONE',        color: PALETTE.success },
  CANCELLED:   { label: 'VOID',        color: PALETTE.stamp   },
};

export default PALETTE;
