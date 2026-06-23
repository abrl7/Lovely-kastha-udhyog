// STATUS_COLORS maps each order status to a small color badge.
// Kept here rather than in a separate constants file because this
// component is the only thing that renders these colored badges.
const STATUS_COLORS = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  confirmed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  measurement_scheduled: "bg-yellow-50 text-yellow-700 border-yellow-200",
  measurement_done: "bg-orange-50 text-orange-700 border-orange-200",
  in_production: "bg-amber-50 text-amber-700 border-amber-200",
  ready: "bg-green-50 text-green-700 border-green-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS = {
  new: "New",
  confirmed: "Confirmed",
  measurement_scheduled: "Meas. Scheduled",
  measurement_done: "Meas. Done",
  in_production: "In Production",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderCard({ order, isSelected, onClick }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-NP", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const preview =
    order.orderType === "custom"
      ? order.customDetails?.description?.slice(0, 80) +
        (order.customDetails?.description?.length > 80 ? "…" : "")
      : order.product?.name || "Ready-made item";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white border rounded-sm px-5 py-4 transition-all duration-150 ${
        isSelected
          ? "border-walnut shadow-sm"
          : "border-walnut/15 hover:border-walnut/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-walnut-deep">
              {order.customerName}
            </span>
            <span className="text-xs text-charcoal/40">{order.orderCode}</span>
            <span
              className={`text-[0.7rem] font-semibold px-2 py-0.5 rounded-sm border ${
                order.orderType === "custom"
                  ? "bg-brass/10 text-brass border-brass/30"
                  : "bg-sienna/10 text-sienna border-sienna/30"
              }`}
            >
              {order.orderType === "custom" ? "Custom" : "Ready-made"}
            </span>
          </div>
          <p className="text-xs text-charcoal/70 truncate">{preview}</p>
          <p className="text-xs text-charcoal/40 mt-1">
            {order.customerPhone} · {date}
          </p>
        </div>
        <span
          className={`flex-none text-[0.7rem] font-semibold px-2 py-1 rounded-sm border whitespace-nowrap ${
            STATUS_COLORS[order.status] || "bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>
    </button>
  );
}
