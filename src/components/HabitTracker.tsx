"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Check, Flame, Trophy, Edit2, X, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completions: string[];
}

const STORAGE_KEY = "bt_habits";

const PRESET_EMOJIS = ["💪", "📚", "🏃", "💧", "🧘", "🥗", "😴", "✍️", "🎯", "🌿"];
const COLORS = [
  { name: "blue", label: "Blue", tw: "bg-blue-500", ring: "ring-blue-400", light: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  { name: "green", label: "Green", tw: "bg-green-500", ring: "ring-green-400", light: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
  { name: "purple", label: "Purple", tw: "bg-purple-500", ring: "ring-purple-400", light: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
  { name: "orange", label: "Orange", tw: "bg-orange-500", ring: "ring-orange-400", light: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  { name: "rose", label: "Rose", tw: "bg-rose-500", ring: "ring-rose-400", light: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-300" },
  { name: "teal", label: "Teal", tw: "bg-teal-500", ring: "ring-teal-400", light: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-300" },
];

// Day index to translation key mapping (0=Sun, 1=Mon, ... 6=Sat)
const DAY_KEYS = ["daySun", "dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat"] as const;

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(getDateStr(d));
  }
  return days;
}

function calcCurrentStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const set = new Set(completions);
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (set.has(getDateStr(d))) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calcLongestStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const sorted = [...completions].sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diff > 1) {
      current = 1;
    }
  }
  return longest;
}

function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHabits(habits: Habit[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {}
}

function getColorObj(name: string) {
  return COLORS.find((c) => c.name === name) ?? COLORS[0];
}

export default function HabitTracker() {
  const t = useTranslations("Tools.HabitTracker");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState(PRESET_EMOJIS[0]);
  const [newColor, setNewColor] = useState(COLORS[0].name);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setHabits(loadHabits());
  }, []);

  const persist = useCallback((updated: Habit[]) => {
    setHabits(updated);
    saveHabits(updated);
  }, []);

  const addHabit = () => {
    if (!newName.trim()) {
      toast.error(t("enterHabitName"));
      return;
    }
    const habit: Habit = {
      id: Date.now().toString(),
      name: newName.trim(),
      emoji: newEmoji,
      color: newColor,
      createdAt: new Date().toISOString(),
      completions: [],
    };
    persist([...habits, habit]);
    setNewName("");
    setNewEmoji(PRESET_EMOJIS[0]);
    setNewColor(COLORS[0].name);
    setShowAdd(false);
    toast.success(t("habitAdded", { name: habit.name }));
  };

  const toggleToday = (id: string) => {
    const today = getTodayStr();
    const updated = habits.map((h) => {
      if (h.id !== id) return h;
      const done = h.completions.includes(today);
      return {
        ...h,
        completions: done
          ? h.completions.filter((d) => d !== today)
          : [...h.completions, today],
      };
    });
    persist(updated);
  };

  const deleteHabit = (id: string, name: string) => {
    if (!confirm(t("confirmDelete", { name }))) return;
    persist(habits.filter((h) => h.id !== id));
    toast.success(t("habitDeleted"));
  };

  const startEdit = (h: Habit) => {
    setEditingId(h.id);
    setEditName(h.name);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    persist(habits.map((h) => (h.id === id ? { ...h, name: editName.trim() } : h)));
    setEditingId(null);
    toast.success(t("habitUpdated"));
  };

  const today = getTodayStr();
  const last7 = getLast7Days();

  const stats = useMemo(() => {
    const total = habits.length;
    const completedToday = habits.filter((h) => h.completions.includes(today)).length;
    const rate = total > 0 ? Math.round((completedToday / total) * 100) : 0;
    const longestActive = habits.reduce((max, h) => {
      const streak = calcCurrentStreak(h.completions);
      return Math.max(max, streak);
    }, 0);
    return { total, completedToday, rate, longestActive };
  }, [habits, today]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("title")}</h1>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
          <Button onClick={() => setShowAdd((v) => !v)} variant={showAdd ? "outline" : "default"}>
            {showAdd ? <><X className="w-4 h-4 mr-2" />{t("cancel")}</> : <><Plus className="w-4 h-4 mr-2" />{t("addHabit")}</>}
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("totalHabits")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-green-500">{stats.rate}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("doneToday")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5" />{stats.longestActive}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("bestStreak")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Habit Form */}
        {showAdd && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("newHabit")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>{t("habitName")}</Label>
                <Input
                  placeholder={t("habitNamePlaceholder")}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addHabit()}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("emoji")}</Label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_EMOJIS.map((em) => (
                    <button
                      key={em}
                      onClick={() => setNewEmoji(em)}
                      className={`text-2xl w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                        newEmoji === em ? "border-primary bg-primary/10 scale-110" : "border-transparent hover:border-border"
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t("color")}</Label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setNewColor(c.name)}
                      className={`w-8 h-8 rounded-full ${c.tw} transition-all ${
                        newColor === c.name ? `ring-2 ring-offset-2 ${c.ring} scale-110` : "opacity-70 hover:opacity-100"
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={addHabit} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {t("addHabit")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Habits List */}
        {habits.length === 0 && !showAdd && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <p className="text-muted-foreground">{t("noHabitsYet")}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {habits.map((habit) => {
            const colorObj = getColorObj(habit.color);
            const doneToday = habit.completions.includes(today);
            const currentStreak = calcCurrentStreak(habit.completions);
            const longestStreak = calcLongestStreak(habit.completions);
            const isEditing = editingId === habit.id;

            return (
              <Card key={habit.id} className={`transition-all ${doneToday ? "ring-1 ring-green-400 dark:ring-green-600" : ""}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleToday(habit.id)}
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all border-2 ${
                        doneToday
                          ? `${colorObj.tw} border-transparent text-white shadow-md scale-105`
                          : "border-border hover:border-primary bg-muted/30 hover:bg-muted/60"
                      }`}
                      title={doneToday ? t("markIncomplete") : t("markDone")}
                    >
                      {doneToday ? <Check className="w-5 h-5 text-white" /> : habit.emoji}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(habit.id); if (e.key === "Escape") setEditingId(null); }}
                              className="h-7 text-sm flex-1"
                              autoFocus
                            />
                            <Button size="sm" className="h-7 px-2" onClick={() => saveEdit(habit.id)}>{t("save")}</Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditingId(null)}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="font-medium text-sm leading-tight flex items-center gap-2">
                            {habit.emoji} {habit.name}
                            {doneToday && <Badge className="bg-green-500 text-white text-xs py-0 px-1.5">{t("done")}</Badge>}
                          </span>
                        )}
                      </div>

                      {/* 7-day mini calendar */}
                      <div className="flex gap-1 mt-2 items-center">
                        {last7.map((day) => {
                          const done = habit.completions.includes(day);
                          const isToday = day === today;
                          const dayIndex = new Date(day + "T12:00:00").getDay();
                          const dayKey = DAY_KEYS[dayIndex];
                          return (
                            <div key={day} className="flex flex-col items-center gap-0.5">
                              <span className="text-[9px] text-muted-foreground">
                                {t(dayKey)}
                              </span>
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                  done
                                    ? `${colorObj.tw} text-white`
                                    : isToday
                                    ? "border-2 border-primary"
                                    : "bg-muted/50"
                                }`}
                              >
                                {done && <Check className="w-3 h-3" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Streaks */}
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span dir="ltr">{currentStreak}</span> {t("dayStreak")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-yellow-500" />
                          <span dir="ltr">{longestStreak}</span> {t("best")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => startEdit(habit)}
                        title={t("editName")}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-destructive hover:text-destructive"
                        onClick={() => deleteHabit(habit.id, habit.name)}
                        title={t("deleteHabit")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
