// Shared order status definitions used by the admin dashboard page
// (filter tabs) and OrderDetail (status dropdown).
// Single source of truth: update here when pipeline stages change.
export const ORDER_STATUSES = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "measurement_scheduled", label: "Measurement Scheduled" },
  { value: "measurement_done", label: "Measurement Done" },
  { value: "in_production", label: "In Production" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];
