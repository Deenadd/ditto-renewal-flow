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
7. **Selected answer colour.** The fill carries the answer. A selected "Yes"
   uses the success tokens (#3F9256 fill, #3F9256 label) and a selected "No"
   uses the error tokens (#F44B4F fill, #CF222E label).
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
13. **Primary button fill.** Now `primary/solid/default` (#389BF5), the token
    the "Buy this policy" button uses. White label text on it sits at about
    2.9:1, under the 4.5:1 WCAG AA needs at 15px. Worth a darker shade if this
    goes past prototype.
14. **Summary lines.** The frame draws six; the build draws seven, adding the
    cover line so every question is accounted for. The frame also ends the
    refund-account line with a question mark carried over from the question,
    which the build drops.
15. **Policy period copy.** All three cards repeat the Instant Cover
    description. The build writes copy about the terms themselves. The two-year
    card is drawn with a ₹5,056 struck price against a ₹55,972 premium; the
    build uses ₹62,401, the premium plus the saving the same card quotes.
16. **Summary sidebar figures.** The frame re-ages the members and prices two
    add-ons differently from its own add-ons card. The build keeps one set of
    ages and prices throughout.

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
`72:3721`), holds it for a few seconds, then lands on the renewal summary
(node `78:6737`). The calculator is an animated WebP built from the Figma
asset, cut from 4 MB to 97 KB; a still frame is served to anyone who prefers
reduced motion and to browsers without animated WebP.

## The summary screen

One confirmation line per question, worded from the answer given. Lines the
reviewer changed carry a blue plus and a Change link back to that question;
the rest carry a green check.

The lines land one at a time, about a third of a second apart, and the policy
periods follow once the last one is in. Reduced motion collapses the stagger so
the whole screen arrives at once.

Policy periods offer one, two and three year terms, with the two longer ones
inside the "Save 18% on medical inflation" panel. "Go back" returns to the
review; "Buy this policy" confirms.

The sidebar switches to its detailed variant here: the plan row with its Switch
link, a green cover and premium because they were re-checked, an added member
shown as a green badge, and a premium breakdown whose sections collapse and
whose rows carry checkboxes.

Behaviour added on top of the static frames: the Yes/No controls, member form,
cover picker, bank form, nominee switches, add-on checkboxes and term radios are
all interactive, and "Confirm & continue" stays disabled until all seven
questions are answered.

## Accessibility

Native radio inputs give arrow-key navigation, the conditions table uses real
table semantics with scoped headers, the scrollable table is keyboard
reachable, answer progress is announced through a live region, and focus rings
are visible throughout.
