# Ditto renewal flow

A web prototype of the health-insurance renewal review screen, built from the
Figma frame **"Health purchase journey / policy for who - v1"**
(file `kalCtplJimHm1xtOJGC60d`, node `63:2306`).

The user confirms seven things before renewing — city, covered members, declared
conditions, cover amount, refund account, nominee and add-ons — with a live
policy and premium summary alongside.

Every question is phrased so that **Yes** means something has changed, and
answering Yes opens the matching follow-up beneath it.

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
  calculating-premium.tsx  Full-page loading screen after Confirm & continue
  icons.tsx            Icons inlined from the Figma export
  ui/field.tsx         Text input and select
  ui/switch.tsx        Track-and-knob switch
lib/
  renewal-data.ts      All copy and figures from the design
public/brand/          Logo and insurer artwork exported from Figma
public/loading/        Calculator animation for the loading screen
```

## Design fidelity

Rendered output was compared against a native-resolution Figma export at 1440px.
Spacing, type, colour and line breaks match. Decisions worth knowing:

1. **Heading copy.** The Figma frame reads "Quick answers before renwals". The
   build uses the corrected spelling, "renewals".
2. **Primary button fill.** The frame only specifies the disabled grey
   (`primary/solid/disabled`). The enabled fill is derived from the design
   system's link blue, darkened so white 15px label text clears WCAG AA.
3. **Add-on count.** The summary reads "Selected Add-ons (1/5)" above a two-row
   list, exactly as drawn. The count is reproduced from the design rather than
   derived from the list length.
4. **Question copy.** The latest frame restates five of the seven descriptions
   with the same placeholder sentence. The build keeps the specific copy from
   the first frame and writes fresh copy for the new add-ons question.
5. **Bank block copy.** The "No" frame puts a medical-history sentence under the
   "Bank Details" heading. The build uses copy about the refund account instead.
6. **Empty pin code.** The design draws the pin code field filled and focused.
   The build starts it empty, since the user has just said the address on file
   is wrong.
7. **Selected answer colour.** An earlier frame tinted a selected "No" with the
   error tokens, when "No" was the answer that opened a follow-up. The
   questions now put that meaning on "Yes", and colouring "Yes, I want more
   cover" as an error would read wrong, so both selected states use neutral ink.
8. **Duplicate add-on row.** The sidebar lists "Cumulative Bonus Super" twice.
   The second row keeps its price and takes the third add-on name used in the
   earlier frames.
9. **Truncated waiting periods.** Two waiting-period captions are drawn
   mid-truncation ("For diseas..."). The build writes them out in full.
10. **Add-on picker.** No frame specifies it. It reuses the selected-card
    treatment from the cover options, and lists the optional add-ons named in
    the first frame.

## What "Yes" opens

| Question | Answering Yes reveals |
| --- | --- |
| 1. Moved since last year? | A pin code field |
| 2. Need to add or remove anyone? | "Who's changed?" with relation chips, and counters on sons and daughters |
| 3. Any new health conditions? | A line inviting the user to contact an advisor |
| 4. Want to increase your cover? | Three cover options to choose from |
| 5. Change the refund account? | A bank form |
| 6. Change the nominee? | A nominee switch list |
| 7. Add new add-ons? | An add-on picker that feeds the sidebar total |

"Clear all changes" appears in the footer as soon as any question is answered
Yes, and resets every answer and follow-up back to the policy on file.

## After Confirm & continue

Confirming swaps the page for the "Calculating Premium" screen (node
`72:3721`), holds it for a few seconds, then returns to the review with the
result. The calculator is an animated WebP built from the Figma asset, cut from
4 MB to 97 KB; a still frame is served to anyone who prefers reduced motion and
to browsers without animated WebP.

Behaviour added on top of the static frames: the Yes/No controls, chips,
counters, cover picker, bank form, nominee switches and add-on picker are all
interactive, and "Confirm & continue" stays disabled until all seven questions
are answered. Picking add-ons adds a "New Add-ons" block to the sidebar and
rolls the prices into the total premium.

## Accessibility

Native radio inputs give arrow-key navigation, the conditions table uses real
table semantics with scoped headers, the scrollable table is keyboard
reachable, answer progress is announced through a live region, and focus rings
are visible throughout.
