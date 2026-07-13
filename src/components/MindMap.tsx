"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toPng } from "html-to-image";
import {
  PlusIcon,
  GitBranchIcon,
  Trash2Icon,
  DownloadIcon,
  UploadIcon,
  ImageDownIcon,
  RotateCcwIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/template/tool-shell";
import { downloadBlob, downloadDataUrl } from "@/lib/download";
import {
  NODE_COLORS,
  STORAGE_KEY,
  createInitialState,
  addChildNode as addChild,
  addSiblingNode as addSibling,
  deleteNode as deleteNodeFn,
  exportToJSON,
  importFromJSON,
  nextEdgeId,
  type MindMapNode,
  type MindMapEdge,
  type MindMapState,
} from "@/lib/mind-map";

interface NodeData {
  label: string;
  color: string;
  [key: string]: unknown;
}

type FlowNode = Node<NodeData>;

// ── Custom node ───────────────────────────────────────────────────────────────
function MindMapNode({ id, data, selected }: NodeProps) {
  const nodeData = data as NodeData;
  const { setNodes } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(nodeData.label);

  useEffect(() => {
    setValue(nodeData.label);
  }, [nodeData.label]);

  const commit = useCallback(() => {
    setEditing(false);
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, label: value } }
          : n,
      ),
    );
  }, [id, value, setNodes]);

  return (
    <div
      className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md min-w-[120px] max-w-[260px] text-center"
      style={{
        backgroundColor: nodeData.color,
        outline: selected ? "2px solid hsl(var(--ring))" : "none",
        outlineOffset: 2,
      }}
      data-testid="mind-map-node"
      onDoubleClick={() => setEditing(true)}
    >
      <Handle type="target" position={Position.Left} />
      {editing ? (
        <input
          autoFocus
          value={value}
          dir="auto"
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setValue(nodeData.label);
              setEditing(false);
            }
          }}
          className="w-full bg-transparent text-center outline-none placeholder:text-white/60"
        />
      ) : (
        <span dir="auto" className="break-words">
          {nodeData.label || "…"}
        </span>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// ── Editor ──────────────────────────────────────────────────────────────────
function MindMapEditor() {
  const t = useTranslations("Tools.MindMap");
  const tc = useTranslations("ToolsConfig");
  const nodeTypes = useMemo(() => ({ mindMapNode: MindMapNode }), []);

  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const flowWrapper = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);

  // Load from localStorage once on mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = importFromJSON(stored);
        setNodes(parsed.nodes as unknown as FlowNode[]);
        setEdges(parsed.edges as unknown as Edge[]);
      } else {
        const initial = createInitialState(t("rootLabel"));
        setNodes(initial.nodes as unknown as FlowNode[]);
        setEdges(initial.edges as unknown as Edge[]);
      }
    } catch {
      const initial = createInitialState(t("rootLabel"));
      setNodes(initial.nodes as unknown as FlowNode[]);
      setEdges(initial.edges as unknown as Edge[]);
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!hydrated.current) return;
    const state: MindMapState = {
      nodes: nodes as unknown as MindMapNode[],
      edges: edges as unknown as MindMapEdge[],
    };
    localStorage.setItem(STORAGE_KEY, exportToJSON(state));
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as FlowNode[]),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge({ ...connection, id: nextEdgeId() }, eds),
      ),
    [],
  );

  const currentState = (): MindMapState => ({
    nodes: nodes as unknown as MindMapNode[],
    edges: edges as unknown as MindMapEdge[],
  });

  const applyState = (next: MindMapState) => {
    setNodes(next.nodes as unknown as FlowNode[]);
    setEdges(next.edges as unknown as Edge[]);
  };

  const targetId = selectedId ?? nodes[0]?.id ?? null;

  const handleAddChild = () => {
    if (!targetId) return;
    applyState(addChild(currentState(), targetId, t("newNodeLabel")));
  };

  const handleAddSibling = () => {
    if (!targetId) return;
    applyState(addSibling(currentState(), targetId, t("newNodeLabel")));
  };

  const handleDelete = () => {
    if (!selectedId) {
      toast.error(t("selectFirst"));
      return;
    }
    if (selectedId === "root") {
      toast.error(t("cannotDeleteRoot"));
      return;
    }
    applyState(deleteNodeFn(currentState(), selectedId));
    setSelectedId(null);
  };

  const handleColor = (color: string) => {
    const id = selectedId;
    if (!id) {
      toast.error(t("selectFirst"));
      return;
    }
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, color } } : n,
      ),
    );
  };

  const handleExportJSON = () => {
    const json = exportToJSON(currentState());
    downloadBlob(new Blob([json], { type: "application/json" }), "mind-map.json");
    toast.success(t("exportedJSON"));
  };

  const handleImportJSON = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      applyState(importFromJSON(text));
      toast.success(t("importedJSON"));
    } catch {
      toast.error(t("invalidFile"));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExportPNG = async () => {
    const el = flowWrapper.current?.querySelector(
      ".react-flow__viewport",
    ) as HTMLElement | null;
    if (!el) return;
    try {
      const dataUrl = await toPng(el, {
        // content value: exported PNG background fill (always white, independent of app theme)
        backgroundColor: "#ffffff",
        cacheBust: true,
      });
      downloadDataUrl(dataUrl, "mind-map.png");
      toast.success(t("exportedPNG"));
    } catch {
      toast.error(t("pngFailed"));
    }
  };

  const handleReset = () => {
    const initial = createInitialState(t("rootLabel"));
    applyState(initial);
    setSelectedId(null);
    toast.success(t("resetDone"));
  };

  return (
    <ToolShell
      slug="mind-map"
      title={tc("tools.mind-map.name")}
      sub={tc("tools.mind-map.description")}
      width="wide"
    >
      <div className="max-w-6xl mx-auto space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Toolbar — flips for RTL via flex + logical spacing */}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={handleAddChild} data-testid="add-child">
              <PlusIcon className="h-4 w-4 me-2" />
              {t("addChild")}
            </Button>
            <Button size="sm" variant="outline" onClick={handleAddSibling}>
              <GitBranchIcon className="h-4 w-4 me-2" />
              {t("addSibling")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              data-testid="delete-node"
            >
              <Trash2Icon className="h-4 w-4 me-2" />
              {t("delete")}
            </Button>

            <span className="mx-1 h-5 w-px bg-border" aria-hidden />

            <div className="flex items-center gap-1.5">
              {NODE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColor(color)}
                  className="h-6 w-6 rounded-full border border-border transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  aria-label={`${t("setColor")} ${color}`}
                  data-testid="color-swatch"
                />
              ))}
            </div>

            <span className="mx-1 h-5 w-px bg-border" aria-hidden />

            <Button size="sm" variant="outline" onClick={handleExportJSON}>
              <DownloadIcon className="h-4 w-4 me-2" />
              {t("exportJSON")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="h-4 w-4 me-2" />
              {t("importJSON")}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportJSON}
              aria-label={t("importJSON")}
            />
            <Button size="sm" variant="outline" onClick={handleExportPNG}>
              <ImageDownIcon className="h-4 w-4 me-2" />
              {t("exportPNG")}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcwIcon className="h-4 w-4 me-2" />
              {t("reset")}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">{t("hint")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {/* Canvas stays LTR; nodes carry dir="auto" for Arabic labels */}
          <div
            ref={flowWrapper}
            dir="ltr"
            className="h-[60vh] w-full rounded-lg overflow-hidden"
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedId(node.id)}
              onPaneClick={() => setSelectedId(null)}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <Background />
              <Controls />
              <MiniMap pannable zoomable />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>
      </div>
    </ToolShell>
  );
}

export default function MindMap() {
  return (
    <ReactFlowProvider>
      <MindMapEditor />
    </ReactFlowProvider>
  );
}
