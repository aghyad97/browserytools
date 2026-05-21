import { describe, it, expect } from "vitest";
import {
  createInitialState,
  addChildNode,
  addSiblingNode,
  renameNode,
  setNodeColor,
  deleteNode,
  connectNodes,
  exportToJSON,
  importFromJSON,
  NODE_COLORS,
} from "@/lib/mind-map";

// React Flow is hard to render in happy-dom (ResizeObserver, viewport measuring),
// so we test the underlying node/edge state logic that the component drives.

describe("MindMap state logic", () => {
  it("starts with a single root node and no edges", () => {
    const state = createInitialState("Main Idea");
    expect(state.nodes).toHaveLength(1);
    expect(state.nodes[0].id).toBe("root");
    expect(state.nodes[0].data.label).toBe("Main Idea");
    expect(state.edges).toHaveLength(0);
  });

  it("adds a child node connected to its parent", () => {
    let state = createInitialState("Root");
    state = addChildNode(state, "root", "Child A");

    expect(state.nodes).toHaveLength(2);
    expect(state.edges).toHaveLength(1);
    const child = state.nodes.find((n) => n.id !== "root")!;
    expect(child.data.label).toBe("Child A");
    expect(state.edges[0].source).toBe("root");
    expect(state.edges[0].target).toBe(child.id);
  });

  it("adds a sibling as a child of the same parent", () => {
    let state = createInitialState("Root");
    state = addChildNode(state, "root", "Child A");
    const childId = state.nodes.find((n) => n.id !== "root")!.id;

    state = addSiblingNode(state, childId, "Child B");
    // Two children both connected to root.
    expect(state.nodes).toHaveLength(3);
    const rootEdges = state.edges.filter((e) => e.source === "root");
    expect(rootEdges).toHaveLength(2);
  });

  it("renames a node label", () => {
    let state = createInitialState("Root");
    state = renameNode(state, "root", "Renamed");
    expect(state.nodes[0].data.label).toBe("Renamed");
  });

  it("changes a node color", () => {
    let state = createInitialState("Root");
    state = setNodeColor(state, "root", NODE_COLORS[2]);
    expect(state.nodes[0].data.color).toBe(NODE_COLORS[2]);
  });

  it("deletes a node and its connecting edges", () => {
    let state = createInitialState("Root");
    state = addChildNode(state, "root", "Child A");
    const childId = state.nodes.find((n) => n.id !== "root")!.id;

    state = deleteNode(state, childId);
    expect(state.nodes).toHaveLength(1);
    expect(state.nodes[0].id).toBe("root");
    expect(state.edges).toHaveLength(0);
  });

  it("never deletes the root node", () => {
    let state = createInitialState("Root");
    state = deleteNode(state, "root");
    expect(state.nodes).toHaveLength(1);
    expect(state.nodes[0].id).toBe("root");
  });

  it("connects two existing nodes without duplicating", () => {
    let state = createInitialState("Root");
    state = addChildNode(state, "root", "A");
    state = addChildNode(state, "root", "B");
    const [a, b] = state.nodes.filter((n) => n.id !== "root");

    state = connectNodes(state, a.id, b.id);
    const edgeCount = state.edges.length;
    // Connecting the same pair again is a no-op.
    state = connectNodes(state, a.id, b.id);
    expect(state.edges).toHaveLength(edgeCount);
    // Self-connection is rejected.
    state = connectNodes(state, a.id, a.id);
    expect(state.edges).toHaveLength(edgeCount);
  });

  it("exports to JSON and round-trips back to equivalent state", () => {
    let state = createInitialState("Root");
    state = addChildNode(state, "root", "Idea");
    const json = exportToJSON(state);

    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(parsed.nodes).toHaveLength(2);
    expect(parsed.edges).toHaveLength(1);

    const reimported = importFromJSON(json);
    expect(reimported.nodes).toHaveLength(2);
    expect(reimported.edges).toHaveLength(1);
    expect(reimported.nodes[1].data.label).toBe("Idea");
  });

  it("rejects malformed JSON on import", () => {
    expect(() => importFromJSON('{"foo":true}')).toThrow();
  });

  it("supports Arabic node labels", () => {
    let state = createInitialState("الفكرة الرئيسية");
    state = addChildNode(state, "root", "فرع جديد");
    expect(state.nodes[0].data.label).toBe("الفكرة الرئيسية");
    expect(state.nodes[1].data.label).toBe("فرع جديد");
    const round = importFromJSON(exportToJSON(state));
    expect(round.nodes[1].data.label).toBe("فرع جديد");
  });
});
