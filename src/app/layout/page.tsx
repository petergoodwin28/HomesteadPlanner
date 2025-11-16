"use client";

import { useState } from "react";
import { useHomesteadStore } from "@/store/homestead-store";
import CropVisual from "@/components/garden/CropVisual";

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

/* -----------------------------------------------------
   Types
----------------------------------------------------- */

type CellCropId = string | null;

/* -----------------------------------------------------
   Drag Item Types
----------------------------------------------------- */

type DragItem =
  | { type: "crop"; cropId: string }
  | { type: "cell"; cropId: string; bedId: string; index: number };

/* -----------------------------------------------------
   Sortable Crop (left panel)
----------------------------------------------------- */

function SortableCropItem({
  crop,
}: {
  crop: { id: string; name: string };
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: crop.id,
      data: { type: "crop", cropId: crop.id } satisfies DragItem,
    });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 rounded-md border cursor-grab bg-white dark:bg-neutral-900"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <CropVisual name={crop.name} size="md" />
      <span className="text-sm font-medium">{crop.name}</span>
    </div>
  );
}

/* -----------------------------------------------------
   Sortable Grid Cell
----------------------------------------------------- */

function GridCell({
  bedId,
  index,
  cellCropId,
}: {
  bedId: string;
  index: number;
  cellCropId: CellCropId;
}) {
  const crops = useHomesteadStore((s) => s.crops);

  // Convert cellCropId → Crop | null safely
  const crop =
    typeof cellCropId === "string" && cellCropId.length > 0
      ? crops.find((c) => c.id === cellCropId) ?? null
      : null;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `cell-${bedId}-${index}`,
      data: {
        type: "cell",
        bedId,
        index,
        cropId: crop?.id ?? "",
      } satisfies DragItem,
    });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center justify-center border text-xs bg-neutral-50 dark:bg-neutral-800 cursor-pointer"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        minHeight: "28px",
      }}
    >
      {crop ? <CropVisual name={crop.name} size="sm" /> : null}
    </div>
  );
}

/* -----------------------------------------------------
   Layout Page
----------------------------------------------------- */

export default function GardenLayoutPage() {
  const {
    crops,
    beds,
    assignCropToBed,
    assignCropToCell,
    settings,
    syncBedCountWithSettings,
  } = useHomesteadStore();

  const [expandedBed, setExpandedBed] = useState<string | null>(null);

  /* Sync number of beds if changed in settings */
  if (beds.length !== settings.numberOfBeds) {
    syncBedCountWithSettings(settings.numberOfBeds);
  }

  /* -----------------------------------------------------
     DnD Setup
  ----------------------------------------------------- */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const data = active.data.current as DragItem | undefined;

    if (!data) return;

    /* Dropping crop onto a bed (macro-level assignment) */
    if (over.data?.current?.type === "bed") {
      if (data.type === "crop") {
        assignCropToBed(over.id as string, data.cropId);
      }
      return;
    }

    /* Dropping onto a grid cell (micro-level assignment) */
    if (over.data?.current?.type === "cell") {
      if (data.type === "crop") {
        // crop → cell
        assignCropToCell(
          over.data.current.bedId,
          over.data.current.index,
          data.cropId
        );
      } else if (data.type === "cell") {
        // move / replace functionality
        assignCropToCell(
          over.data.current.bedId,
          over.data.current.index,
          data.cropId
        );
      }
      return;
    }
  };

  /* -----------------------------------------------------
     Render
  ----------------------------------------------------- */

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Garden Layout</CardTitle>
          <CardDescription>
            Drag crops into beds or individual grid squares.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid lg:grid-cols-[260px_1fr] gap-6">
              {/* -------------------------------------------
                   LEFT COLUMN — Available Crops
              -------------------------------------------- */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Crops</h3>

                <SortableContext items={crops.map((c) => c.id)}>
                  <div className="space-y-2">
                    {crops.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add crops in the Crops page to use them here.
                      </p>
                    )}

                    {crops.map((c) => (
                      <SortableCropItem key={c.id} crop={c} />
                    ))}
                  </div>
                </SortableContext>
              </div>

              {/* -------------------------------------------
                   RIGHT COLUMN — Beds
              -------------------------------------------- */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Beds</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {beds.map((bed) => {
                    const isExpanded = expandedBed === bed.id;

                    return (
                      <Card
                        key={bed.id}
                        className="p-2"
                        data-type="bed"
                        data-id={bed.id}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            Bed #{beds.indexOf(bed) + 1}
                          </span>

                          <button
                            className="text-[11px] text-primary underline"
                            onClick={() =>
                              setExpandedBed(
                                isExpanded ? null : bed.id
                              )
                            }
                          >
                            {isExpanded ? "Close" : "Edit"}
                          </button>
                        </div>

                        <Separator className="my-2" />

                        {/* Assigned crops (macro) */}
                        <div className="flex gap-1 flex-wrap">
                          {bed.crops.map((cropId) => {
                            const crop = crops.find(
                              (c) => c.id === cropId
                            );
                            return crop ? (
                              <div
                                key={crop.id}
                                className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded text-xs flex items-center gap-1"
                              >
                                <CropVisual name={crop.name} size="sm" />
                                {crop.name}
                              </div>
                            ) : null;
                          })}

                          {bed.crops.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                              Drag a crop here
                            </p>
                          )}
                        </div>

                        {/* Expandable grid (micro mode) */}
                        {isExpanded && (
                          <div className="mt-3 grid grid-cols-8 gap-[1px] p-1 border rounded-md">
                            <SortableContext
                              items={bed.grid.map(
                                (_, idx) => `cell-${bed.id}-${idx}`
                              )}
                            >
                              {bed.grid.map((cellCropId, idx) => (
                                <GridCell
                                  key={`cell-${bed.id}-${idx}`}
                                  bedId={bed.id}
                                  index={idx}
                                  cellCropId={cellCropId}
                                />
                              ))}
                            </SortableContext>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
