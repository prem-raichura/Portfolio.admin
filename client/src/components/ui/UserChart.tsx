import React, { useMemo, useState } from "react";

function toPath(points: { x: number; y: number }[]) {
  if (!points.length) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

export default function UserChart() {
  const [range, setRange] = useState<"month" | "week">("month");

  const data = useMemo(() => {
    if (range === "month") {
      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        // Introduce realistic up/down fluctuations across months
        series: [12, 18, 14, 22, 16, 28, 24, 30, 26, 34, 29, 33],
      };
    }

    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [0, 1, 0, 2, 1, 0, 0].map((n, i) => 1 + Math.round(Math.abs(Math.sin(i + 1) * 6))),
    };
  }, [range]);

  const width = 640;
  const height = 160;
  const padding = 24;

  const max = Math.max(...data.series) || 1;
  const min = 0;

  const points = data.series.map((v, i) => {
    const x = padding + (i / (data.series.length - 1 || 1)) * (width - padding * 2);
    const y = padding + (1 - (v - min) / (max - min || 1)) * (height - padding * 2);
    return { x, y };
  });

  const path = toPath(points);

  const areaPath = `${path} L ${padding + (width - padding * 2)} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">User Registrations</h3>
          <p className="text-sm text-[var(--text-secondary)]">{range === "month" ? "Monthly" : "Weekly"} signups</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRange("week")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              range === "week" ? "bg-[var(--button-primary)] text-white shadow" : "bg-[var(--bg-card)]/80"
            }`}
          >
            Week
          </button>

          <button
            onClick={() => setRange("month")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              range === "month" ? "bg-[var(--button-primary)] text-white shadow" : "bg-[var(--bg-card)]/80"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
          <defs>
            <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(185,111,82,0.18)" />
              <stop offset="100%" stopColor="rgba(185,111,82,0)" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#b96f52" />
              <stop offset="100%" stopColor="#f2a68b" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#areaGrad)" stroke="none" />

          <path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#fff" stroke="#b96f52" strokeWidth={1.5} />
          ))}

          {data.labels.map((label, i) => {
            const px = padding + (i / (data.labels.length - 1 || 1)) * (width - padding * 2);
            return (
              <text key={i} x={px} y={height - 6} fontSize={10} textAnchor="middle" fill="var(--text-secondary)">
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* legend removed as requested */}
    </div>
  );
}
