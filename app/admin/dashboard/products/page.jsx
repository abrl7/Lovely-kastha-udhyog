"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/admin/ProductCard";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // formMode controls what the form panel is doing:
  // null = closed, 'add' = new product, 'edit' = editing existing
  const [formMode, setFormMode] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products");
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      setProducts(result.data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleEdit(product) {
    setEditingProduct(product);
    setFormMode("edit");
  }

  function handleAdd() {
    setEditingProduct(null);
    setFormMode("add");
  }

  function handleFormClose() {
    setFormMode(null);
    setEditingProduct(null);
  }

  // On mobile, opening the form switches to form-only view — scroll to top.
  useEffect(() => {
    if (formMode) {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    }
  }, [formMode, editingProduct?._id]);

  async function handleToggleActive(product) {
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      fetchProducts();
    } catch (err) {
      alert("Failed to update product status: " + err.message);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Permanently delete "${product.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  }

  const activeProducts = products.filter((p) => p.isActive);
  const inactiveProducts = products.filter((p) => !p.isActive);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-walnut-deep">Products</h1>
          <p className="text-sm text-charcoal/60 mt-0.5">
            {loading ? "Loading..." : `${activeProducts.length} active · ${inactiveProducts.length} inactive`}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-sienna text-cream-soft font-semibold text-sm px-5 py-2.5 rounded-sm hover:bg-sienna-dark transition-colors duration-200"
        >
          + Add Product
        </button>
      </div>

      {error && (
        <p className="text-sm text-sienna-dark bg-sienna/10 border border-sienna/30 rounded-sm px-4 py-3 mb-6">
          {error}
        </p>
      )}

      <div className={`grid gap-6 ${formMode ? "lg:grid-cols-[1fr_460px]" : "grid-cols-1"}`}>
        {/* Product list — hidden on mobile when form is open */}
        <div className={formMode ? "hidden lg:block" : ""}>
          {!loading && products.length === 0 && (
            <div className="bg-white border border-walnut/15 rounded-sm p-8 text-center">
              <p className="text-charcoal/50 text-sm mb-3">
                No products yet. Add your first catalog item.
              </p>
              <button
                onClick={handleAdd}
                className="text-sienna text-sm font-semibold hover:text-sienna-dark underline"
              >
                Add a product
              </button>
            </div>
          )}

          {/* Active products */}
          {activeProducts.length > 0 && (
            <div className="mb-8">
              <p className="text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-charcoal/40 mb-3">
                Active ({activeProducts.length})
              </p>
              <div className="flex flex-col gap-3">
                {activeProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    isSelected={editingProduct?._id === p._id}
                    onEdit={() => handleEdit(p)}
                    onToggleActive={() => handleToggleActive(p)}
                    onDelete={() => handleDelete(p)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive products */}
          {inactiveProducts.length > 0 && (
            <div>
              <p className="text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-charcoal/40 mb-3">
                Inactive / Hidden ({inactiveProducts.length})
              </p>
              <div className="flex flex-col gap-3 opacity-60">
                {inactiveProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    isSelected={editingProduct?._id === p._id}
                    onEdit={() => handleEdit(p)}
                    onToggleActive={() => handleToggleActive(p)}
                    onDelete={() => handleDelete(p)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add / Edit form panel */}
        {formMode && (
          <ProductForm
            mode={formMode}
            product={editingProduct}
            onClose={handleFormClose}
            onSaved={fetchProducts}
          />
        )}
      </div>
    </div>
  );
}
