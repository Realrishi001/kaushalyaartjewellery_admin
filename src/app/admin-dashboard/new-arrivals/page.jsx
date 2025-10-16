"use client";

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Tag, Link, PlusCircle, MinusCircle, Star } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import SidebarToggle from '@/components/Sidebar/SidebarToggle';

const NewArrivalsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newArrivals, setNewArrivals] = useState([
    {
      id: 1,
      image: "/images/new-arrival1.jpg",
      title: "Premium Knight Collection",
      description: "Latest premium jewelry with exquisite craftsmanship",
      hasInfo: true
    },
    {
      id: 2,
      image: "/images/new-arrival2.jpg",
      title: "Victorian Elegance Set",
      description: "Timeless Victorian design with modern touch",
      hasInfo: true
    },
    {
      id: 3,
      image: "/images/new-arrival3.jpg",
      title: "",
      description: "",
      hasInfo: false
    }
  ]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    image: ''
  });

  const handleAddProduct = (index) => {
    setSelectedProductIndex(index);
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      image: ''
    });
    setShowProductForm(true);
  };

  const handleEditProduct = (index, product) => {
    setSelectedProductIndex(index);
    setEditingProduct(product.id);
    setProductForm({
      title: product.title,
      description: product.description,
      image: product.image
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (index) => {
    const updatedArrivals = [...newArrivals];
    updatedArrivals[index] = {
      id: Date.now(),
      image: "",
      title: "",
      description: "",
      hasInfo: index !== 2 // First two have info, third doesn't
    };
    setNewArrivals(updatedArrivals);
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedArrivals = [...newArrivals];
        updatedArrivals[index] = {
          ...updatedArrivals[index],
          image: e.target.result
        };
        setNewArrivals(updatedArrivals);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedArrivals = [...newArrivals];
    updatedArrivals[index] = {
      ...updatedArrivals[index],
      image: ""
    };
    setNewArrivals(updatedArrivals);
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    
    const updatedArrivals = [...newArrivals];
    updatedArrivals[selectedProductIndex] = {
      ...updatedArrivals[selectedProductIndex],
      title: productForm.title,
      description: productForm.description,
      image: productForm.image || updatedArrivals[selectedProductIndex].image,
      hasInfo: selectedProductIndex !== 2 // Third product doesn't have info
    };

    setNewArrivals(updatedArrivals);
    setShowProductForm(false);
    setEditingProduct(null);
    setSelectedProductIndex(null);
  };

  const handleSaveAll = () => {
    console.log('Saved new arrivals:', newArrivals);
    // Here you would typically send the data to your backend
    alert('New arrivals saved successfully!');
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
                <h1 className="text-2xl font-bold text-gray-900">New Arrivals</h1>
                <p className="text-gray-600 text-sm">Manage your new arrival products (Max 3 products)</p>
              </div>
            </div>
            <button
              onClick={handleSaveAll}
              className="bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Star className="w-5 h-5" />
              <span>Save New Arrivals</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] border border-[#F8C9C1] rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#8C3C4E] rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">New Arrivals Setup</h3>
                <p className="text-sm text-gray-600">
                  You can add exactly 3 products. First two products require information, third product is image-only.
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newArrivals.map((product, index) => (
              <div
                key={product.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Product Header */}
                <div className="bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] p-4 border-b border-[#F8C9C1]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-[#8C3C4E] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Product {index + 1}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      {product.hasInfo && product.title && (
                        <button
                          onClick={() => handleEditProduct(index, product)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {(product.image || product.title) && (
                        <button
                          onClick={() => handleDeleteProduct(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    {product.hasInfo ? (
                      <span className="text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full">
                        With Information
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full">
                        Image Only
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-4">
                  {/* Image Upload/Preview */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Product Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#8C3C4E] transition-colors">
                      {product.image ? (
                        <div>
                          <img 
                            src={product.image} 
                            alt={`Product ${index + 1}`} 
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="mt-2 text-red-500 text-sm hover:text-red-700 transition-colors"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div>
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm mb-2">Click to upload image</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            className="hidden"
                            id={`image-upload-${index}`}
                          />
                          <label
                            htmlFor={`image-upload-${index}`}
                            className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                          >
                            Upload Image
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Information Fields (only for first two products) */}
                  {product.hasInfo && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                        <div className="border border-gray-300 rounded-lg p-3 bg-white">
                          {product.title ? (
                            <p className="text-gray-900 font-medium">{product.title}</p>
                          ) : (
                            <p className="text-gray-500 text-sm">No title added</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                        <div className="border border-gray-300 rounded-lg p-3 bg-white min-h-[60px]">
                          {product.description ? (
                            <p className="text-gray-700 text-sm">{product.description}</p>
                          ) : (
                            <p className="text-gray-500 text-sm">No description added</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Indicator for product without info */}
                  {!product.hasInfo && (
                    <div className="text-center py-4">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">Image only - No information required</p>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-4">
                    {!product.image && !product.title ? (
                      <button
                        onClick={() => handleAddProduct(index)}
                        className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                      </button>
                    ) : product.hasInfo && (!product.title || !product.description) ? (
                      <button
                        onClick={() => handleEditProduct(index, product)}
                        className="w-full bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Complete Information
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditProduct(index, product)}
                        className="w-full bg-gray-800 text-white py-2 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300"
                      >
                        Edit Product
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Preview Section */}
          <div className="mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Preview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newArrivals.map((product, index) => (
                  <div key={product.id} className="text-center">
                    <div className="bg-gradient-to-br from-[#FDE6E1] to-[#FBDBD5] rounded-2xl p-6 border border-[#F8C9C1]">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={`New Arrival ${index + 1}`} 
                          className="w-full h-48 object-cover rounded-lg mx-auto mb-4"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {product.hasInfo && product.title && (
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-2">{product.title}</h3>
                          {product.description && (
                            <p className="text-gray-600 text-sm">{product.description}</p>
                          )}
                        </div>
                      )}
                      
                      {!product.hasInfo && (
                        <div className="text-gray-500 text-sm">
                          Image Only Product
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Product {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add Product'} - Slot {selectedProductIndex + 1}
                </h3>
                <button
                  onClick={() => setShowProductForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitProduct} className="space-y-6">
                {/* Image Upload in Modal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image {newArrivals[selectedProductIndex].image && '(Uploaded)'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                    {productForm.image || newArrivals[selectedProductIndex].image ? (
                      <div>
                        <img 
                          src={productForm.image || newArrivals[selectedProductIndex].image} 
                          alt="Product preview" 
                          className="mx-auto h-32 w-32 object-cover rounded-lg mb-2"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setProductForm({...productForm, image: e.target.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="modal-image-upload"
                        />
                        <label
                          htmlFor="modal-image-upload"
                          className="cursor-pointer text-[#8C3C4E] text-sm hover:text-[#7A3444] transition-colors"
                        >
                          Change Image
                        </label>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-2">Upload product image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setProductForm({...productForm, image: e.target.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="modal-image-upload"
                        />
                        <label
                          htmlFor="modal-image-upload"
                          className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                        >
                          Upload Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Information Fields (only for first two products) */}
                {selectedProductIndex !== 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.title}
                        onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                        placeholder="Enter product title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Description *
                      </label>
                      <textarea
                        required
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent resize-none"
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>
                  </>
                )}

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

export default NewArrivalsPage;