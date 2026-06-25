import { STATUS_INFO } from "@/app/track/page";

/*
  Renders a vertical timeline of status history entries, newest first.
  Each entry shows: a colored dot (matching the status color), the
  status label, date, and optional note.

  Importing STATUS_INFO from the track page rather than duplicating the
  label/color mapping here — one source of truth for status display info.
*/
export default function OrderTimeline({ history }) {
  // Show newest events at the top — more natural for "what's happened
  // recently" than chronological order which buries the latest update.
  const reversed = [...history].reverse();

  return (
    <ol className="relative">
      {reversed.map((entry, i) => {
        const info = STATUS_INFO[entry.status] || {
          label: entry.status,
          color: "bg-gray-400",
        };

        const date = new Date(entry.changedAt).toLocaleDateString("en-NP", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const isLatest = i === 0;

        return (
          <li key={i} className="flex gap-4 pb-6 last:pb-0 relative">
            {/* Vertical connector line between dots */}
            {i < reversed.length - 1 && (
              <div className="absolute left-[7px] top-4 bottom-0 w-[2px] bg-walnut/10" />
            )}

            {/* Status dot */}
            <div className="flex-none mt-0.5">
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  isLatest ? info.color : "bg-walnut/20"
                }`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className={`text-sm font-semibold ${
                    isLatest ? "text-walnut-deep" : "text-charcoal/60"
                  }`}
                >
                  {info.label}
                </span>
                {isLatest && (
                  <span className="text-[0.68rem] font-semibold px-1.5 py-0.5 bg-sienna/10 text-sienna rounded-sm">
                    Latest
                  </span>
                )}
                <span className="text-xs text-charcoal/40 ml-auto">
                  {date}
                </span>
              </div>
              {entry.note && (
                <p className="text-sm text-charcoal/60 mt-0.5">{entry.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
