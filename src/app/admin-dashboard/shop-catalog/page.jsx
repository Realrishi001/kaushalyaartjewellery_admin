"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Tag,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import SidebarToggle from "@/components/Sidebar/SidebarToggle";

const CatalogPage = () => {
  const BASE_URL = "http://localhost:3085/api";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Catalog modal
  const [showNewCatalogForm, setShowNewCatalogForm] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState("");
  const [newCatalogDescription, setNewCatalogDescription] = useState("");
  const [newCatalogImage, setNewCatalogImage] = useState("");

  // Product modal
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    productName: "",
    productImage: "",
    realPrice: "",
    discountPrice: "",
    polishType: "",
    size: "",
    aboutProduct: "",
  });

  // ✅ Fetch all catalogs
  const fetchCatalogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/catalog`);
      if (response.data.success) {
        const data = response.data.data;

        // ensure “Shop All” always exists
        const hasShopAll = data.some((c) => c.catalogName === "Shop All");
        if (!hasShopAll) {
          data.unshift({
            id: "shopall",
            catalogName: "Shop All",
            catalogDescription: "Complete jewelry collection",
            catalogImage: "",
            products: [],
          });
        }
        setCatalogs(data);
      }
    } catch (error) {
      console.error("Error fetching catalogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  // ✅ Add catalog
  const handleAddCatalog = async () => {
    if (!newCatalogName.trim()) return alert("Please enter a catalog name");
    try {
      const res = await axios.post(`${BASE_URL}/catalog`, {
        catalogName: newCatalogName,
        catalogDescription: newCatalogDescription,
        catalogImage: newCatalogImage, // ✅ Added new field
      });
      if (res.data.success) {
        alert("Catalog added!");
        fetchCatalogs();
        setNewCatalogName("");
        setNewCatalogDescription("");
        setNewCatalogImage("");
        setShowNewCatalogForm(false);
      }
    } catch (err) {
      console.error("Add catalog error:", err);
      alert("Error creating catalog");
    }
  };

  // ✅ Delete catalog
  const handleDeleteCatalog = async (id) => {
    if (id === "shopall") return alert("Shop All cannot be deleted!");
    if (!confirm("Delete this catalog?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/catalog/${id}`);
      if (res.data.success) {
        alert("Catalog deleted");
        fetchCatalogs();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting catalog");
    }
  };

  // ✅ Open Add Product modal
  const handleAddProduct = (catalog) => {
    setSelectedCatalog(catalog);
    setEditingProduct(null);
    setProductForm({
      productName: "",
      productImage: "",
      realPrice: "",
      discountPrice: "",
      polishType: "",
      size: "",
      aboutProduct: "",
    });
    setShowProductForm(true);
  };

  // ✅ Edit Product
  const handleEditProduct = (catalog, product) => {
    setSelectedCatalog(catalog);
    setEditingProduct(product.id);
    setProductForm({
      productName: product.productName,
      productImage: product.productImage,
      realPrice: product.realPrice,
      discountPrice: product.discountPrice,
      polishType: product.polishType,
      size: product.size,
      aboutProduct: product.aboutProduct,
    });
    setShowProductForm(true);
  };

