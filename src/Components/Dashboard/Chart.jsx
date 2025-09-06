import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "components/ui/chart";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// === DEMO DATA ===
const rawData = [
  { date: "2025-08-09", people: 6 },
  { date: "2025-08-11", people: 12 },
  { date: "2025-08-13", people: 6 },
  { date: "2025-08-15", people: 6 },
  { date: "2025-08-18", people: 6 },
  { date: "2025-08-20", people: 6 },
  { date: "2025-08-22", people: 6 },
  { date: "2025-08-25", people: 12 },
  { date: "2025-08-28", people: 6 },
  { date: "2025-08-30", people: 0 },
  { date: "2025-09-03", people: 0 },
];

// Chart config
const chartConfig = {
  people: { label: "People", color: "#2563eb" },
};

// Helpers
function fmtLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric" });
}
function addDaysISO(iso, n) {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function inRangeISO(iso, start, end) {
  return (!start || iso >= start) && (!end || iso <= end);
}
function fmtRangePretty(startIso, endIso) {
  const s = new Date(startIso).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const e = new Date(endIso).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  return `${s} - ${e}`;
}

// Calendar icon
const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      fill="none"
      stroke="currentColor"
    />
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" fill="none" />
  </svg>
);

export function ChartInteractive() {
  const [preset, setPreset] = useState("30d");
  const [start, setStart] = useState("2025-08-07");
  const [end, setEnd] = useState("2025-09-06");
  const [open, setOpen] = useState(false);

  const computedRange = useMemo(() => {
    if (preset === "custom") return { start, end };
    const endIso = end;
    const map = { "1d": 1, "3d": 3, "7d": 7, "30d": 30 };
    const days = map[preset] ?? 30;
    const startIso = addDaysISO(endIso, -days + 1);
    return { start: startIso, end: endIso };
  }, [preset, start, end]);

  const data = useMemo(
    () =>
      rawData
        .filter((d) =>
          inRangeISO(d.date, computedRange.start, computedRange.end)
        )
        .map((d) => ({ ...d, label: fmtLabel(d.date) })),
    [computedRange]
  );

  const totalPeople = useMemo(
    () => data.reduce((s, d) => s + (d.people || 0), 0),
    [data]
  );
  const totalCompanies = 23;

  const onSelectRange = (range) => {
    if (!range?.from || !range?.to) return;
    const s = range.from.toISOString().slice(0, 10);
    const e = range.to.toISOString().slice(0, 10);
    setStart(s);
    setEnd(e);
    setPreset("custom");
    setOpen(false);
  };

  const rangeLabel = fmtRangePretty(computedRange.start, computedRange.end);

  return (
    <div className="w-full rounded-xl  p-4 sm:p-6 text-white">
      {/* Row: preset + date range */}
      <div className="mb-4 flex flex-wrap items-center gap-6 border rounded-xl">
        <div className="flex gap-4 text-sm text-white/60 p-2">
          {["1d", "3d", "7d", "30d"].map((key) => (
            <span
              key={key}
              onClick={() => setPreset(key)}
              className={
                "cursor-pointer select-none " +
                (preset === key
                  ? "font-bold text-white"
                  : "hover:text-white/80")
              }
            >
              {key}
            </span>
          ))}
          <span
            onClick={() => setPreset("custom")}
            className={
              "cursor-pointer select-none " +
              (preset === "custom"
                ? "font-bold text-white"
                : "hover:text-white/80")
            }
          >
            Custom
          </span>
        </div>

        {/* Date range picker */}
        <div className="ml-auto p-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-sm hover:bg-white/5"
                onClick={() => setOpen(true)}
              >
                <span className="inline-flex -mt-[1px] text-white/80">
                  <CalendarIcon />
                </span>
                <span className="text-white/90">{rangeLabel}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-auto border-white/15 bg-[#0b0b0e] text-white"
            >
              <Calendar
                mode="range"
                numberOfMonths={2}
                defaultMonth={new Date(end)}
                selected={{
                  from: new Date(computedRange.start),
                  to: new Date(computedRange.end),
                }}
                onSelect={onSelectRange}
              
                classNames={{
                 
                  caption: "text-white font-semibold text-center mb-2",
                  head_cell: "text-white/60 w-8 text-sm",
                  day:"w-8 h-8",
                  day_selected: "bg-blue-600 text-white rounded-md",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Header */}

      <div className="border rounded-xl p-2">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Lead generation</div>
            <div className="text-sm text-white/60">
              New contacts added to the pool.
            </div>
          </div>

          <div className="flex overflow-hidden rounded-xl border border-white/10">
            <div className="px-4 py-3 bg-white/[0.04]">
              <div className="text-xs uppercase tracking-wide text-white/60">
                People
              </div>
              <div className="text-2xl font-bold leading-none">
                {totalPeople}
              </div>
            </div>
            <div className="px-4 py-3 bg-white/[0.02] border-l border-white/10">
              <div className="text-xs uppercase tracking-wide text-white/60">
                Companies
              </div>
              <div className="text-2xl font-bold leading-none">
                {totalCompanies}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="h-[320px] w-full rounded-xl   px-2 sm:px-4"
        >
          <BarChart data={data} barCategoryGap={18}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
              strokeDasharray="0"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => [`${value}`, "People"]}
                />
              }
            />
            <Bar
              dataKey="people"
              fill="var(--color-people)"
              radius={[6, 6, 0, 0]}
              maxBarSize={26}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
