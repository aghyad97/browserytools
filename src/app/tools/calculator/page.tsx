import { Metadata } from "next";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Calculator - Basic & Scientific | BrowseryTools",
  description:
    "Advanced calculator with both basic and scientific modes. Perform arithmetic operations, trigonometric functions, logarithms, and more. Free online calculator tool.",
  keywords: [
    "calculator",
    "scientific calculator",
    "basic calculator",
    "math calculator",
    "arithmetic",
    "trigonometry",
    "logarithm",
    "free calculator",
    "online calculator",
  ],
  openGraph: {
    title: "Calculator - Basic & Scientific | BrowseryTools",
    description:
      "Advanced calculator with both basic and scientific modes. Perform arithmetic operations, trigonometric functions, logarithms, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator - Basic & Scientific | BrowseryTools",
    description:
      "Advanced calculator with both basic and scientific modes. Perform arithmetic operations, trigonometric functions, logarithms, and more.",
  },
};

export default function CalculatorPage() {
  return <Calculator />;
}
