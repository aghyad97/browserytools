import TodoKanban from "@/components/TodoKanban";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/kanban");

export default function KanbanPage() {
  return <TodoKanban />;
}
