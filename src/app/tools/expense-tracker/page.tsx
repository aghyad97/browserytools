import ExpenseTracker from "@/components/ExpenseTracker";
import { generateToolMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/expense-tracker");

export default function ExpenseTrackerPage() {
  return (
    <>
      <ExpenseTracker />
      <ToolSeoContent slug="expense-tracker" />
    </>
  );
}
