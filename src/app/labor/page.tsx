"use client";

import { useState } from "react";
import { useHomesteadStore } from "@/store/homestead-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function LaborPage() {
  const { labor, addLaborEntry } = useHomesteadStore();
  const [category, setCategory] =
    useState<"garden" | "livestock" | "general">("garden");
  const [task, setTask] = useState("");
  const [hours, setHours] = useState("1");

  const handleSubmit = () => {
    const h = Number(hours) || 0;
    if (!task || h <= 0) return;
    addLaborEntry({
      category,
      task,
      hours: h,
      date: new Date().toISOString(),
      notes: "",
    });
    setTask("");
    setHours("1");
  };

  const totalHours = labor.reduce((sum, e) => sum + e.hours, 0);

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Log labor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(val: any) => setCategory(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="garden">Garden</SelectItem>
                <SelectItem value="livestock">Livestock</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Task</Label>
            <Input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Weeding, feeding chickens, cleaning coop..."
            />
          </div>
          <div className="space-y-1">
            <Label>Hours</Label>
            <Input
              type="number"
              min={0}
              step="0.25"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit}>Add entry</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-medium">
            Total logged hours: <span className="font-semibold">{totalHours.toFixed(1)}</span>
          </p>
          <div className="max-h-64 space-y-1 overflow-y-auto rounded border p-2">
            {labor.slice().reverse().map((entry) => (
              <div key={entry.id} className="border-b pb-1 last:border-0">
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.date).toLocaleString()} · {entry.category}
                </p>
                <p className="text-sm">{entry.task}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.hours.toFixed(2)} h
                </p>
              </div>
            ))}
            {labor.length === 0 && (
              <p className="text-xs text-muted-foreground">No entries yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
