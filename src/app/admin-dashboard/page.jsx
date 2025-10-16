"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, Users, DollarSign, Package, 
  TrendingUp, TrendingDown, LogOut, 
  Menu, X, BarChart3, Settings
} from "lucide-react";

// ✅ Import your separate components
import OrdersSection from "@/components/OrdersSection/OrdersSection";
import ProductsSection from "@/components/ProductsSection/ProductsSection";
import CustomersSection from "@/components/CustomersSection/CustomersSection";
import SettingsSection from "@/components/SettingsSection/SettingsSection";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin-login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin-login");
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // Dashboard sample data
  const stats = [
    { title: "Total Revenue", value: "₹2,84,299", change: "+12.5%", trend: "up", icon: DollarSign, color: "from-green-500 to-emerald-600" },
    { title: "Total Orders", value: "1,428", change: "+8.2%", trend: "up", icon: ShoppingBag, color: "from-blue-500 to-cyan-600" },
    { title: "Total Customers", value: "892", change: "+15.3%", trend: "up", icon: Users, color: "from-purple-500 to-indigo-600" },
    { title: "Products", value: "156", change: "+3.1%", trend: "up", icon: Package, color: "from-orange-500 to-red-500" }
  ];

  const recentOrders = [
    { id: "#ORD-2841", customer: "Priya Sharma", amount: "₹2,499", status: "Delivered", date: "2 Dec 2024" },
    { id: "#ORD-2840", customer: "Rahul Verma", amount: "₹1,899", status: "Shipped", date: "1 Dec 2024" },
    { id: "#ORD-2839", customer: "Neha Patel", amount: "₹3,299", status: "Processing", date: "1 Dec 2024" },
    { id: "#ORD-2838", customer: "Amit Kumar", amount: "₹899", status: "Delivered", date: "30 Nov 2024" },
    { id: "#ORD-2837", customer: "Sneha Singh", amount: "₹2,199", status: "Delivered", date: "30 Nov 2024" }
  ];

  const topProducts = [
    { name: "Viva Drop Victorian Set", sales: 142, revenue: "₹3,54,958" },
    { name: "Kundan Premium Necklace", sales: 98, revenue: "₹2,45,100" },
    { name: "American Diamond Set", sales: 87, revenue: "₹1,98,750" },
    { name: "Heritage Collection", sales: 76, revenue: "₹1,87,320" },
    { name: "Victorian Hasli", sales: 65, revenue: "₹1,52,400" }
  ];

  // Dashboard JSX (kept here only)
  const DashboardSection = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-semibold">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-[#8C3C4E] text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Top Products</h3>
            <button className="text-[#8C3C4E] text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.revenue}</p>
                  <p className="text-sm text-green-600">+12.5%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Switch between components
  const renderContent = () => {
    switch (activeSection) {
      case "orders": return <OrdersSection />;
      case "products": return <ProductsSection />;
      case "customers": return <CustomersSection />;
      case "settings": return <SettingsSection />;
      default: return <DashboardSection />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDE6E1] to-[#F8F0ED] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C3C4E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE6E1] to-[#F8F0ED]">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Kaushalya Art</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {["dashboard", "orders", "products", "customers", "settings"].map((section) => (
            <button 
              key={section}
              onClick={() => handleNavigation(section)}
              className={`flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl font-semibold transition-colors ${
                activeSection === section 
                  ? "bg-[#FDE6E1] text-[#8C3C4E]" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {section === "dashboard" && <BarChart3 className="w-5 h-5" />}
              {section === "orders" && <ShoppingBag className="w-5 h-5" />}
              {section === "products" && <Package className="w-5 h-5" />}
              {section === "customers" && <Users className="w-5 h-5" />}
              {section === "settings" && <Settings className="w-5 h-5" />}
              <span className="capitalize">{section}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <div className="text-right">
                <p className="font-semibold text-gray-900">Admin User</p>
                <p className="text-sm text-gray-600">mansurimonis@gmail.com</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">M</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{renderContent()}</main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
