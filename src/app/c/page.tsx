import type { Metadata } from "next";
import { BusinessCard } from "./business-card";

export const metadata: Metadata = {
  title: "Nick Stephens | Trinity Remodeling",
  description: "Digital business card for Trinity Remodeling",
  robots: { index: false, follow: false },
};

export default function CardPage() {
  return <BusinessCard />;
}
