// Pure state logic for the Mind Map tool. Kept framework-free so it can be
// unit-tested without rendering the React Flow canvas (hard in happy-dom).

export interface MindMapNodeData {
  label: string;
  color: string;
  [key: string]: unknown;
}

export interface MindMapNode {
  id: string;
  position: { x: number; y: number };
  data: MindMapNodeData;
  type?: string;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
}

export interface MindMapState {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export const NODE_COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
] as const;

export const STORAGE_KEY = "browserytools-mind-map";

let idCounter = 0;
export function nextId(): string {
  idCounter += 1;
  return `node_${Date.now().toString(36)}_${idCounter}`;
}

export function nextEdgeId(): string {
  idCounter += 1;
  return `edge_${Date.now().toString(36)}_${idCounter}`;
}

export function createInitialState(rootLabel: string): MindMapState {
  return {
    nodes: [
      {
        id: "root",
        position: { x: 0, y: 0 },
        data: { label: rootLabel, color: NODE_COLORS[0] },
        type: "mindMapNode",
      },
    ],
    edges: [],
  };
}

/** Add a child node connected to `parentId`, offset below-right of the parent. */
export function addChildNode(
  state: MindMapState,
  parentId: string,
  label: string,
): MindMapState {
  const parent = state.nodes.find((n) => n.id === parentId);
  if (!parent) return state;
  const id = nextId();
  const siblings = state.edges.filter((e) => e.source === parentId).length;
  const child: MindMapNode = {
    id,
    position: {
      x: parent.position.x + 220,
      y: parent.position.y + siblings * 90,
    },
    data: { label, color: parent.data.color },
    type: "mindMapNode",
  };
  return {
    nodes: [...state.nodes, child],
    edges: [...state.edges, { id: nextEdgeId(), source: parentId, target: id }],
  };
}

/** Add a sibling of `nodeId` (a child of the same parent, or detached root). */
export function addSiblingNode(
  state: MindMapState,
  nodeId: string,
  label: string,
): MindMapState {
  const incoming = state.edges.find((e) => e.target === nodeId);
  if (incoming) {
    return addChildNode(state, incoming.source, label);
  }
  const node = state.nodes.find((n) => n.id === nodeId);
  if (!node) return state;
  const id = nextId();
  const sibling: MindMapNode = {
    id,
    position: { x: node.position.x, y: node.position.y + 90 },
    data: { label, color: node.data.color },
    type: "mindMapNode",
  };
  return { nodes: [...state.nodes, sibling], edges: state.edges };
}

export function renameNode(
  state: MindMapState,
  nodeId: string,
  label: string,
): MindMapState {
  return {
    ...state,
    nodes: state.nodes.map((n) =>
      n.id === nodeId ? { ...n, data: { ...n.data, label } } : n,
    ),
  };
}

export function setNodeColor(
  state: MindMapState,
  nodeId: string,
  color: string,
): MindMapState {
  return {
    ...state,
    nodes: state.nodes.map((n) =>
      n.id === nodeId ? { ...n, data: { ...n.data, color } } : n,
    ),
  };
}

/** Delete a node and any edges touching it. The root node cannot be deleted. */
export function deleteNode(state: MindMapState, nodeId: string): MindMapState {
  if (nodeId === "root") return state;
  return {
    nodes: state.nodes.filter((n) => n.id !== nodeId),
    edges: state.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId,
    ),
  };
}

export function connectNodes(
  state: MindMapState,
  source: string,
  target: string,
): MindMapState {
  if (source === target) return state;
  const exists = state.edges.some(
    (e) => e.source === source && e.target === target,
  );
  if (exists) return state;
  return {
    ...state,
    edges: [...state.edges, { id: nextEdgeId(), source, target }],
  };
}

export function exportToJSON(state: MindMapState): string {
  return JSON.stringify(
    { version: 1, nodes: state.nodes, edges: state.edges },
    null,
    2,
  );
}

export function importFromJSON(json: string): MindMapState {
  const parsed = JSON.parse(json);
  if (
    !parsed ||
    !Array.isArray(parsed.nodes) ||
    !Array.isArray(parsed.edges)
  ) {
    throw new Error("Invalid mind map file");
  }
  // Basic shape validation so a malformed file does not crash the canvas.
  const nodes: MindMapNode[] = parsed.nodes.map((n: MindMapNode) => ({
    id: String(n.id),
    position: {
      x: Number(n.position?.x) || 0,
      y: Number(n.position?.y) || 0,
    },
    data: {
      label: String(n.data?.label ?? ""),
      color: String(n.data?.color ?? NODE_COLORS[0]),
    },
    type: "mindMapNode",
  }));
  const edges: MindMapEdge[] = parsed.edges.map((e: MindMapEdge) => ({
    id: String(e.id),
    source: String(e.source),
    target: String(e.target),
  }));
  return { nodes, edges };
}
