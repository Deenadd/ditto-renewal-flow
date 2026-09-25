import type { Metadata } from "next";
import { RenewalReview } from "@/components/renewal-review";

export const metadata: Metadata = {
  title: "Let's get your renewal sorted — Ditto",
  description:
    "Five checks before you renew: where you live, who is covered, how much cover you carry, your add-ons and the policy period.",
};

export default function Page() {
  return <RenewalReview variant="v2" />;
}
