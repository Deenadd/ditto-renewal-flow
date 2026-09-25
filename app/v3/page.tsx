import type { Metadata } from "next";
import { RenewalReview } from "@/components/renewal-review";

export const metadata: Metadata = {
  title: "Your renewal is ready — Ditto",
  description:
    "Renew your Optima Secure policy as it is, take one recommendation on cover, and see the price change as you go.",
};

export default function Page() {
  return <RenewalReview variant="v3" />;
}
