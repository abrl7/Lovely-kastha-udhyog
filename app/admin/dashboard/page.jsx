"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import OrderCard from "@/components/admin/OrderCard";
import OrderDetail from "@/components/admin/OrderDetail";
import { ORDER_STATUSES } from "@/lib/orderConstants";

// Statuses shown as quick-stat chips at the top — the ones your father
// checks most often at a glance.
const STAT_STATUSES = [
  { value: "new",           label: "New",           color: "bg-blue-100 text-blue-700" },
  { value: "confirmed",     label: "Confirmed",     color: "bg-indigo-100 text-indigo-700" },
  { value: "in_production", label: "In Production", color: "bg-amber-100 text-amber-700" },
  { value: "ready",         label: "Ready",         color: "bg-green-100 text-green-700" },
];

export default function AdminOrdersPage() {
  const [allOrders, setAllOrders]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery]   = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Always fetch all orders — filtering and stats are done client-side.
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders");
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      setAllOrders(result.data);
    } catch {
      setError("Failed to load orders. Try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Counts per status for the stats bar — always from the full list.
  const statCounts = useMemo(() => {
    const counts = {};
    for (const order of allOrders) {
      counts[order.status] = (counts[order.status] || 0) + 1;
    }
    return counts;
  }, [allOrders]);

  // Apply status filter + search query client-side.
  const visibleOrders = useMemo(() => {
    let result = allOrders;

    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (o) =>
          o.customerName?.toLowerCase().includes(q) ||
          o.customerPhone?.includes(q) ||
          o.orderCode?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allOrders, statusFilter, searchQuery]);

  const selectedOrder = allOrders.find((o) => o._id === selectedOrderId) || null;

  function handleStatusFilter(value) {
    setStatusFilter(value);
    setSelectedOrderId(null);
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-serif text-2xl text-walnut-deep">Orders</h1>
          <p className="text-sm text-charcoal/60 mt-0.5">
            {loading ? "Loading…" : `${allOrders.length} total`}
          </p>
        </div>
      </div>

      {/* Stats bar */}
      {!loading && allOrders.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {STAT_STATUSES.map((s) => {
            const count = statCounts[s.value] || 0;
            if (count === 0) return null;
            return (
              <button
                key={s.value}
                onClick={() => handleStatusFilter(statusFilter === s.value ? "" : s.value)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-150 ${s.color} ${
                  statusFilter === s.value ? "ring-2 ring-offset-1 ring-current" : "opacity-80 hover:opacity-100"
                }`}
              >
                <span className="text-base font-bold leading-none">{count}</span>
                {s.label}
              </button>
            );
          })}
          {allOrders.length > 0 && (
            <span className="flex items-center text-xs text-charcoal/40 px-1">
              {allOrders.length} total
            </span>
          )}
        </div>
      )}

      {/* Search + status filter row */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35 text-sm pointer-events-none">
            ⌕
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSelectedOrderId(null); }}
            placeholder="Name, phone, or order code…"
            className="w-full pl-8 pr-3 py-1.5 border border-walnut/20 bg-white rounded-sm text-sm text-charcoal focus:outline-2 focus:outline-sienna"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/35 hover:text-charcoal text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => handleStatusFilter("")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-sm border transition-colors duration-150 ${
              statusFilter === ""
                ? "bg-walnut text-cream-soft border-walnut"
                : "bg-white text-charcoal/70 border-walnut/20 hover:border-walnut/40"
            }`}
          >
            All
          </button>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusFilter(s.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-sm border transition-colors duration-150 ${
                statusFilter === s.value
                  ? "bg-walnut text-cream-soft border-walnut"
                  : "bg-white text-charcoal/70 border-walnut/20 hover:border-walnut/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results label */}
      {(statusFilter || searchQuery) && !loading && (
        <p className="text-xs text-charcoal/45 mb-3">
          {visibleOrders.length} {visibleOrders.length === 1 ? "order" : "orders"} found
          {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
          {statusFilter && (
            <> · {ORDER_STATUSES.find((s) => s.value === statusFilter)?.label}</>
          )}
          {" · "}
          <button
            onClick={() => { setStatusFilter(""); setSearchQuery(""); }}
            className="text-sienna hover:text-sienna-dark underline"
          >
            Clear
          </button>
        </p>
      )}

      {/* Main layout: list left, detail panel right */}
      <div className={`grid gap-6 ${selectedOrder ? "lg:grid-cols-[1fr_420px]" : "grid-cols-1"}`}>
        <div>
          {error && (
            <p className="text-sm text-sienna-dark bg-sienna/10 border border-sienna/30 rounded-sm px-4 py-3 mb-4">
              {error}
            </p>
          )}

          {!loading && allOrders.length === 0 && (
            <div className="bg-white border border-walnut/15 rounded-sm p-8 text-center">
              <p className="text-charcoal/50 text-sm">
                No orders yet. Customer inquiries will appear here.
              </p>
            </div>
          )}

          {!loading && allOrders.length > 0 && visibleOrders.length === 0 && (
            <div className="bg-white border border-walnut/15 rounded-sm p-8 text-center">
              <p className="text-charcoal/50 text-sm mb-2">No orders match your filters.</p>
              <button
                onClick={() => { setStatusFilter(""); setSearchQuery(""); }}
                className="text-sienna text-sm font-semibold hover:text-sienna-dark underline"
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {visibleOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                isSelected={selectedOrderId === order._id}
                onClick={() =>
                  setSelectedOrderId(selectedOrderId === order._id ? null : order._id)
                }
              />
            ))}
          </div>
        </div>

        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onClose={() => setSelectedOrderId(null)}
            onUpdate={fetchOrders}
            onDelete={() => {
              setSelectedOrderId(null);
              fetchOrders();
            }}
          />
        )}
      </div>
    </div>
  );
}
