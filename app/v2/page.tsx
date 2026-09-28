import type { Metadata } from "next";
import { RenewalReview } from "@/components/renewal-review";
import { parseScenario } from "@/lib/v2-data";

export const metadata: Metadata = {
  title: "Let's get your renewal sorted — Ditto",
  description:
    "Five checks before you renew: where you live, who is covered, how much cover you carry, your add-ons and the policy period.",
};

/**
 * `?scenario=` picks where the cover starts (see `coverScenarios`), so each
 * scenario has a link of its own. Keyed on it, so switching scenario starts
 * the screen afresh rather than carrying one scenario's edits into another.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const scenario = parseScenario((await searchParams).scenario);
  return <RenewalReview key={scenario} variant="v2" scenario={scenario} />;
}
