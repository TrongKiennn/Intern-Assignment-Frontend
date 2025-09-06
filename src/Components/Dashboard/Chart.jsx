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
import { useTheme } from "../Context/ThemeProvider"; // lấy theme

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

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 🎨 màu theo theme
  const colors = {
    bg: isDark ? "#0b0b0e" : "#ffffff",
    text: isDark ? "#ffffff" : "#111111",
    textMuted: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
    border: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
    grid: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    tooltipBg: isDark ? "#1f2937" : "#f9fafb",
    tooltipText: isDark ? "#fff" : "#111",
    cursor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
  };

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
    <div
      className="w-full rounded-xl p-4 sm:p-6"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* Row: preset + date range */}
      <div
        className="mb-4 flex flex-wrap items-center gap-6 rounded-xl"
        style={{ border: `1px solid ${colors.border}` }}
      >
        <div
          className="flex gap-4 text-sm p-2"
          style={{ color: colors.textMuted }}
        >
          {["1d", "3d", "7d", "30d"].map((key) => (
            <span
              key={key}
              onClick={() => setPreset(key)}
              className={
                "cursor-pointer select-none " +
                (preset === key ? "font-bold" : "hover:opacity-80")
              }
              style={{ color: preset === key ? colors.text : colors.textMuted }}
            >
              {key}
            </span>
          ))}
          <span
            onClick={() => setPreset("custom")}
            className="cursor-pointer select-none"
            style={{
              color: preset === "custom" ? colors.text : colors.textMuted,
              fontWeight: preset === "custom" ? "bold" : "normal",
            }}
          >
            Custom
          </span>
        </div>

        {/* Date range picker */}
        <div className="ml-auto p-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
                style={{
                  backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "#f3f4f6",
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
                onClick={() => setOpen(true)}
              >
                <span
                  className="inline-flex -mt-[1px]"
                  style={{ color: colors.textMuted }}
                >
                  <CalendarIcon />
                </span>
                <span>{rangeLabel}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-auto"
              style={{
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bg,
                color: colors.text,
              }}
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
                  caption: "font-semibold text-center mb-2",
                  head_cell: "w-8 text-sm",
                  day: "w-8 h-8",
                  day_selected: "bg-blue-600 text-white rounded-md",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Header */}
      <div
        className="rounded-xl p-2"
        style={{ border: `1px solid ${colors.border}` }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Lead generation</div>
            <div className="text-sm" style={{ color: colors.textMuted }}>
              New contacts added to the pool.
            </div>
          </div>

          <div
            className="flex overflow-hidden rounded-xl"
            style={{ border: `1px solid ${colors.border}` }}
          >
            <div
              className="px-4 py-3"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#f3f4f6",
              }}
            >
              <div
                className="text-xs uppercase tracking-wide"
                style={{ color: colors.textMuted }}
              >
                People
              </div>
              <div className="text-2xl font-bold leading-none">
                {totalPeople}
              </div>
            </div>
            <div
              className="px-4 py-3 border-l"
              style={{
                borderColor: colors.border,
                backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#fafafa",
              }}
            >
              <div
                className="text-xs uppercase tracking-wide"
                style={{ color: colors.textMuted }}
              >
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
          className="h-[320px] w-full rounded-xl px-2 sm:px-4"
        >
          <BarChart data={data} barCategoryGap={18}>
            <CartesianGrid
              stroke={colors.grid}
              vertical={false}
              strokeDasharray="0"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: colors.textMuted, fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.textMuted, fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: colors.cursor }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => [`${value}`, "People"]}
                  style={{
                    backgroundColor: colors.tooltipBg,
                    color: colors.tooltipText,
                  }}
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
