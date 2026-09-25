# Ditto renewal flow

A web prototype of the health-insurance renewal review screen, built from the
Figma frame **"Health purchase journey / policy for who - v1"**
(file `kalCtplJimHm1xtOJGC60d`, node `63:2306`).

The user confirms seven things before renewing — city, covered members, declared
conditions, cover amount, refund account, nominee and add-ons — with a live
policy and premium summary alongside.

Every question is phrased so that **Yes** means something has changed, and
answering Yes opens the matching follow-up beneath it.

There are two renewal screens, both leading into the same journey:

| Route | Screen |
| --- | --- |
| `/` | The eight Yes/No questions (node `63:2306` and its successors) |
| `/v2` | **V2** — the policy shown as five editable checks (node `142:3114`), with the cover pickers from node `142:3692` |

The menu beside the brand mark swaps between them from anywhere in the
journey. It is a menu button rather than a `<select>` on purpose: choosing an
option here changes the page, and a select fires its change on every arrow
key, so a keyboard user would be moved before they had chosen.

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
  page.tsx             The Yes/No review screen
  v2/page.tsx          The V2 renewal screen, same journey behind it
components/
  site-header.tsx      Nav bar; brand mark steps back, menu swaps version
  renewal-review.tsx   Client component holding all answer state
  question.tsx         One numbered question row
  yes-no-group.tsx     Accessible Yes/No radio pair
  conditions-table.tsx Pre-existing conditions table
  policy-summary.tsx   Deadline banner and premium breakdown
  follow-up.tsx        Shell and heading for a revealed follow-up
  follow-ups.tsx       The seven follow-up blocks
  calculating-premium.tsx  Full-page loading screen after Confirm & continue
  renewal-summary.tsx  Change summary and policy periods
  anchor-screen.tsx    What is left to do once the policy is bought
  kyc-screen.tsx       Proposer KYC lookup and the gateway redirect
  proposal-form.tsx    Address, medical history and lifestyle
  proposal-summary.tsx Read-back of the proposal with declarations
  policy-bar.tsx       Collapsed policy summary under the nav
  support-panel.tsx    Help card carried down the journey
  icons.tsx            Icons inlined from the Figma export
  ui/field.tsx         Text input and select
  ui/switch.tsx        Track-and-knob switch
  ui/version-menu.tsx  Menu button behind both version switchers
  v2/renewal-v2.tsx    The five checks, and the state behind them
  v2/cover-picker.tsx  Six cover controls and the verdict they share
lib/
  renewal-data.ts      All copy and figures from the design
  proposal-data.ts     Medical questions, steps and step notes
  v2-data.ts           V2 copy, cover stops and the verdict per stop
public/brand/          Logo and insurer artwork exported from Figma
public/loading/        Calculator animation for the loading screen
public/anchor/         Banner and support artwork for the anchor screen
public/kyc/            Document and sparkle artwork for the KYC screen
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
17. **Anchor screen artwork.** The banner illustration and the support mascot
    are cut from 2x node exports and keyed off their backgrounds, because both
    are composed from overlapping rotated layers that clip outside their
    frames.
18. **Proposal form members.** The frames run the form over one person, "Uma
    Kumari", with a 2024 date of birth for a mother. The build runs it over the
    people already on this policy, with dates and measurements that match the
    ages used elsewhere.
19. **Address character limit.** The frame caps address lines at 30 characters,
    which will not hold the address it displays. The build uses 60.
20. **Summary detail labels.** The frame labels the read-back with "Test date /
    Test type / Test findings" while the form collects diagnosis and treatment.
    The build reads back the labels the form actually asked for.
21. **Payment step policy name.** The frame's policy bar reads "Care Supreme"
    on that one screen. The build keeps "Optima Secure" throughout.
22. **v2 first step button.** The Address frame draws "Confirm and submit" even
    though three steps follow it. The build shows "Next step" until the last
    step, which is what the other three frames do.
23. **Payment redirect.** The payment step opens the same insurer redirect
    dialog the KYC step uses. No frame specifies a payment gateway.
24. **V2 member cards.** The frame labels Priya "42 · Son" and Aarav
    "45 · self", repeating the proposer's own age and relationship. The build
    uses the ages and relationships the sidebar card carries: you 45, spouse 42,
    son 12, daughter 10.
25. **V2 cover pricing.** The card heads the slider with ₹34,999/yr, but the
    explanation below it prints "₹31,043 to ₹36,473" for the same change. The
    build keeps ₹34,999 — the figure the sidebar and the rest of the journey
    use — and derives each stop from the frame's own "+₹450 / month", so the
    screen tells one story.
26. **V2 cover copy above the recommendation.** The ₹25L frame repeats the ₹20L
    wording verbatim, still naming ₹20 lakh throughout. The build fills the
    figures in from the stop in play, which also gives ₹30L a card the frame
    never drew.
27. **V2 slider handle travel.** The frame's handle runs between the centres of
    the first and last tick labels, about 17px inside each end of the track. The
    build runs it the full width of the track, so ₹10L and ₹30L sit at the ends.
    The ₹20L and ₹25L marks land within 2px of the frame either way.
