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
  conditions-table.tsx Pre-existing conditions table
  policy-summary.tsx   Deadline banner and premium breakdown
  follow-up.tsx        Shell and heading for a revealed follow-up
  follow-ups.tsx       The seven follow-up blocks
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
7. **Selected answer colour.** A selected "Yes" uses the success tokens, as
   drawn. Only that state is specified, so a selected "No" falls back to
   neutral ink.
8. **Duplicate rows.** The sidebar lists "Cumulative Bonus Super" twice, and the
   add-ons card prices all three locked add-ons at ₹2,419. The build uses the
   three distinct names and the three distinct prices.
9. **Truncated waiting periods.** Two waiting-period captions are drawn
   mid-truncation ("For diseas..."). The build writes them out in full.
10. **Two titles differ between frames.** The initial frame reads "xxxx5677" and
    "Sneha Kumari, spouse"; the expanded frame reads "x5677" and "Sneha Kumari
    (spouse)". The build follows the later frame.
11. **Member form values.** The frame fills the add-a-member form with the bank
    form's values. The build ships empty fields with placeholders, and uses a
    date input for date of birth rather than a select.
12. **Other Add-ons.** Only the collapsed row is drawn. Expanding it shows a
    single line pointing to an advisor.

## What "Yes" opens

| Question | Answering Yes reveals |
| --- | --- |
| 1. Moved since last year? | A pin code field |
| 2. Need to add or remove anyone? | A form to add a member, plus a notice that removals go through an advisor |
| 3. Any new health conditions? | A line inviting the user to contact an advisor |
| 4. Want to increase your cover? | Three cover options, ₹15L, ₹20L and ₹25L, opening on the ₹15L already held |
| 5. Change the refund account? | A bank form |
| 6. Change the nominee? | A nominee switch list |
| 7. Add new add-ons? | The add-ons card: three locked, five recommended, and a collapsed group |

"Clear all changes" appears in the footer as soon as any question is answered
Yes, and resets every answer and follow-up back to the policy on file.

## After Confirm & continue

Confirming swaps the page for the "Calculating Premium" screen (node
`72:3721`), holds it for a few seconds, then returns to the review with the
result. The calculator is an animated WebP built from the Figma asset, cut from
4 MB to 97 KB; a still frame is served to anyone who prefers reduced motion and
to browsers without animated WebP.

Behaviour added on top of the static frames: the Yes/No controls, member form,
cover picker, bank form, nominee switches, add-on checkboxes and term radios are
all interactive, and "Confirm & continue" stays disabled until all seven
questions are answered.

## Accessibility

Native radio inputs give arrow-key navigation, the conditions table uses real
table semantics with scoped headers, the scrollable table is keyboard
reachable, answer progress is announced through a live region, and focus rings
are visible throughout.
