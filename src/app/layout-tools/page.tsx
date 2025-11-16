"use client";

import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useHomesteadStore } from "@/store/homestead-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BedSlot {
  id: string;
  label: string;
  cropId?: string;
}

function DraggableCrop({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-full border bg-muted px-3 py-1 text-xs hover:bg-muted/80"
    >
      {name}
    </div>
  );
}

function DroppableBed({
  slot,
  cropName,
}: {
  slot: BedSlot;
  cropName?: string;
}) {
  return (
    <div className="flex h-20 flex-col justify-between rounded-md border bg-background p-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-medium">{slot.label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {cropName ?? "Empty"}
        </span>
      </div>
    </div>
  );
}

export default function LayoutToolsPage() {
  const { crops } = useHomesteadStore();

  const cropTokens = crops.map((c) => ({ id: c.id, name: c.name }));

  const [beds, setBeds] = useState<BedSlot[]>([
    { id: "bed-1", label: "Bed 1" },
    { id: "bed-2", label: "Bed 2" },
    { id: "bed-3", label: "Bed 3" },
    { id: "bed-4", label: "Bed 4" },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    // If dropping a crop token on a bed slot
    if (over.id.toString().startsWith("bed-") && !active.id.toString().startsWith("bed-")) {
      setBeds((prev) =>
        prev.map((bed) =>
          bed.id === over.id ? { ...bed, cropId: active.id.toString() } : bed
        )
      );
    }

    // Future: rearranging beds themselves
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Garden layout</h2>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Available crops</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-muted-foreground">
              Drag a crop and drop it onto a bed on the right to assign it.
            </p>
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={cropTokens.map((c) => c.id)}
                strategy={rectSortingStrategy}
              >
                <div className="flex flex-wrap gap-2">
                  {cropTokens.map((crop) => (
                    <DraggableCrop key={crop.id} id={crop.id} name={crop.name} />
                  ))}
                </div>
              </SortableContext>

              <div className="mt-4 space-y-2">
                <p className="font-medium">Legend</p>
                <p className="text-muted-foreground">
                  This is a visual planning tool only for now – it doesn&apos;t
                  change yield calculations yet. You can extend it later to tie
                  into your crop beds and seasons.
                </p>
              </div>
            </DndContext>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <DndContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-2 gap-3">
                {beds.map((bed) => {
                  const cropName =
                    bed.cropId &&
                    crops.find((c) => c.id === (bed.cropId as any))?.name;
                  return (
                    <div key={bed.id} id={bed.id}>
                      <DroppableBed slot={bed} cropName={cropName} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                You can change the number/names of beds by editing this page
                later to reflect your real layout (e.g., &quot;Bed 1 – front
                left&quot;, &quot;Bed 2 – shade&quot;).
              </div>
            </DndContext>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
