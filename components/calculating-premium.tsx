/**
 * Calculating premium (node 72:3721).
 *
 * Shown after "Confirm & continue" while the new premium is worked out. The
 * calculator animation ships as an animated WebP, with a still frame served to
 * anyone who prefers reduced motion and as the fallback for browsers without
 * animated WebP.
 */
export function CalculatingPremium() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center px-6 py-12 text-center [@media(min-height:700px)]:py-0 [@media(min-height:700px)]:pb-[164px]"
    >
      <picture>
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet="/loading/calculator.png"
        />
        <source type="image/webp" srcSet="/loading/calculator.webp" />
        <img
          src="/loading/calculator.png"
          alt=""
          width={162}
          height={162}
          className="size-[162px]"
        />
      </picture>

      <h1 className="mt-1.5 text-[32px] leading-[1.2] font-semibold text-ink">
        Calculating Premium
      </h1>
      <p className="mt-[11px] max-w-[361px] text-[16px] leading-[1.5] text-ink-secondary">
        This might take a few seconds. Please don&rsquo;t close or refresh the
        page.
      </p>
    </main>
  );
}
