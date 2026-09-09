# Ditto renewal flow

A web prototype of the health-insurance renewal review screen, built from the
Figma frame **"Health purchase journey / policy for who - v1"**
(file `kalCtplJimHm1xtOJGC60d`, node `63:2306`).

The user confirms seven things before renewing — city, covered members, declared
conditions, cover amount, refund account, nominee and add-ons — with a live
policy and premium summary alongside.

Answering **No** to a question opens the matching follow-up beneath it, from the
"No" variant of the same design (node `70:3126`).

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
  chip.tsx             Toggleable pill, optionally with a counter
  conditions-table.tsx Pre-existing conditions table
  detail-cards.tsx     Read-only refund account and nominee cards
  policy-summary.tsx   Deadline banner and premium breakdown
  follow-up.tsx        Shell and heading for a revealed follow-up
  follow-ups.tsx       The six follow-up blocks
  icons.tsx            Icons inlined from the Figma export
  ui/field.tsx         Text input and select
  ui/switch.tsx        Track-and-knob switch
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
4. **Question copy.** The "No" frame restates four of the seven descriptions
   with the same placeholder sentence and renames question 2 to "these three
   people" while still drawing four chips. The build keeps the specific copy
   from the first frame.
5. **Bank block copy.** The "No" frame puts a medical-history sentence under the
   "Bank Details" heading. The build uses copy about the refund account instead.
6. **Empty pin code.** The design draws the pin code field filled and focused.
   The build starts it empty, since the user has just said the address on file
   is wrong.
7. **Selected Yes.** Only the selected "No" state is specified, using the error
   tokens. Selected "Yes" uses the neutral ink fill.

## What "No" opens

| Question | Answering No reveals |
| --- | --- |
| 1. Still in Chennai? | A pin code field |
| 2. Still covering these four? | "Who's changed?" with relation chips, and counters on sons and daughters |
| 3. Same conditions? | A line inviting the user to contact an advisor |
| 4. Is ₹15 Lakhs enough? | Three cover options to choose from |
| 5. Same bank account? | A bank form that replaces the read-only card |
| 6. Sneha still your nominee? | A nominee switch list that replaces the read-only card |
| 7. Happy with add-ons? | Nothing; the design has no follow-up here |

"Clear all changes" appears in the footer as soon as any question is answered
No, and resets every answer and follow-up back to the policy on file.

Behaviour added on top of the static frames: the Yes/No controls, chips,
counters, cover picker, bank form and nominee switches are all interactive, and
"Confirm & continue" stays disabled until all seven questions are answered.

## Accessibility

Native radio inputs give arrow-key navigation, the conditions table uses real
table semantics with scoped headers, the scrollable table is keyboard
reachable, answer progress is announced through a live region, and focus rings
are visible throughout.
