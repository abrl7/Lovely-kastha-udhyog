"use client";

import { useState } from "react";
import { ORDER_STATUSES } from "@/lib/orderConstants";

const UNITS = ["cm", "inch", "ft", "mm"];

function emptyRow() {
  return { label: "", value: "", unit: "cm" };
}

export default function OrderDetail({ order, onClose, onUpdate, onDelete }) {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes]   = useState(order.internalNotes || "");
  const [measurements, setMeasurements] = useState(
    order.customDetails?.confirmedMeasurements?.length
      ? order.customDetails.confirmedMeasurements
      : []
  );
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [lastOrderId, setLastOrderId] = useState(order._id);
  if (order._id !== lastOrderId) {
    setLastOrderId(order._id);
    setStatus(order.status);
    setNotes(order.internalNotes || "");
    setMeasurements(
      order.customDetails?.confirmedMeasurements?.length
        ? order.customDetails.confirmedMeasurements
        : []
    );
    setSaveSuccess(false);
    setSaveError("");
  }

  function updateRow(index, field, value) {
    setMeasurements((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setSaveSuccess(false);
  }

  function addRow() {
    setMeasurements((prev) => [...prev, emptyRow()]);
  }

  function removeRow(index) {
    setMeasurements((prev) => prev.filter((_, i) => i !== index));
    setSaveSuccess(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    // Strip incomplete rows before saving (label or value empty)
    const cleanedMeasurements = measurements.filter(
      (r) => r.label.trim() && r.value.trim()
    );

    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          internalNotes: notes,
          ...(order.orderType === "custom" && { confirmedMeasurements: cleanedMeasurements }),
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      setSaveSuccess(true);
      // Refresh the parent list so the card's status badge updates too
      // without a full page reload.
      onUpdate();
    } catch (err) {
      setSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const createdDate = new Date(order.createdAt).toLocaleString("en-NP", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const fieldLabel = "block text-[0.72rem] font-semibold tracking-[0.04em] uppercase text-charcoal/50 mb-1";

  return (
    <div className="bg-white border border-walnut/15 rounded-sm p-6 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-serif text-lg text-walnut-deep leading-tight">
            {order.customerName}
          </h2>
          <p className="text-xs text-charcoal/50 mt-0.5">{order.orderCode}</p>
        </div>
        <button
          onClick={onClose}
          className="text-charcoal/40 hover:text-charcoal text-lg leading-none ml-2 mt-0.5"
          aria-label="Close detail panel"
        >
          ✕
        </button>
      </div>

      {/* Customer info */}
      <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-walnut/10">
        <div>
          <p className={fieldLabel}>Phone</p>
          <p className="text-sm">{order.customerPhone}</p>
        </div>
        {order.customerEmail && (
          <div>
            <p className={fieldLabel}>Email</p>
            <p className="text-sm break-all">{order.customerEmail}</p>
          </div>
        )}
        <div>
          <p className={fieldLabel}>Type</p>
          <p className="text-sm capitalize">
            {order.orderType === "custom" ? "Custom order" : "Ready-made"}
          </p>
        </div>
        <div>
          <p className={fieldLabel}>Received</p>
          <p className="text-sm">{createdDate}</p>
        </div>
      </div>

      {/* Order details */}
      <div className="mb-5 pb-5 border-b border-walnut/10">
        <p className={fieldLabel + " mb-2"}>What they want</p>
        {order.orderType === "custom" ? (
          <div className="text-sm text-charcoal/80 space-y-2">
            {order.customDetails?.furnitureType && order.customDetails.furnitureType !== "other" && (
              <p>
                <span className="font-medium">Type:</span>{" "}
                <span className="capitalize">{order.customDetails.furnitureType.replace(/_/g, " ")}</span>
              </p>
            )}
            <p>{order.customDetails?.description}</p>
            {order.customDetails?.dimensions && (
              <p>
                <span className="font-medium">Size estimate:</span>{" "}
                {order.customDetails.dimensions}
              </p>
            )}
            {order.customDetails?.woodPreference && (
              <p>
                <span className="font-medium">Wood:</span>{" "}
                {order.customDetails.woodPreference}
              </p>
            )}
            {order.customDetails?.budgetRange && (
              <p>
                <span className="font-medium">Budget:</span>{" "}
                {order.customDetails.budgetRange}
              </p>
            )}
            {order.customDetails?.referenceProduct && (
              <p>
                <span className="font-medium">Reference:</span>{" "}
                {order.customDetails.referenceProduct?.name || "—"}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-charcoal/80">
            {order.product?.name || "—"} · Qty: {order.quantity}
          </p>
        )}
      </div>

      {/* Confirmed measurements — custom orders only */}
      {order.orderType === "custom" && (
        <div className="mb-5 pb-5 border-b border-walnut/10">
          <div className="flex items-center justify-between mb-2">
            <p className={fieldLabel}>Production measurements</p>
            {order.customDetails?.dimensions && (
              <span className="text-[0.7rem] text-charcoal/40 italic">
                Customer estimate: &ldquo;{order.customDetails.dimensions}&rdquo;
              </span>
            )}
          </div>

          {measurements.length === 0 && (
            <p className="text-xs text-charcoal/40 mb-2">
              No confirmed measurements yet. Add them after the site visit.
            </p>
          )}

          <div className="space-y-2 mb-2">
            {measurements.map((row, i) => (
              <div key={i} className="flex gap-1.5 items-center">
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => updateRow(i, "label", e.target.value)}
                  placeholder="e.g. Length"
                  className="flex-1 min-w-0 px-2 py-1.5 border border-walnut/20 bg-cream-soft rounded-sm text-xs text-charcoal focus:outline-1 focus:outline-sienna"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => updateRow(i, "value", e.target.value)}
                  placeholder="e.g. 180"
                  className="w-16 px-2 py-1.5 border border-walnut/20 bg-cream-soft rounded-sm text-xs text-charcoal focus:outline-1 focus:outline-sienna"
                />
                <select
                  value={row.unit}
                  onChange={(e) => updateRow(i, "unit", e.target.value)}
                  className="w-14 px-1 py-1.5 border border-walnut/20 bg-cream-soft rounded-sm text-xs text-charcoal focus:outline-1 focus:outline-sienna"
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="text-charcoal/35 hover:text-red-500 text-sm leading-none px-1"
                  aria-label="Remove row"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="text-xs font-semibold text-sienna hover:text-sienna-dark"
          >
            + Add measurement
          </button>
        </div>
      )}

      {/* Status history */}
      {order.statusHistory?.length > 0 && (
        <div className="mb-5 pb-5 border-b border-walnut/10">
          <p className={fieldLabel + " mb-2"}>History</p>
          <ol className="space-y-2">
            {[...order.statusHistory].reverse().map((entry, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-brass mt-1.5 flex-none" />
                <div>
                  <span className="font-medium text-charcoal/80">
                    {entry.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-charcoal/40 ml-1.5">
                    {new Date(entry.changedAt).toLocaleDateString("en-NP", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  {entry.note && (
                    <p className="text-charcoal/60 mt-0.5">{entry.note}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Update form */}
      <div className="space-y-4">
        <div>
          <label htmlFor="status-select" className={fieldLabel}>
            Update status
          </label>
          <select
            id="status-select"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setSaveSuccess(false); }}
            disabled={saving}
            className="w-full px-3 py-2 border-[1.5px] border-walnut/20 bg-cream-soft rounded-sm text-sm text-charcoal focus:outline-2 focus:outline-sienna disabled:opacity-60"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="internal-notes" className={fieldLabel}>
            Internal notes (only you see this)
          </label>
          <textarea
            id="internal-notes"
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setSaveSuccess(false); }}
            disabled={saving}
            placeholder="e.g. Customer wants delivery before Dashain, called on 19 Jun…"
            rows={3}
            className="w-full px-3 py-2 border-[1.5px] border-walnut/20 bg-cream-soft rounded-sm text-sm text-charcoal focus:outline-2 focus:outline-sienna resize-none disabled:opacity-60"
          />
        </div>

        {saveError && (
          <p className="text-xs text-sienna-dark bg-sienna/10 border border-sienna/30 rounded-sm px-3 py-2">
            {saveError}
          </p>
        )}

        {saveSuccess && (
          <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-sm px-3 py-2">
            Saved successfully.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-sienna text-cream-soft font-semibold text-sm py-2.5 rounded-sm hover:bg-sienna-dark transition-colors duration-200 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {(order.status === "delivered" || order.status === "cancelled") && (
          <button
            onClick={async () => {
              const confirmed = window.confirm(
                `Permanently delete order ${order.orderCode}? This cannot be undone.`
              );
              if (!confirmed) return;
              const res = await fetch(`/api/admin/orders/${order._id}`, { method: "DELETE" });
              const result = await res.json();
              if (result.success) {
                onDelete();
              } else {
                alert("Failed to delete order: " + result.error);
              }
            }}
            className="w-full text-red-600 border border-red-200 font-semibold text-sm py-2.5 rounded-sm hover:bg-red-50 transition-colors duration-200"
          >
            Delete Order
          </button>
        )}
      </div>
    </div>
  );
}
