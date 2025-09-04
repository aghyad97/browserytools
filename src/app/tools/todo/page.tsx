import TodoList from "@/components/TodoList";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/todo");

export default function TodoPage() {
  return <TodoList />;
}