28. **V2 "More options".** The frame draws it as a heading with nothing under
    it. The build makes it a disclosure onto the three add-ons the picked group
    leaves out.
29. **V2 Confirm & continue.** The frame draws it disabled. Renewing without
    changing anything is the point of the screen, so the build keeps it enabled
    and instead hides "Clear all changes" until there is something to clear.
30. **V2 policy period cards.** All three repeat the Instant Cover description
    and the frame orders them 1, 3, 2 Year. The build keeps the wording and the
    ascending order already used on the summary screen, which makes the cards
    shorter than the frame draws them.

## V2 (`/v2`)

Node `142:3114`. The same renewal, asked differently: no Yes/No radios at all.
Each of five checks shows what the policy carries today and lets you change it
in place, under a three-step progress bar and an amber notice counting down to
the expiry date.

| # | Check | What it does |
| --- | --- | --- |
| 1 | Where you live | **Edit** swaps the address line for address, pin code and city fields |
| 2 | Who is covered | A card per member, a dashed **Add Person** tile that opens a name/age/relationship form, and a remove control on everyone but the proposer |
| 3 | Cover amount | The slider below |
| 4 | Add-ons | Three groups: already on the policy (locked, blue ticks), picked for your family (green ticks), and **More options** |
| 5 | Policy period | One, two or three years, with the saving each longer term buys |

**Confirm & continue** folds the screen down into the same answers the Yes/No
version produces, so the premium calculation, summary, KYC, proposal form and
payment steps that follow are the journey already built. Stepping back with the
brand mark finds the screen exactly as it was left.

### Picking the cover

Three versions of the same decision, behind the menu at the trailing edge of
the heading. They share the verdict card beneath them, so the comparison is
about the control alone.

| Version | Control | What it is good at |
| --- | --- | --- |
| 1 · Slider | Drag or arrow along a five-stop track | The band you land in carries the advice; the frame's own design |
| 2 · Cards | Four priced cards, one click | Every amount and its premium are legible without moving anything |
| 3 · Stepper | − / + around one amount | Quietest of the three, and prices the change by the month |

Versions 2 and 3 exist because the slider makes you move the handle to find out
what ₹25 lakh costs. The cards answer that before you touch anything, and the
stepper answers the question people actually budget against — what it adds to
the month. All three reach the same four stops and write to the same value, and
switching between them keeps the cover you had picked.

#### Version 1, the slider

Nodes `142:3693`, `142:3789` and `142:3883` draw it at ₹15L, ₹20L and
₹25L. The track carries the advice rather than just the value: it is yellow up
to the ₹20L recommendation and green past it, and the blue fill covers whichever
of those the chosen amount has already reached. Three things then move together:

| Cover | Handle | Tick | Card below |
| --- | --- | --- | --- |
| Below ₹20L | Blue ring, grip mark | Blue | Peach — "₹15 lakh is not enough anymore" |
| ₹20L | Green ring, shield, standing in for the recommendation marker | Green | Green — "Good choice…" |
| Above ₹20L | Purple ring, shield | Purple | Lilac — "…gives you extra room" |

It is a real `<input type="range">` under a drawn track, so arrow keys, Home and
End, click-to-position and drag all work, and the value is announced as
"₹20 lakh, ₹40,429 a year, recommended for your family". ₹10L is drawn greyed
and is out of range, because cover does not drop at renewal — which is also why
the other two versions offer four amounts rather than five.

The handle and fill move on `transform` over 200ms `cubic-bezier(0.23, 1, 0.32, 1)`,
so dragging across stops retargets smoothly instead of restarting.

#### Versions 2 to 6

Every one is a native form control with the chrome drawn over it — a radio
group in a fieldset for cards, compare, list and table, two buttons for the
stepper — so none of them needed a keyboard model written by hand, and all of
them answer to arrow keys. The table is a real `<table>`, so each figure is
announced with the amount it belongs to; below `sm` it scrolls, and its
trailing edge fades so it does not read as ending at the second column.

Selection is never colour alone: a tick on the cards, a filled ring on the list
and table, a solid chip on compare, and a named band everywhere. Every amount
also carries its band in words — "Not enough", "Recommended", "Extra room".

The card below all six changes its whole contents at once, so it blurs through
the swap over 260ms rather than crossfading two readable copies of different
text, and the control itself blurs through the same swap when the version
changes. Both hold still under `prefers-reduced-motion`.

## What "Yes" opens

| Question | Answering Yes reveals |
| --- | --- |
| 1. Moved since last year? | A pin code field |
| 2. Change your contact details? | Full name, phone and mail |
| 3. Need to add or remove anyone? | A form to add a member, plus a notice that removals go through an advisor |
| 4. Want to increase your cover? | Three cover options, ₹15L, ₹20L and ₹25L, opening on the ₹15L already held |
| 5. Add new add-ons? | The add-ons card: three locked, five recommended, and a collapsed group |
| 6. Any new health conditions? | A line inviting the user to contact an advisor |
| 7. Change the refund account? | A bank form |
| 8. Change the nominee? | A nominee switch list |

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
reviewer changed carry a blue plus and a Change link; the rest carry a green
check.

