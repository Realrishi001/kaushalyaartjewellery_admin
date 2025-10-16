"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Tag,
  Link,
  PlusCircle,
  MinusCircle,
  Star,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import SidebarToggle from "@/components/Sidebar/SidebarToggle";

const BASE_URL = "http://localhost:3085/api"; // ✅ change if needed

const BestSellerPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedBestSeller, setSelectedBestSeller] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showNewBestSellerForm, setShowNewBestSellerForm] = useState(false);
  const [newBestSellerName, setNewBestSellerName] = useState("");
  const [newBestSellerDescription, setNewBestSellerDescription] = useState("");
  const [newBestSellerImage, setNewBestSellerImage] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    realPrice: "",
    discountPrice: "",
    polishType: "",
    size: "",
    about: "",
    imageLinks: [""],
  });

  // ✅ Fetch all Best Sellers
  const fetchBestSellers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/bestseller`);
      if (response.data.success) {
        setBestSellers(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  // ✅ Add new Best Seller Category
  const handleAddBestSeller = async () => {
    if (!newBestSellerName.trim()) return;

    try {
      const response = await axios.post(`${BASE_URL}/bestseller`, {
        bestSellerName: newBestSellerName,
        bestSellerDescription: newBestSellerDescription,
        bestSellerImage: newBestSellerImage,
      });

      if (response.data.success) {
        fetchBestSellers();
      }
    } catch (error) {
      console.error("Error adding best seller:", error);
    } finally {
      setShowNewBestSellerForm(false);
      setNewBestSellerName("");
      setNewBestSellerDescription("");
      setNewBestSellerImage("");
    }
  };

  // ✅ Add or Update Product
  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    const filteredImageLinks = productForm.imageLinks.filter(
      (link) => link.trim() !== ""
    );

    const productData = {
      id: editingProduct || null,
      bestSellerName: selectedBestSeller.bestSellerName,
      bestSellerDescription: selectedBestSeller.bestSellerDescription,
      bestSellerImage: selectedBestSeller.bestSellerImage,
      productName: productForm.name,
      productImages: filteredImageLinks,
      realPrice: parseFloat(productForm.realPrice),
      discountPrice: parseFloat(productForm.discountPrice),
      polishType: productForm.polishType,
      size: productForm.size,
      aboutProduct: productForm.about,
    };

    try {
      const response = await axios.post(`${BASE_URL}/bestseller/save`, productData);
      if (response.data.success) {
        fetchBestSellers();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setShowProductForm(false);
      setEditingProduct(null);
      setSelectedBestSeller(null);
    }
  };

  // ✅ Delete Category
  const handleDeleteBestSeller = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${BASE_URL}/bestseller/${id}`);
      fetchBestSellers();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const calculateDiscount = (realPrice, discountPrice) => {
    return Math.round(((realPrice - discountPrice) / realPrice) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading best sellers...
      </div>
    );
  }

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
                  Best Seller Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your best selling jewelry products
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewBestSellerForm(true)}
              className="bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Category</span>
            </button>
          </div>
        </header>

        {/* Catalog Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.length === 0 ? (
              <p className="text-gray-500 text-center w-full">
                No best seller categories found.
              </p>
            ) : (
              bestSellers.map((bestSeller) => (
                <div
                  key={bestSeller.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {bestSeller.bestSellerImage && (
                    <img
                      src={bestSeller.bestSellerImage}
                      alt={bestSeller.bestSellerName}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <h2 className="text-xl font-bold text-gray-900">
                        {bestSeller.bestSellerName}
                      </h2>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {bestSeller.bestSellerDescription || "No description."}
                    </p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedBestSeller(bestSeller);
                          setShowProductForm(true);
                        }}
                        className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Product
                      </button>
                      <button
                        onClick={() => handleDeleteBestSeller(bestSeller.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ✅ Add New Category Modal */}
        {showNewBestSellerForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Best Seller Category
                </h3>
                <button
                  onClick={() => setShowNewBestSellerForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newBestSellerName}
                    onChange={(e) => setNewBestSellerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E]"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newBestSellerDescription}
                    onChange={(e) =>
                      setNewBestSellerDescription(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] resize-none"
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image URL
                  </label>
                  <input
                    type="url"
                    value={newBestSellerImage}
                    onChange={(e) => setNewBestSellerImage(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E]"
                    placeholder="https://example.com/category-image.jpg"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewBestSellerForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBestSeller}
                    className="flex-1 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-3 rounded-xl font-semibold hover:shadow-lg"
                  >
                    Create Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Add/Edit Product Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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

              <form onSubmit={handleSubmitProduct} className="space-y-6">
                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Product Name"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="border rounded-xl p-3"
                  />
                  <input
                    type="number"
                    placeholder="Real Price"
                    required
                    value={productForm.realPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        realPrice: e.target.value,
                      })
                    }
                    className="border rounded-xl p-3"
                  />
                  <input
                    type="number"
                    placeholder="Discount Price"
                    required
                    value={productForm.discountPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        discountPrice: e.target.value,
                      })
                    }
                    className="border rounded-xl p-3"
                  />
                </div>

                {/* Polish & Size */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    required
                    value={productForm.polishType}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        polishType: e.target.value,
                      })
                    }
                    className="border rounded-xl p-3"
                  >
                    <option value="">Select Polish</option>
                    <option value="High Polish">High Polish</option>
                    <option value="Antique Finish">Antique Finish</option>
                    <option value="Matte Finish">Matte Finish</option>
                  </select>

                  <select
                    required
                    value={productForm.size}
                    onChange={(e) =>
                      setProductForm({ ...productForm, size: e.target.value })
                    }
                    className="border rounded-xl p-3"
                  >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                {/* About */}
                <textarea
                  required
                  placeholder="About Product"
                  value={productForm.about}
                  onChange={(e) =>
                    setProductForm({ ...productForm, about: e.target.value })
                  }
                  className="w-full border rounded-xl p-3 resize-none"
                  rows={3}
                />

                {/* Image URLs */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label>Product Image URLs</label>
                    <button
                      type="button"
                      onClick={() =>
                        setProductForm({
                          ...productForm,
                          imageLinks: [...productForm.imageLinks, ""],
                        })
                      }
                      className="flex items-center text-[#8C3C4E]"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" /> Add
                    </button>
                  </div>
                  {productForm.imageLinks.map((link, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => {
                          const newLinks = [...productForm.imageLinks];
                          newLinks[i] = e.target.value;
                          setProductForm({
                            ...productForm,
                            imageLinks: newLinks,
                          });
                        }}
                        placeholder="https://example.com/img.jpg"
                        className="flex-1 border rounded-xl p-3"
                      />
                      {productForm.imageLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newLinks = productForm.imageLinks.filter(
                              (_, index) => index !== i
                            );
                            setProductForm({
                              ...productForm,
                              imageLinks:
                                newLinks.length > 0 ? newLinks : [""],
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

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

export default BestSellerPage;
