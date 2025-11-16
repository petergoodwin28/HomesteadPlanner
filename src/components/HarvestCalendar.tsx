// components/HarvestCalendar.tsx
"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parsePlantingWindow } from "@/lib/utils/yield-calculations";
import type { Crop } from "@/store/homestead-store";

interface HarvestEvent {
  cropName: string;
  plantingStart: Date;
  plantingEnd: Date;
  harvestStart: Date;
  harvestEnd: Date;
  season: string;
  color: string;
}

const SEASON_COLORS: Record<string, string> = {
  spring: "#10b981",
  summer: "#f59e0b",
  fall: "#ef4444",
  winter: "#3b82f6",
  "year-round": "#8b5cf6",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

interface HarvestCalendarProps {
  crops: Crop[];
}

export default function HarvestCalendar({ crops }: HarvestCalendarProps) {
  const events = useMemo(() => {
    const harvestEvents: HarvestEvent[] = [];

    crops.forEach((crop) => {
      if (!crop.plantingWindowStart || !crop.daysToHarvest) return;

      try {
        const plantingStart = parsePlantingWindow(crop.plantingWindowStart);
        const plantingEnd = crop.plantingWindowEnd 
          ? parsePlantingWindow(crop.plantingWindowEnd)
          : new Date(plantingStart.getTime() + 14 * 24 * 60 * 60 * 1000); // +2 weeks

        const harvestStart = new Date(plantingStart);
        harvestStart.setDate(harvestStart.getDate() + crop.daysToHarvest);

        const harvestEnd = new Date(harvestStart);
        harvestEnd.setDate(harvestEnd.getDate() + (crop.harvestWindowDays || 14));

        harvestEvents.push({
          cropName: crop.name,
          plantingStart,
          plantingEnd,
          harvestStart,
          harvestEnd,
          season: crop.season,
          color: SEASON_COLORS[crop.season] || "#gray",
        });
      } catch (e) {
        console.warn(`Could not parse planting window for ${crop.name}`);
      }
    });

    return harvestEvents.sort((a, b) => a.harvestStart.getTime() - b.harvestStart.getTime());
  }, [crops]);

  // Group by month for timeline view
  const eventsByMonth = useMemo(() => {
    const monthMap: Record<number, HarvestEvent[]> = {};

    events.forEach((event) => {
      const month = event.harvestStart.getMonth();
      if (!monthMap[month]) monthMap[month] = [];
      monthMap[month].push(event);
    });

    return monthMap;
  }, [events]);

  if (crops.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Harvest Calendar</CardTitle>
        <CardDescription>
          When your crops will be ready to harvest (based on planting windows and days to maturity)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Timeline visualization */}
        <div className="space-y-3">
          {MONTHS.map((month, idx) => {
            const monthEvents = eventsByMonth[idx] || [];
            
            if (monthEvents.length === 0) {
              return (
                <div key={month} className="flex items-center gap-3 text-sm opacity-40">
                  <div className="w-12 font-semibold">{month}</div>
                  <div className="flex-1 h-8 border-l-2 border-dashed border-muted-foreground/20" />
                </div>
              );
            }

            return (
              <div key={month} className="flex items-start gap-3 text-sm">
                <div className="w-12 font-semibold pt-1">{month}</div>
                <div className="flex-1">
                  <div className="space-y-2">
                    {monthEvents.map((event, eventIdx) => (
                      <div
                        key={`${event.cropName}-${eventIdx}`}
                        className="flex items-center gap-2 p-2 rounded-md border"
                        style={{ 
                          borderLeftWidth: 4, 
                          borderLeftColor: event.color,
                          backgroundColor: event.color + "10"
                        }}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{event.cropName}</p>
                          <p className="text-xs text-muted-foreground">
                            Ready: {event.harvestStart.toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric' 
                            })} - {event.harvestEnd.toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {event.season}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t space-y-2 text-sm">
          <p className="font-semibold">Harvest Summary:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(SEASON_COLORS).map(([season, color]) => {
              const count = events.filter(e => e.season === season).length;
              if (count === 0) return null;
              
              return (
                <div key={season} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="capitalize text-xs">
                    {season}: {count} crop{count !== 1 ? 's' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}