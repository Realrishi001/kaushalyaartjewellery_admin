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
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import SidebarToggle from "@/components/Sidebar/SidebarToggle";

const BASE_URL = "http://localhost:3085/api";

const AccessoriesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal controls
  const [showNewAccessoryForm, setShowNewAccessoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // accessory form fields
  const [newAccessoryName, setNewAccessoryName] = useState("");
  const [newAccessoryDescription, setNewAccessoryDescription] = useState("");
  const [newAccessoryImage, setNewAccessoryImage] = useState("");

  // product form fields
  const [productForm, setProductForm] = useState({
    name: "",
    realPrice: "",
    discountPrice: "",
    polishType: "",
    size: "",
    about: "",
    imageUrl: "",
  });

  // ✅ Fetch all accessories
  const fetchAccessories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/accessory`);
      if (res.data.success) setAccessories(res.data.data);
    } catch (error) {
      console.error("Error fetching accessories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  // ✅ Add new accessory
  const handleAddAccessory = async () => {
    if (!newAccessoryName.trim()) return alert("Please enter a name");

    try {
      const res = await axios.post(`${BASE_URL}/accessory`, {
        accessoryName: newAccessoryName,
        accessoryDescription: newAccessoryDescription,
        accessoryImage: newAccessoryImage, // ✅ added
      });
      if (res.data.success) {
        alert("Accessory created!");
        fetchAccessories();
        setNewAccessoryName("");
        setNewAccessoryDescription("");
        setNewAccessoryImage("");
        setShowNewAccessoryForm(false);
      }
    } catch (error) {
      console.error("Error adding accessory:", error);
      alert("Failed to add accessory");
    }
  };

  // ✅ Delete accessory
  const handleDeleteAccessory = async (id) => {
    if (!confirm("Delete this accessory?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/accessory/${id}`);
      if (res.data.success) {
        alert("Accessory deleted");
        fetchAccessories();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting accessory");
    }
  };

  // ✅ Add or edit product
  const handleAddProduct = (accessoryId) => {
    setSelectedAccessory(accessoryId);
    setEditingProduct(null);
    setProductForm({
      name: "",
      realPrice: "",
      discountPrice: "",
      polishType: "",
      size: "",
      about: "",
      imageUrl: "",
    });
    setShowProductForm(true);
  };

  const handleEditProduct = (accessoryId, accessory) => {
    setSelectedAccessory(accessoryId);
    setEditingProduct(true);
    setProductForm({
      name: accessory.productName,
      realPrice: accessory.realPrice,
      discountPrice: accessory.discountPrice,
      polishType: accessory.polishType,
      size: accessory.size,
      about: accessory.aboutProduct,
      imageUrl: accessory.productImage,
    });
    setShowProductForm(true);
  };

  // ✅ Save or update product
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/accessory/save`, {
        id: selectedAccessory,
        productName: productForm.name,
        productImage: productForm.imageUrl,
        realPrice: productForm.realPrice,
        discountPrice: productForm.discountPrice,
        polishType: productForm.polishType,
        size: productForm.size,
        aboutProduct: productForm.about,
      });

      if (res.data.success) {
        alert("Product saved successfully!");
        fetchAccessories();
        setShowProductForm(false);
        setEditingProduct(null);
        setSelectedAccessory(null);
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product");
    }
  };

  const calculateDiscount = (r, d) => {
    if (!r || !d) return 0;
    return Math.round(((r - d) / r) * 100);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-700">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading accessories...
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
                  Accessories Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage jewelry accessories and products
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewAccessoryForm(true)}
              className="bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Accessory</span>
            </button>
          </div>
        </header>

        {/* Accessories Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessories.map((acc) => (
              <div
                key={acc.id}
                className="bg-white/80 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] p-6 border-b border-[#F8C9C1]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {acc.accessoryName}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {acc.accessoryDescription || "No description"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAccessory(acc.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Tag className="w-4 h-4 text-[#8C3C4E]" />
                    <span className="text-sm text-gray-600">
                      {acc.productName ? 1 : 0} products
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {acc.productName ? (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <h3 className="font-semibold text-gray-900">
                        {acc.productName}
                      </h3>
                      <p className="text-sm text-gray-500">{acc.polishType}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {acc.aboutProduct}
                      </p>
                      <div className="mt-2 text-sm">
                        <span className="font-semibold text-[#8C3C4E]">
                          ₹{acc.discountPrice}
                        </span>
                        <span className="line-through text-gray-400 ml-2">
                          ₹{acc.realPrice}
                        </span>
                        <span className="ml-2 text-green-600 text-xs">
                          {calculateDiscount(acc.realPrice, acc.discountPrice)}%
                          OFF
                        </span>
                      </div>
                      <button
                        onClick={() => handleEditProduct(acc.id, acc)}
                        className="text-blue-600 text-sm mt-2"
                      >
                        Edit Product
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p>No products yet</p>
                    </div>
                  )}
                </div>

                {/* Add Product */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => handleAddProduct(acc.id)}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 flex justify-center items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {acc.productName ? "Edit Product" : "Add Product"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Accessory Modal */}
        {showNewAccessoryForm && (
          <AccessoryModal
            onClose={() => setShowNewAccessoryForm(false)}
            onSubmit={handleAddAccessory}
            name={newAccessoryName}
            setName={setNewAccessoryName}
            description={newAccessoryDescription}
            setDescription={setNewAccessoryDescription}
            image={newAccessoryImage}
            setImage={setNewAccessoryImage}
          />
        )}

        {/* Add/Edit Product Modal */}
        {showProductForm && (
          <ProductModal
            productForm={productForm}
            setProductForm={setProductForm}
            onClose={() => setShowProductForm(false)}
            onSubmit={handleSubmitProduct}
            editingProduct={editingProduct}
          />
        )}
      </div>
    </div>
  );
};

// ✅ Accessory Modal
function AccessoryModal({
  onClose,
  onSubmit,
  name,
  setName,
  description,
  setDescription,
  image,
  setImage,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Add New Accessory
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Accessory Name"
          />
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Accessory Image URL"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 resize-none"
            placeholder="Description"
            rows={3}
          />
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-3 rounded-xl"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Product Modal
function ProductModal({ productForm, setProductForm, onClose, onSubmit, editingProduct }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Product Name"
          />
          <input
            type="text"
            value={productForm.imageUrl}
            onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Product Image URL"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={productForm.realPrice}
              onChange={(e) => setProductForm({ ...productForm, realPrice: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-3"
              placeholder="Real Price"
            />
            <input
              type="number"
              value={productForm.discountPrice}
              onChange={(e) =>
                setProductForm({ ...productForm, discountPrice: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl p-3"
              placeholder="Discount Price"
            />
          </div>
          <input
            type="text"
            value={productForm.polishType}
            onChange={(e) => setProductForm({ ...productForm, polishType: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Polish Type"
          />
          <input
            type="text"
            value={productForm.size}
            onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Size"
          />
          <textarea
            value={productForm.about}
            onChange={(e) => setProductForm({ ...productForm, about: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3 resize-none"
            placeholder="About Product"
            rows={3}
          />
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-3 rounded-xl"
            >
              {editingProduct ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccessoriesPage;
