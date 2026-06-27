"use client";

import { useState, useEffect, useCallback } from "react";
import OrderCard from "@/components/admin/OrderCard";
import OrderDetail from "@/components/admin/OrderDetail";
import { ORDER_STATUSES } from "@/lib/orderConstants";

// All possible statuses in the pipeline order — we use this array
// to drive the filter tabs AND the status dropdown in the detail panel
// so there's exactly one place to update if you ever rename a status.

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" = all
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = statusFilter
        ? `/api/admin/orders?status=${statusFilter}`
        : "/api/admin/orders";
      const res = await fetch(url);
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      setOrders(result.data);
    } catch (err) {
      setError("Failed to load orders. Try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const selectedOrder = orders.find((o) => o._id === selectedOrderId) || null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-walnut-deep">Orders</h1>
          <p className="text-sm text-charcoal/60 mt-0.5">
            {loading
              ? "Loading..."
              : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
            {statusFilter
              ? ` · filtered by "${ORDER_STATUSES.find((s) => s.value === statusFilter)?.label}"`
              : ""}
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => {
            setStatusFilter("");
            setSelectedOrderId(null);
          }}
          className={`text-xs font-semibold tracking-wide px-3 py-1.5 rounded-sm border transition-colors duration-150 ${
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
            onClick={() => {
              setStatusFilter(s.value);
              setSelectedOrderId(null);
            }}
            className={`text-xs font-semibold tracking-wide px-3 py-1.5 rounded-sm border transition-colors duration-150 ${
              statusFilter === s.value
                ? "bg-walnut text-cream-soft border-walnut"
                : "bg-white text-charcoal/70 border-walnut/20 hover:border-walnut/40"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main layout: list left, detail panel right */}
      <div
        className={`grid gap-6 ${
          selectedOrder ? "lg:grid-cols-[1fr_420px]" : "grid-cols-1"
        }`}
      >
        <div>
          {error && (
            <p className="text-sm text-sienna-dark bg-sienna/10 border border-sienna/30 rounded-sm px-4 py-3 mb-4">
              {error}
            </p>
          )}

          {!loading && orders.length === 0 && (
            <div className="bg-white border border-walnut/15 rounded-sm p-8 text-center">
              <p className="text-charcoal/50 text-sm">
                {statusFilter
                  ? `No orders with status "${
                      ORDER_STATUSES.find((s) => s.value === statusFilter)
                        ?.label
                    }".`
                  : "No orders yet. Customer inquiries will appear here."}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                isSelected={selectedOrderId === order._id}
                onClick={() =>
                  setSelectedOrderId(
                    selectedOrderId === order._id ? null : order._id
                  )
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
