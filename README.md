# Ditto renewal flow

A web prototype of the health-insurance renewal review screen, built from the
Figma frame **"Health purchase journey / policy for who - v1"**
(file `kalCtplJimHm1xtOJGC60d`, node `63:2306`).

The user confirms seven things before renewing — city, covered members, declared
conditions, cover amount, refund account, nominee and add-ons — with a live
policy and premium summary alongside.

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 with design tokens in `app/globals.css` |
| Font | Inter via `next/font/google` |
| Hosting | Vercel |

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Layout

```
app/
  globals.css          Design tokens (colours, shadow, type helpers) + separators
  layout.tsx           Font wiring and document metadata
  page.tsx             Composes the header and the review screen
components/
  site-header.tsx      Nav bar with brand mark and support link
  renewal-review.tsx   Client component holding all answer state
  question.tsx         One numbered question row
  yes-no-group.tsx     Accessible Yes/No radio pair
  member-tag.tsx       Toggleable covered-member chip
  conditions-table.tsx Pre-existing conditions table
  detail-cards.tsx     Refund account and nominee cards
  policy-summary.tsx   Deadline banner and premium breakdown
  icons.tsx            Icons inlined from the Figma export
lib/
  renewal-data.ts      All copy and figures from the design
public/brand/          Logo and insurer artwork exported from Figma
```

## Design fidelity

Rendered output was compared against a native-resolution Figma export at 1440px.
Spacing, type, colour and line breaks match. Three decisions worth knowing:

1. **Heading copy.** The Figma frame reads "Quick answers before renwals". The
   build uses the corrected spelling, "renewals".
2. **Primary button fill.** The frame only specifies the disabled grey
   (`primary/solid/disabled`). The enabled fill is derived from the design
   system's link blue, darkened so white 15px label text clears WCAG AA.
3. **Add-on count.** The summary reads "Selected Add-ons (1/5)" above a two-row
   list, exactly as drawn. The count is reproduced from the design rather than
   derived from the list length.

Behaviour added on top of the static frame: the Yes/No controls and member chips
are interactive, and "Confirm & continue" stays disabled until all seven
questions are answered.

## Accessibility

Native radio inputs give arrow-key navigation, the conditions table uses real
table semantics with scoped headers, the scrollable table is keyboard
reachable, answer progress is announced through a live region, and focus rings
are visible throughout.
