import { redirect } from "next/navigation";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "GitHub - Browser Tools Source Code",
  "View the source code for Browser Tools on GitHub. Contribute to the project and help improve these free online tools.",
  "/gh"
);

export default function Page() {
  return redirect("https://github.com/aghyad97/browserytools");
}
