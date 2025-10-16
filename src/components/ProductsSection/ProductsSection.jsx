"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";

const ProductsSection = () => {
  const router = useRouter();

  const categories = [
    {
      id: "catalog",
      title: "Shop by Catalog",
      description: "Explore our complete jewelry collection",
      route: "/admin-dashboard/shop-catalog"
    },
    {
      id: "accessories",
      title: "Shop Accessories",
      description: "Complete your look with our accessories",
      route: "/admin-dashboard/shop-accessories"
    },
    {
      id: "bestseller",
      title: "Best Seller",
      description: "Our most loved jewelry pieces",
      route: "/admin-dashboard/best-seller"
    },
    {
      id: "newarrivals",
      title: "New Arrivals",
      description: "Fresh designs just for you",
      route: "/admin-dashboard/new-arrivals"
    }
  ];

  const handleCategoryClick = (route) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE6E1] to-[#F8F0ED] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Collections</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our exquisite range of handcrafted jewelry pieces, each telling its own unique story of elegance and craftsmanship.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden relative"
              onClick={() => handleCategoryClick(category.route)}
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] p-8 border-b border-[#F8C9C1]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {category.title}
                    </h2>
                    <p className="text-gray-600 text-lg">{category.description}</p>
                  </div>
                  <div className="transform group-hover:translate-x-2 transition-transform duration-300 ml-6">
                    <ArrowRight className="w-8 h-8 text-[#8C3C4E]" />
                  </div>
                </div>
              </div>

              {/* Button Section */}
              <div className="p-8">
                <button className="w-full bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 text-lg">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Explore {category.title}</span>
                </button>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8C3C4E]/5 to-[#B25C6F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }

        .group:hover .group-hover\\:translate-x-2 {
          transform: translateX(8px);
        }
      `}</style>
    </div>
  );
};

export default ProductsSection;