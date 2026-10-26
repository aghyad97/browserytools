import TodoList from "@/components/TodoList";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/todo");

export default function TodoPage() {
  return (
    <>
      <TodoList />
      <ToolSeoContent slug="todo" />
    </>
  );
}
