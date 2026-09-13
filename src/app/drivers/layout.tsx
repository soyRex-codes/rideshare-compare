import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rido Partners — Rideshare Compare",
  description: "Book a ride with our trusted drivers and save 30%",
};

export default function DriversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