Change opens that question's block in place, under the line, rather than
sending the reviewer back. It is the same block the review page uses, so edits
land in the same state and the line above rewrites itself as you type.

The lines land one a second, each resolving out of a blur as it settles. The
policy periods follow a second after the last line, so the screen takes about
eight seconds to fill. Reduced motion collapses the stagger so the whole screen
arrives at once. The pace is `STEP_MS` in `components/renewal-summary.tsx`.

Policy periods offer one, two and three year terms, with the two longer ones
inside the "Save 18% on medical inflation" panel. "Go back" returns to the
review; "Buy this policy" moves to the anchor screen.

## The anchor screen

"You're almost done!" (node `79:7114`) lists what is left before the policy
issues: KYC, the proposal form, payment and issuance, with only the first step
open. A blue banner explains that progress is autosaved, and the sidebar drops
the deadline banner and the benefits card in favour of a support panel.

## Proposer KYC

Start on the KYC step opens the CKYC lookup (nodes `121:7357`, `121:7520`,
`121:7699`). Fill the PAN, date of birth and phone number, and "Fetch KYC
details" reveals what the lookup returned. The values are placeholders here, so
the button only checks that the three fields are filled, not that they are well
formed.

"Verify & Continue" accepts the record and returns to the anchor screen.
"Details don't match" opens the redirect notice, because a mismatch is what
sends the proposer to the insurer's own gateway to finish KYC there.

The gateway dialog closes on Escape or on the backdrop. Continue would leave for
`hdfcergoinsurance.kycgateway.com`, which is outside the prototype, so it
returns to the anchor screen instead.

## Proposal form

Finishing KYC ticks that step and hands the anchor screen to the proposal
(nodes `122:8241`, `122:8373`, `122:8914`, `122:9096`). The anchor screen is one
component driven by how far the journey has got: earlier steps carry a green
check, the step in play carries its own button, and the sidebar panel changes
with it, from the KYC steps to the proposal steps to the payment modes.

### What the form asks

The proposal only asks what the review answers made necessary.

| Review answer | Proposal steps |
| --- | --- |
| Moved since last year: Yes | Communication address |
| Need to add or remove anyone: Yes | Medical history 1, Medical history 2, Lifestyle |
| Neither | No proposal form at all |

With neither, the proposal step drops off the anchor screen and the journey
goes to payment. Answer No to everything on the review and KYC drops too,
leaving payment and issuance, as node `123:12651` draws it.

The health questions are asked about whoever was just added, since that is the
person the insurer has no history for.

### Two layouts

The sidebar carries a **Turn on the step-by-step form** switch. Off, the form is
one page with the sidebar tracker following whatever is on screen. On, it runs
one step at a time behind a tab bar, with Next step between steps and Confirm
and submit on the last (nodes `123:11849` to `123:12025`). The switch was
labelled "v2" while that was the only second version in the prototype; it is
named for what it does now that `/v2` is a screen of its own.

Either way, each member gets an accordion with a live count of what is still
unanswered, and in Medical History 2 a "Yes" opens six fields for the diagnosis
and treatment.

"Confirm and submit" opens the summary, which spans the full width with no
sidebar, as drawn. Each card can be collapsed or sent back to the form with
Edit, and "Confirm and Submit" stays disabled until the declarations are
ticked. Submitting ticks the proposal step and returns to the anchor screen
with payment in play.

The sidebar switches to its detailed variant here: the plan row with its Switch
link, an added member shown as a green badge, and a premium breakdown whose
sections collapse and whose rows carry checkboxes. Pin code and cover show the
values the reviewer chose, in green, so the card describes the policy being
bought rather than the one on file. The premium itself stays as designed, since
no frame gives the pricing behind a cover change.

Behaviour added on top of the static frames: the Yes/No controls, member form,
cover picker, bank form, nominee switches, add-on checkboxes and term radios are
all interactive, and "Confirm & continue" stays disabled until all seven
questions are answered.

## Getting back

The brand mark in the nav steps back one screen. The journey keeps a stack of
where it has been, so it works from any point and from the redirect dialogs.
On the first screen there is nowhere to go, so the mark renders as plain
artwork rather than a button.

## Accessibility

Native radio inputs give arrow-key navigation, the conditions table uses real
table semantics with scoped headers, the scrollable table is keyboard
reachable, answer progress is announced through a live region, and focus rings
are visible throughout.

On V2 the cover slider is a native range input, so it comes with the full
keyboard model for free; the drawn handle picks up the focus ring from it, the
chosen cover is announced through `aria-valuetext`, and the verdict is repeated
in a polite live region. Every zone is marked by a shape as well as a colour —
grip versus shield on the handle — so the advice does not rest on colour alone.
The progress bar is an ordered list with `aria-current="step"` rather than tabs,
since steps 2 and 3 are not somewhere you can go yet.

The version menus follow the ARIA menu button pattern: the trigger opens on
Enter, Space or Down, focus moves onto the checked option, arrows and Home/End
move within, Escape closes and returns focus to the trigger, and only Enter,
Space or a click commits. Nothing changes while you are still looking.
