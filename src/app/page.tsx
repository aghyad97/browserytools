import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
      <h1 className="text-4xl font-bold">Web Tools Suite</h1>
      <p className="text-muted-foreground">Powerful browser-based tools</p>
      <Link href="/tools/bg-removal">
        <Button>Try Background Removal</Button>
      </Link>
    </div>
  );
}
