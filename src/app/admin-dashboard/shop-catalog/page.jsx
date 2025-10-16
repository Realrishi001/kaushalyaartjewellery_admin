"use client";

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Tag } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import SidebarToggle from '@/components/Sidebar/SidebarToggle';

const CatalogPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catalogs, setCatalogs] = useState([
    {
      id: 1,
      name: "Shop All",
      description: "Complete jewelry collection",
      products: [
        {
          id: 1,
          name: "Victorian Hasli Necklace",
          realPrice: 2900,
          discountPrice: 640,
          polishType: "High Polish",
          size: "Medium",
          about: "Elegant Victorian style hasli necklace with intricate design",
          image: "👑"
        },
        {
          id: 2,
          name: "Kundan Premium Set",
          realPrice: 2000,
          discountPrice: 1790,
          polishType: "Matte Finish",
          size: "Large",
          about: "Premium kundan jewelry set for special occasions",
          image: "💎"
        }
      ]
    },
    {
      id: 2,
      name: "Victorian Collection",
      description: "Classic Victorian era designs",
      products: []
    },
    {
      id: 3,
      name: "American Diamond",
      description: "Sparkling American diamond pieces",
      products: []
    }
  ]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showNewCatalogForm, setShowNewCatalogForm] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState('');
  const [newCatalogDescription, setNewCatalogDescription] = useState('');

  const [productForm, setProductForm] = useState({
    name: '',
    realPrice: '',
    discountPrice: '',
    polishType: '',
    size: '',
    about: '',
    image: '👑'
  });

  const imageOptions = ["👑", "💎", "✨", "🌟", "🔮", "🎀", "💫", "🎨", "💍", "🎉"];

  const handleAddCatalog = () => {
    if (newCatalogName.trim()) {
      const newCatalog = {
        id: Date.now(),
        name: newCatalogName,
        description: newCatalogDescription,
        products: []
      };
      setCatalogs([...catalogs, newCatalog]);
      setNewCatalogName('');
      setNewCatalogDescription('');
      setShowNewCatalogForm(false);
    }
  };

  const handleAddProduct = (catalogId) => {
    setSelectedCatalog(catalogId);
    setEditingProduct(null);
    setProductForm({
      name: '',
      realPrice: '',
      discountPrice: '',
      polishType: '',
      size: '',
      about: '',
      image: '👑'
    });
    setShowProductForm(true);
  };

  const handleEditProduct = (catalogId, product) => {
    setSelectedCatalog(catalogId);
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      realPrice: product.realPrice,
      discountPrice: product.discountPrice,
      polishType: product.polishType,
      size: product.size,
      about: product.about,
      image: product.image
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (catalogId, productId) => {
    setCatalogs(catalogs.map(catalog => 
      catalog.id === catalogId 
        ? { ...catalog, products: catalog.products.filter(p => p.id !== productId) }
        : catalog
    ));
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
      image: productForm.image
    };

    setCatalogs(catalogs.map(catalog => 
      catalog.id === selectedCatalog 
        ? {
            ...catalog,
            products: editingProduct 
              ? catalog.products.map(p => p.id === editingProduct ? productData : p)
              : [...catalog.products, productData]
          }
        : catalog
    ));

    setShowProductForm(false);
    setEditingProduct(null);
    setSelectedCatalog(null);
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Catalog Management</h1>
                <p className="text-gray-600 text-sm">Manage your jewelry catalogs and products</p>
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

        {/* Main Content */}
        <div className="p-6">
          {/* Catalogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogs.map((catalog) => (
              <div
                key={catalog.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Catalog Header */}
                <div className="bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] p-6 border-b border-[#F8C9C1]">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{catalog.name}</h2>
                  <p className="text-gray-600 text-sm">{catalog.description}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Tag className="w-4 h-4 text-[#8C3C4E]" />
                    <span className="text-sm text-gray-600">
                      {catalog.products.length} products
                    </span>
                  </div>
                </div>

                {/* Products List */}
                <div className="p-4 max-h-64 overflow-y-auto">
                  {catalog.products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No products added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {catalog.products.map((product) => (
                        <div
                          key={product.id}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-[#F8C9C1] transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#FDE6E1] to-[#FBDBD5] rounded-lg flex items-center justify-center text-lg">
                                {product.image}
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
                                onClick={() => handleEditProduct(catalog.id, product)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(catalog.id, product.id)}
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
                    onClick={() => handleAddProduct(catalog.id)}
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

        {/* Add New Catalog Modal */}
        {showNewCatalogForm && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Add New Catalog</h3>
                <button
                  onClick={() => setShowNewCatalogForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCatalogDescription}
                    onChange={(e) => setNewCatalogDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8C3C4E] focus:border-transparent resize-none"
                    placeholder="Enter catalog description"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewCatalogForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCatalog}
                    className="flex-1 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
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

                  {/* Image Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {imageOptions.map((image) => (
                        <button
                          key={image}
                          type="button"
                          onClick={() => setProductForm({...productForm, image})}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border-2 transition-all ${
                            productForm.image === image 
                              ? 'border-[#8C3C4E] bg-[#FDE6E1]' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {image}
                        </button>
                      ))}
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

export default CatalogPage;