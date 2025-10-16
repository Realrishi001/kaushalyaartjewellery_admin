"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Image as ImageIcon, Star, Link2 } from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import SidebarToggle from "@/components/Sidebar/SidebarToggle";
import axios from "axios";

const BASE_URL = "http://localhost:3085/api";

const NewArrivalsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
  });

  // ✅ Fetch all new arrivals from backend
  const fetchNewArrivals = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/new-arrivals`);
      if (response.data.success) {
        setNewArrivals(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    }
  };

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  // ✅ Handle add new product
  const handleAddProduct = () => {
    setProductForm({ id: "", title: "", description: "", imageUrl: "" });
    setEditingProduct(null);
    setShowProductForm(true);
  };

  // ✅ Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setProductForm({
      id: product.id,
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl,
    });
    setShowProductForm(true);
  };

  // ✅ Handle delete product
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await axios.delete(`${BASE_URL}/new-arrivals/${id}`);
      if (response.data.success) {
        alert("Product deleted successfully!");
        fetchNewArrivals();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // ✅ Handle save or update product
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/new-arrivals`, productForm);
      if (response.data.success) {
        alert(editingProduct ? "Product updated!" : "Product added!");
        fetchNewArrivals();
        setShowProductForm(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE6E1] to-[#F8F0ED]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} variant="default" />

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <SidebarToggle onClick={() => setSidebarOpen(true)} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">New Arrivals</h1>
                <p className="text-gray-600 text-sm">
                  Manage your new arrival products (add, edit, delete)
                </p>
              </div>
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Product</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <div className="p-6">
          {/* Products Grid */}
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newArrivals.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] p-4 border-b border-[#F8C9C1] flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{product.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 text-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="mx-auto h-40 w-full object-cover rounded-lg mb-3"
                      />
                    ) : (
                      <div className="h-40 w-full bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <p className="text-gray-700 text-sm mb-2">{product.description}</p>
                    <span className="text-xs text-gray-500">ID: {product.id}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">No new arrivals found.</div>
          )}
        </div>

        {/* Modal for Add/Edit */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => setShowProductForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitProduct} className="space-y-5">
                {/* Image URL Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <Link2 className="w-4 h-4 text-gray-500" />
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={productForm.imageUrl}
                      onChange={(e) =>
                        setProductForm({ ...productForm, imageUrl: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product title"
                    value={productForm.title}
                    onChange={(e) =>
                      setProductForm({ ...productForm, title: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter product description"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    rows={3}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
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

export default NewArrivalsPage;