// Replace the existing handleSubmitProduct with this function
const handleSubmitProduct = async (e) => {
  e.preventDefault();

  // basic validation
  if (!selectedCatalog || !selectedCatalog.catalogName) {
    return alert("Please select a catalog before saving the product.");
  }
  if (!productForm.productName || !productForm.realPrice || !productForm.discountPrice) {
    return alert("Product name, real price and discount price are required.");
  }

  try {
    // Build the payload exactly as you requested
    const payload = {
      catalogName: selectedCatalog.catalogName,   // name of the existing catalog
      productName: productForm.productName,
      productImage: productForm.productImage || null,
      realPrice: productForm.realPrice ? parseFloat(productForm.realPrice) : null,
      discountPrice: productForm.discountPrice ? parseFloat(productForm.discountPrice) : null,
      polishType: productForm.polishType || null,
      size: productForm.size || null,
      aboutProduct: productForm.aboutProduct || null,
      // include productId when editing so backend can update by id if supported
      productId: editingProduct || null,
    };

    // POST to the product-specific endpoint
    const res = await axios.post(`${BASE_URL}/catalog/save-product`, payload);

    if (res.data && res.data.success) {
      alert(res.data.message || "Product saved successfully!");
      setShowProductForm(false);
      setEditingProduct(null);
      setSelectedCatalog(null);
      // refresh catalogs so UI shows newly added/updated product
      fetchCatalogs();
      // reset product form
      setProductForm({
        productName: "",
        productImage: "",
        realPrice: "",
        discountPrice: "",
        polishType: "",
        size: "",
        aboutProduct: "",
      });
    } else {
      // backend returned success: false
      console.error("Save product failed:", res.data);
      alert(res.data?.message || "Failed to save product");
    }
  } catch (err) {
    console.error("Error saving product:", err);
    alert("Error saving product. Check console for details.");
  }
};


  // Discount calculation
  const calculateDiscount = (r, d) => {
    if (!r || !d) return 0;
    return Math.round(((r - d) / r) * 100);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-700">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading catalogs...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE6E1] to-[#F8F0ED]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        variant="default"
      />

      <div className="lg:ml-80">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <SidebarToggle onClick={() => setSidebarOpen(true)} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Catalog Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your jewelry catalogs and their products
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewCatalogForm(true)}
              className="bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Catalog</span>
            </button>
          </div>
        </header>

        {/* Catalog Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogs.map((catalog) => (
              <div
                key={catalog.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] p-6 border-b border-[#F8C9C1]">
                  {catalog.catalogImage && (
                    <img
                      src={catalog.catalogImage}
                      alt={catalog.catalogName}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {catalog.catalogName}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {catalog.catalogDescription || "No description"}
                      </p>
                    </div>
                    {catalog.catalogName !== "Shop All" && (
                      <button
                        onClick={() => handleDeleteCatalog(catalog.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Tag className="w-4 h-4 text-[#8C3C4E]" />
                    <span className="text-sm text-gray-600">
                      {catalog.products?.length || 0} products
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="p-4">
                  {catalog.products && catalog.products.length > 0 ? (
                    catalog.products.map((p) => (
                      <div
                        key={p.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-2"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {p.productName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {p.polishType}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-[#8C3C4E]">
                            ₹{p.discountPrice}{" "}
                            <span className="text-xs text-gray-400 line-through ml-1">
                              ₹{p.realPrice}
                            </span>
                            <span className="ml-2 text-xs text-green-600">
                              {calculateDiscount(p.realPrice, p.discountPrice)}%
                              OFF
                            </span>
                          </p>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(catalog, p)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => alert("Delete product API soon")}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No products yet</p>
                    </div>
                  )}
                </div>

                {/* Add Product */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => handleAddProduct(catalog)}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Catalog Modal */}
        {showNewCatalogForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Catalog
                </h3>
                <button
                  onClick={() => setShowNewCatalogForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Catalog Name
                  </label>
                  <input
                    type="text"
                    value={newCatalogName}
                    onChange={(e) => setNewCatalogName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                    placeholder="Enter catalog name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Catalog Image URL
                  </label>
                  <input
                    type="text"
                    value={newCatalogImage}
                    onChange={(e) => setNewCatalogImage(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                    placeholder="Paste image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newCatalogDescription}
                    onChange={(e) => setNewCatalogDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewCatalogForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCatalog}
                    className="flex-1 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-3 rounded-xl font-semibold hover:shadow-lg"
                  >
                    Create Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add Product"} -{" "}
                  {selectedCatalog?.catalogName}
                </h3>
                <button
                  onClick={() => setShowProductForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={productForm.productName}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      productName: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl p-3"
                  required
                />

                <input
                  type="text"
                  placeholder="Product Image URL"
                  value={productForm.productImage}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      productImage: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl p-3"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Real Price ₹"
                    value={productForm.realPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        realPrice: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-xl p-3"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Discount Price ₹"
                    value={productForm.discountPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        discountPrice: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-xl p-3"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Polish Type"
                  value={productForm.polishType}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      polishType: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl p-3"
                />

                <input
                  type="text"
                  placeholder="Size"
                  value={productForm.size}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      size: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl p-3"
                />

                <textarea
                  placeholder="About Product"
                  value={productForm.aboutProduct}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      aboutProduct: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl p-3 resize-none"
                />

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-3 rounded-xl font-semibold hover:shadow-lg"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
