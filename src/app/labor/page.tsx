"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { useHomesteadStore } from "@/store/homestead-store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function LaborPage() {
  const { labor, addLabor, removeLabor, updateLabor } = useHomesteadStore();

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Garden");
  const [hours, setHours] = useState<number | "">("");
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const categories = ["Garden", "Livestock", "Maintenance", "Other"];

  const totalHours = labor.reduce((sum, e) => sum + e.hours, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Labor Tracking</CardTitle>
          <CardDescription>
            Track time spent on gardening, livestock, and general homestead tasks.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Add Labor Entry</h3>

            <div className="grid sm:grid-cols-4 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <Label>Category</Label>
                <select
                  className="border rounded-md p-2 text-sm bg-background"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Task */}
              <div className="space-y-1 sm:col-span-2">
                <Label>Task</Label>
                <Input
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Weeding, feeding goats, hive check..."
                />
              </div>

              {/* Hours */}
              <div className="space-y-1">
                <Label>Hours</Label>
                <Input
                  type="number"
                  value={hours}
                  min={0}
                  onChange={(e) =>
                    setHours(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="mt-2"
              disabled={!task || !hours}
              onClick={() => {
                addLabor({
                  category,
                  task,
                  hours: Number(hours),
                  date,
                });

                setTask("");
                setHours("");
              }}
            >
              Add Entry
            </Button>
          </div>

          <Separator />

          {/* Summary */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground">
              Total hours logged:{" "}
              <span className="font-semibold">{totalHours}</span>
            </p>
          </div>

          <Separator />

          {/* Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Entries</h3>

            <div className="divide-y border rounded-md">
              {labor.length === 0 && (
                <p className="text-sm p-3 text-muted-foreground">
                  No entries yet.
                </p>
              )}

              {labor.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-medium">{entry.task}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.category} • {entry.hours} hours • {entry.date}
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeLabor(entry.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
