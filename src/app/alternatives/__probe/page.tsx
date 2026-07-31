import { comparisons } from "@/lib/comparisons";
export default function Probe() {
  return <pre>PROBE OK {comparisons.length} {comparisons.map((c) => c.slug).join(",")}</pre>;
}
