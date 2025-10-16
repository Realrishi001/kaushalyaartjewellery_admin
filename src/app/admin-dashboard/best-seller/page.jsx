"use client";

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Tag, Link, PlusCircle, MinusCircle,Star } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import SidebarToggle from '@/components/Sidebar/SidebarToggle';

const BestSellerPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bestSellers, setBestSellers] = useState([
    {
      id: 1,
      name: "Premium Collection",
      description: "Our most popular premium items",
      products: [
        {
          id: 1,
          name: "Viva Drop Victorian Set",
          realPrice: 2199,
          discountPrice: 1249,
          polishType: "High Polish",
          size: "Medium",
          about: "Exquisite Victorian style drop necklace set with intricate detailing",
          imageLinks: [
            "/images/bestseller1-1.jpg",
            "/images/bestseller1-2.jpg",
            "/images/bestseller1-3.jpg"
          ]
        },
        {
          id: 2,
          name: "Royal Kundan Set",
          realPrice: 3499,
          discountPrice: 1999,
          polishType: "Antique Finish",
          size: "Large",
          about: "Royal kundan set perfect for weddings and special occasions",
          imageLinks: [
            "/images/bestseller2-1.jpg",
            "/images/bestseller2-2.jpg"
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Trending Now",
      description: "Currently trending best sellers",
      products: []
    },
    {
      id: 3,
      name: "Customer Favorites",
      description: "Most loved by our customers",
      products: []
    },
    {
      id: 4,
      name: "Limited Edition",
      description: "Exclusive limited edition pieces",
      products: []
    }
  ]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedBestSeller, setSelectedBestSeller] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showNewBestSellerForm, setShowNewBestSellerForm] = useState(false);
  const [newBestSellerName, setNewBestSellerName] = useState('');
  const [newBestSellerDescription, setNewBestSellerDescription] = useState('');

  const [productForm, setProductForm] = useState({
    name: '',
    realPrice: '',
    discountPrice: '',
    polishType: '',
    size: '',
    about: '',
    imageLinks: ['']
  });

  const handleAddBestSeller = () => {
    if (newBestSellerName.trim()) {
      const newBestSeller = {
        id: Date.now(),
        name: newBestSellerName,
        description: newBestSellerDescription,
        products: []
      };
      setBestSellers([...bestSellers, newBestSeller]);
      setNewBestSellerName('');
      setNewBestSellerDescription('');
      setShowNewBestSellerForm(false);
    }
  };

  const handleAddProduct = (bestSellerId) => {
    setSelectedBestSeller(bestSellerId);
    setEditingProduct(null);
    setProductForm({
      name: '',
      realPrice: '',
      discountPrice: '',
      polishType: '',
      size: '',
      about: '',
      imageLinks: ['']
    });
    setShowProductForm(true);
  };

  const handleEditProduct = (bestSellerId, product) => {
    setSelectedBestSeller(bestSellerId);
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      realPrice: product.realPrice,
      discountPrice: product.discountPrice,
      polishType: product.polishType,
      size: product.size,
      about: product.about,
      imageLinks: product.imageLinks.length > 0 ? product.imageLinks : ['']
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (bestSellerId, productId) => {
    setBestSellers(bestSellers.map(bestSeller => 
      bestSeller.id === bestSellerId 
        ? { ...bestSeller, products: bestSeller.products.filter(p => p.id !== productId) }
        : bestSeller
    ));
  };

  const handleAddImageLink = () => {
    setProductForm({
      ...productForm,
      imageLinks: [...productForm.imageLinks, '']
    });
  };

  const handleRemoveImageLink = (index) => {
    const newImageLinks = productForm.imageLinks.filter((_, i) => i !== index);
    setProductForm({
      ...productForm,
      imageLinks: newImageLinks.length > 0 ? newImageLinks : ['']
    });
  };

  const handleImageLinkChange = (index, value) => {
    const newImageLinks = [...productForm.imageLinks];
    newImageLinks[index] = value;
    setProductForm({
      ...productForm,
      imageLinks: newImageLinks
    });
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    
    // Filter out empty image links
    const filteredImageLinks = productForm.imageLinks.filter(link => link.trim() !== '');
    
    const productData = {
      id: editingProduct || Date.now(),
      name: productForm.name,
      realPrice: parseFloat(productForm.realPrice),
      discountPrice: parseFloat(productForm.discountPrice),
      polishType: productForm.polishType,
      size: productForm.size,
      about: productForm.about,
      imageLinks: filteredImageLinks
    };

    setBestSellers(bestSellers.map(bestSeller => 
      bestSeller.id === selectedBestSeller 
        ? {
            ...bestSeller,
            products: editingProduct 
              ? bestSeller.products.map(p => p.id === editingProduct ? productData : p)
              : [...bestSeller.products, productData]
          }
        : bestSeller
    ));

    setShowProductForm(false);
    setEditingProduct(null);
    setSelectedBestSeller(null);
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
                <h1 className="text-2xl font-bold text-gray-900">Best Seller Management</h1>
                <p className="text-gray-600 text-sm">Manage your best selling jewelry products</p>
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

        {/* Main Content */}
        <div className="p-6">
          {/* Best Sellers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((bestSeller) => (
              <div
                key={bestSeller.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Best Seller Header */}
                <div className="bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] p-6 border-b border-[#F8C9C1]">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-xl font-bold text-gray-900">{bestSeller.name}</h2>
                  </div>
                  <p className="text-gray-600 text-sm">{bestSeller.description}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Tag className="w-4 h-4 text-[#8C3C4E]" />
                    <span className="text-sm text-gray-600">
                      {bestSeller.products.length} products
                    </span>
                  </div>
                </div>

                {/* Products List */}
                <div className="p-4 max-h-64 overflow-y-auto">
                  {bestSeller.products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No products added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bestSeller.products.map((product) => (
                        <div
                          key={product.id}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-[#F8C9C1] transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#FDE6E1] to-[#FBDBD5] rounded-lg flex items-center justify-center overflow-hidden">
                                {product.imageLinks.length > 0 ? (
                                  <img 
                                    src={product.imageLinks[0]} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <ImageIcon className="w-5 h-5 text-gray-400" />
                                </div>
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
                                <div className="flex items-center space-x-1 mt-1">
                                  <Link className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {product.imageLinks.length} images
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditProduct(bestSeller.id, product)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(bestSeller.id, product.id)}
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
                    onClick={() => handleAddProduct(bestSeller.id)}
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

        {/* Add New Best Seller Modal */}
        {showNewBestSellerForm && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Add New Best Seller Category</h3>
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
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                    placeholder="Enter category name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newBestSellerDescription}
                    onChange={(e) => setNewBestSellerDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent resize-none"
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewBestSellerForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBestSeller}
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

                {/* Multiple Image Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Image Links *
                    </label>
                    <button
                      type="button"
                      onClick={handleAddImageLink}
                      className="flex items-center space-x-1 text-[#8C3C4E] hover:text-[#7A3444] transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Add Another Image</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {productForm.imageLinks.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1">
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => handleImageLinkChange(index, e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        {productForm.imageLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImageLink(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <MinusCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Add multiple image URLs to showcase your product from different angles
                  </p>
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

export default BestSellerPage;