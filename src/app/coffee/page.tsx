import { redirect } from "next/navigation";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Buy Me a Coffee - Support Browser Tools",
  "Support the development of Browser Tools by buying me a coffee. Help keep these free tools available for everyone.",
  "/coffee"
);

export default function Page() {
  return redirect("https://pay.ziina.com/aghyad");
}
