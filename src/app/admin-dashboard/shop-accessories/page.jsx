"use client";

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Tag, Upload } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import SidebarToggle from '@/components/Sidebar/SidebarToggle';

const AccessoriesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessories, setAccessories] = useState([
    {
      id: 1,
      name: "Earrings Collection",
      description: "Beautiful earrings for every occasion",
      products: [
        {
          id: 1,
          name: "Gold Plated Jhumkas",
          realPrice: 1200,
          discountPrice: 699,
          polishType: "High Polish",
          size: "Medium",
          about: "Traditional gold plated jhumkas with intricate design",
          image: null,
          imageUrl: "/images/earrings1.jpg"
        },
        {
          id: 2,
          name: "Pearl Stud Earrings",
          realPrice: 800,
          discountPrice: 499,
          polishType: "Matte Finish",
          size: "Small",
          about: "Elegant pearl stud earrings for daily wear",
          image: null,
          imageUrl: "/images/earrings2.jpg"
        }
      ]
    },
    {
      id: 2,
      name: "Bracelets",
      description: "Stylish bracelets to complement your look",
      products: []
    },
    {
      id: 3,
      name: "Anklets",
      description: "Delicate anklets for a graceful touch",
      products: []
    },
    {
      id: 4,
      name: "Hair Accessories",
      description: "Beautiful hair ornaments and accessories",
      products: []
    }
  ]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showNewAccessoryForm, setShowNewAccessoryForm] = useState(false);
  const [newAccessoryName, setNewAccessoryName] = useState('');
  const [newAccessoryDescription, setNewAccessoryDescription] = useState('');

  const [productForm, setProductForm] = useState({
    name: '',
    realPrice: '',
    discountPrice: '',
    polishType: '',
    size: '',
    about: '',
    image: null,
    imagePreview: ''
  });

  const handleAddAccessory = () => {
    if (newAccessoryName.trim()) {
      const newAccessory = {
        id: Date.now(),
        name: newAccessoryName,
        description: newAccessoryDescription,
        products: []
      };
      setAccessories([...accessories, newAccessory]);
      setNewAccessoryName('');
      setNewAccessoryDescription('');
      setShowNewAccessoryForm(false);
    }
  };

  const handleAddProduct = (accessoryId) => {
    setSelectedAccessory(accessoryId);
    setEditingProduct(null);
    setProductForm({
      name: '',
      realPrice: '',
      discountPrice: '',
      polishType: '',
      size: '',
      about: '',
      image: null,
      imagePreview: ''
    });
    setShowProductForm(true);
  };

  const handleEditProduct = (accessoryId, product) => {
    setSelectedAccessory(accessoryId);
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      realPrice: product.realPrice,
      discountPrice: product.discountPrice,
      polishType: product.polishType,
      size: product.size,
      about: product.about,
      image: product.image,
      imagePreview: product.imageUrl || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (accessoryId, productId) => {
    setAccessories(accessories.map(accessory => 
      accessory.id === accessoryId 
        ? { ...accessory, products: accessory.products.filter(p => p.id !== productId) }
        : accessory
    ));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({
          ...productForm,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    
    const productData = {
      id: editingProduct || Date.now(),
      name: productForm.name,
      realPrice: parseFloat(productForm.realPrice),
      discountPrice: parseFloat(productForm.discountPrice),
      polishType: productForm.polishType,
      size: productForm.size,
      about: productForm.about,
      image: productForm.image,
      imageUrl: productForm.imagePreview
    };

    setAccessories(accessories.map(accessory => 
      accessory.id === selectedAccessory 
        ? {
            ...accessory,
            products: editingProduct 
              ? accessory.products.map(p => p.id === editingProduct ? productData : p)
              : [...accessory.products, productData]
          }
        : accessory
    ));

    setShowProductForm(false);
    setEditingProduct(null);
    setSelectedAccessory(null);
  };

  const calculateDiscount = (realPrice, discountPrice) => {
    return Math.round(((realPrice - discountPrice) / realPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE6E1] to-[#F8F0ED]">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        variant="default"
      />
      
      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <SidebarToggle onClick={() => setSidebarOpen(true)} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Accessories Management</h1>
                <p className="text-gray-600 text-sm">Manage your jewelry accessories and products</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewAccessoryForm(true)}
              className="bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Accessory</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          {/* Accessories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessories.map((accessory) => (
              <div
                key={accessory.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Accessory Header */}
                <div className="bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] p-6 border-b border-[#F8C9C1]">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{accessory.name}</h2>
                  <p className="text-gray-600 text-sm">{accessory.description}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Tag className="w-4 h-4 text-[#8C3C4E]" />
                    <span className="text-sm text-gray-600">
                      {accessory.products.length} products
                    </span>
                  </div>
                </div>

                {/* Products List */}
                <div className="p-4 max-h-64 overflow-y-auto">
                  {accessory.products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No products added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {accessory.products.map((product) => (
                        <div
                          key={product.id}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-[#F8C9C1] transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#FDE6E1] to-[#FBDBD5] rounded-lg flex items-center justify-center overflow-hidden">
                                {product.imageUrl ? (
                                  <img 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {product.name}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-gray-500 line-through">
                                    ₹{product.realPrice}
                                  </span>
                                  <span className="text-xs font-bold text-[#8C3C4E]">
                                    ₹{product.discountPrice}
                                  </span>
                                  <span className="text-xs text-green-600 bg-green-50 px-1 rounded">
                                    {calculateDiscount(product.realPrice, product.discountPrice)}% OFF
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditProduct(accessory.id, product)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(accessory.id, product.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Product Button */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => handleAddProduct(accessory.id)}
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

        {/* Add New Accessory Modal */}
        {showNewAccessoryForm && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Add New Accessory Category</h3>
                <button
                  onClick={() => setShowNewAccessoryForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accessory Category Name
                  </label>
                  <input
                    type="text"
                    value={newAccessoryName}
                    onChange={(e) => setNewAccessoryName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                    placeholder="Enter accessory category name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newAccessoryDescription}
                    onChange={(e) => setNewAccessoryDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent resize-none"
                    placeholder="Enter accessory category description"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewAccessoryForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAccessory}
                    className="flex-1 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Create Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setShowProductForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image *
                    </label>
                    <div className="flex flex-col items-center justify-center">
                      {productForm.imagePreview ? (
                        <div className="relative mb-4">
                          <img 
                            src={productForm.imagePreview} 
                            alt="Product preview" 
                            className="w-32 h-32 object-cover rounded-xl border-2 border-[#8C3C4E]"
                          />
                          <button
                            type="button"
                            onClick={() => setProductForm({...productForm, image: null, imagePreview: ''})}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center mb-4 hover:border-[#8C3C4E] transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500 text-center">Upload Image</span>
                        </div>
                      )}
                      
                      <label className="bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Choose Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          required={!editingProduct}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Recommended: 500x500px, JPG/PNG</p>
                    </div>
                  </div>

                  {/* Real Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Real Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.realPrice}
                      onChange={(e) => setProductForm({...productForm, realPrice: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                      placeholder="Enter original price"
                    />
                  </div>

                  {/* Discount Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.discountPrice}
                      onChange={(e) => setProductForm({...productForm, discountPrice: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                      placeholder="Enter discounted price"
                    />
                  </div>

                  {/* Polish Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Polish Type *
                    </label>
                    <select
                      required
                      value={productForm.polishType}
                      onChange={(e) => setProductForm({...productForm, polishType: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                    >
                      <option value="">Select polish type</option>
                      <option value="High Polish">High Polish</option>
                      <option value="Matte Finish">Matte Finish</option>
                      <option value="Antique Finish">Antique Finish</option>
                      <option value="Satin Finish">Satin Finish</option>
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size *
                    </label>
                    <select
                      required
                      value={productForm.size}
                      onChange={(e) => setProductForm({...productForm, size: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                    >
                      <option value="">Select size</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Extra Large">Extra Large</option>
                    </select>
                  </div>
                </div>

                {/* About Product */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Product *
                  </label>
                  <textarea
                    required
                    value={productForm.about}
                    onChange={(e) => setProductForm({...productForm, about: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent resize-none"
                    placeholder="Describe the product features and details"
                    rows={4}
                  />
                </div>

                {/* Submit Buttons */}
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
                    {editingProduct ? 'Update Product' : 'Add Product'}
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

export default AccessoriesPage;