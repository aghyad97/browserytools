import ExpenseTracker from "@/components/ExpenseTracker";
import { generateToolMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata = generateToolMetadata("/tools/expense-tracker");

export default function ExpenseTrackerPage() {
  return <ExpenseTracker />;
}
