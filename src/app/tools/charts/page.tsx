import { Charts } from "@/components/Charts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charts - Browser Tools",
  description:
    "Create beautiful, customizable charts with full control over every detail. Support for area, bar, line, pie, radar, and radial charts with multiple export options.",
  keywords: [
    "charts",
    "data visualization",
    "graph",
    "chart creator",
    "bar chart",
    "line chart",
    "pie chart",
    "area chart",
    "radar chart",
    "radial chart",
  ],
  openGraph: {
    title: "Charts - Browser Tools",
    description:
      "Create beautiful, customizable charts with full control over every detail. Support for area, bar, line, pie, radar, and radial charts with multiple export options.",
    type: "website",
  },
};

export default function ChartsPage() {
  return <Charts />;
}
