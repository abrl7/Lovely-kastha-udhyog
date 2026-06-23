const CATEGORY_LABELS = {
  living_room: "Living Room",
  bedroom: "Bedroom",
  dining: "Dining",
  office: "Office",
  custom: "Custom",
  other: "Other",
};

export default function ProductCard({ product, isSelected, onEdit, onToggleActive }) {
  const firstImage = product.images?.[0]?.url;

  const priceDisplay =
    product.priceMin && product.priceMax
      ? `Rs. ${product.priceMin.toLocaleString()} – ${product.priceMax.toLocaleString()}`
      : product.priceMin
      ? `From Rs. ${product.priceMin.toLocaleString()}`
      : "Price not set";

  return (
    <div
      className={`bg-white border rounded-sm px-5 py-4 flex gap-4 items-start transition-all duration-150 ${
        isSelected ? "border-walnut shadow-sm" : "border-walnut/15"
      }`}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 flex-none rounded-sm overflow-hidden bg-cream">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal/20 text-xs text-center leading-tight px-1">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <span className="font-semibold text-sm text-walnut-deep truncate">
            {product.name}
          </span>
          {product.isFeatured && (
            <span className="text-[0.68rem] font-semibold px-1.5 py-0.5 bg-brass/15 text-brass rounded-sm border border-brass/25">
              Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-charcoal/50">
            {CATEGORY_LABELS[product.category] || product.category}
          </span>
          <span className="text-charcoal/20 text-xs">·</span>
          <span
            className={`text-xs font-medium ${
              product.listingType === "ready_made"
                ? "text-sienna"
                : "text-charcoal/50"
            }`}
          >
            {product.listingType === "ready_made" ? "Ready-made" : "Reference only"}
          </span>
          {product.listingType === "ready_made" && (
            <>
              <span className="text-charcoal/20 text-xs">·</span>
              <span className="text-xs text-charcoal/50">
                Stock: {product.stockQuantity}
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-charcoal/40 mt-1">{priceDisplay}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 flex-none">
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-walnut border border-walnut/25 rounded-sm px-3 py-1.5 hover:bg-cream transition-colors duration-150"
        >
          Edit
        </button>
        <button
          onClick={onToggleActive}
          className={`text-xs font-semibold rounded-sm px-3 py-1.5 border transition-colors duration-150 ${
            product.isActive
              ? "text-red-600 border-red-200 hover:bg-red-50"
              : "text-green-700 border-green-200 hover:bg-green-50"
          }`}
        >
          {product.isActive ? "Deactivate" : "Reactivate"}
        </button>
      </div>
    </div>
  );
}
