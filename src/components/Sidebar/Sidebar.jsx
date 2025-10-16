"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Grid, Package, Star, Clock, 
  Menu, X, ChevronRight, Home,
  ShoppingBag, Users, Settings, LogOut
} from "lucide-react";

const Sidebar = ({ 
  isOpen = false, 
  onClose = () => {},
  showCloseButton = true,
  position = "left",
  variant = "default" // 'default' or 'admin'
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");

  // Set active item based on current pathname
  useEffect(() => {
    const currentPath = pathname;
    
    // Find the item that matches the current path
    const allItems = variant === "admin" ? adminItems : productItems;
    const active = allItems.find(item => item.route === currentPath);
    
    if (active) {
      setActiveItem(active.id);
    } else {
      // Fallback: set based on pathname contains
      if (currentPath.includes('/admin-dashboard/shop-catalog')) setActiveItem('shop-catalog');
      else if (currentPath.includes('/admin-dashboard/shop-accessories')) setActiveItem('shop-accessories');
      else if (currentPath.includes('/admin-dashboard/best-seller')) setActiveItem('best-seller');
      else if (currentPath.includes('/admin-dashboard/new-arrivals')) setActiveItem('new-arrivals');
      else if (currentPath.includes('/admin-dashboard')) setActiveItem('dashboard');
      else if (currentPath.includes('/admin-products')) setActiveItem('products');
      else if (currentPath.includes('/admin-orders')) setActiveItem('orders');
      else if (currentPath.includes('/admin-customers')) setActiveItem('customers');
      else if (currentPath.includes('/admin-settings')) setActiveItem('settings');
    }
  }, [pathname, variant]);

  // Navigation items for products
  const productItems = [
    {
      id: "shop-catalog",
      label: "Shop by Catalog",
      icon: Grid,
      route: "/admin-dashboard/shop-catalog",
      description: "Explore complete collection"
    },
    {
      id: "shop-accessories",
      label: "Shop Accessories",
      icon: Package,
      route: "/admin-dashboard/shop-accessories",
      description: "Jewelry accessories"
    },
    {
      id: "best-seller",
      label: "Best Seller",
      icon: Star,
      route: "/admin-dashboard/best-seller",
      description: "Most popular items"
    },
    {
      id: "new-arrivals",
      label: "New Arrivals",
      icon: Clock,
      route: "/admin-dashboard/new-arrivals",
      description: "Latest designs"
    }
  ];

  // Admin navigation items
  const adminItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      route: "/admin-dashboard",
      description: "Admin overview"
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      route: "/admin-products",
      description: "Manage products"
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      route: "/admin-orders",
      description: "View all orders"
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      route: "/admin-customers",
      description: "Customer management"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      route: "/admin-settings",
      description: "Store settings"
    }
  ];

  const navigationItems = variant === "admin" ? adminItems : productItems;

  const handleNavigation = (item) => {
    setActiveItem(item.id);
    router.push(item.route);
    onClose(); // Close sidebar after navigation (for mobile)
  };

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem("adminToken");
    router.push("/admin-login");
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 ${position === "left" ? "left-0" : "right-0"} 
        z-50 w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200 
        transform ${isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] rounded-lg flex items-center justify-center">
              <Grid className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">
                {variant === "admin" ? "Admin Panel" : "Kaushalya Art"}
              </span>
              <p className="text-xs text-gray-600">
                {variant === "admin" ? "Management Console" : "Jewelry Collections"}
              </p>
            </div>
          </div>
          
          {showCloseButton && (
            <button 
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`
                flex items-center justify-between w-full p-4 text-left rounded-xl 
                transition-all duration-200 group
                ${activeItem === item.id 
                  ? "bg-gradient-to-r from-[#FDE6E1] to-[#FBDBD5] text-[#8C3C4E] shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${activeItem === item.id 
                    ? "bg-white text-[#8C3C4E]" 
                    : "bg-gray-100 text-gray-600 group-hover:bg-white"
                  }
                `}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </div>
              <ChevronRight className={`
                w-4 h-4 transition-transform duration-200
                ${activeItem === item.id ? "text-[#8C3C4E]" : "text-gray-400"}
                group-hover:translate-x-1
              `} />
            </button>
          ))}
        </nav>

        {/* Footer - Only for admin variant */}
        {variant === "admin" && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full p-4 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;