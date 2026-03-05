"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, Download, Upload, Search } from "lucide-react";

interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
}

const STORAGE_KEY = "browsery-prompt-library";

function loadPrompts(): Prompt[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function savePrompts(prompts: Prompt[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

export default function PromptLibrary() {
  const t = useTranslations("Tools.PromptLibrary");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [editing, setEditing] = useState<Prompt | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPrompts(loadPrompts());
  }, []);

  const allTags = [...new Set(prompts.flatMap((p) => p.tags))];

  const filtered = prompts.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q);
    const matchTag = tagFilter === "all" || p.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });

  const save = (updated: Prompt[]) => {
    setPrompts(updated);
    savePrompts(updated);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (editing) {
      save(
        prompts.map((p) =>
          p.id === editing.id
            ? { ...p, title: form.title, content: form.content, tags }
            : p
        )
      );
    } else {
      save([
        ...prompts,
        {
          id: crypto.randomUUID(),
          title: form.title,
          content: form.content,
          tags,
          createdAt: Date.now(),
        },
      ]);
    }
    setForm({ title: "", content: "", tags: "" });
    setEditing(null);
    setIsAdding(false);
  };

  const handleEdit = (p: Prompt) => {
    setEditing(p);
    setIsAdding(true);
    setForm({ title: p.title, content: p.content, tags: p.tags.join(", ") });
  };

  const handleDelete = (id: string) => {
    save(prompts.filter((p) => p.id !== id));
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success(t("copied"));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(prompts, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt-library.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as Prompt[];
        save([
          ...prompts,
          ...imported.filter((ip) => !prompts.some((p) => p.id === ip.id)),
        ]);
        toast.success(t("imported"));
      } catch {
        toast.error(t("importError"));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                setIsAdding(!isAdding);
                setEditing(null);
                setForm({ title: "", content: "", tags: "" });
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("addPrompt")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!prompts.length}
            >
              <Download className="h-4 w-4 mr-1" />
              {t("export")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-1" />
              {t("import")}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </CardContent>
      </Card>

      {isAdding && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>{t("promptTitle")}</Label>
              <Input
                dir="auto"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={t("titlePlaceholder")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("promptContent")}</Label>
              <Textarea
                dir="auto"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder={t("contentPlaceholder")}
                rows={5}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("promptTags")}</Label>
              <Input
                dir="auto"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder={t("tagsPlaceholder")}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                {t("save")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setEditing(null);
                }}
              >
                {t("cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            dir="auto"
            className="pl-9"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border rounded px-3 py-2 text-sm bg-background"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="all">{t("allTags")}</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {search || tagFilter !== "all" ? t("noResults") : t("noPrompts")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(p.content)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(p)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 font-mono whitespace-pre-wrap">
                  {p.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
