"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
} from "lucide-react";

import OrdersSection from "@/components/OrdersSection/OrdersSection";
import ProductsSection from "@/components/ProductsSection/ProductsSection";
import CustomersSection from "@/components/CustomersSection/CustomersSection";
import SettingsSection from "@/components/SettingsSection/SettingsSection";

export default function AdminDashboard() {
  const BASE_URL = "http://localhost:3085/api";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const router = useRouter();

  // ✅ Authentication check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/admin-login");
    else fetchDashboardData();
  }, [router]);

  // ✅ Fetch data from backend controllers
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/stats`);
      if (res.data.success) {
        setStats(res.data.data);
        setRecentOrders(res.data.data.recentOrders || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin-login");
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // ✅ Dashboard Section (Dynamic)
  const DashboardSection = () => {
    if (!stats)
      return (
        <div className="text-center text-gray-600">
          No data available from server.
        </div>
      );

    const statCards = [
      {
        title: "Total Revenue",
        value: `₹${stats.totalRevenue.toLocaleString()}`,
        change: "+12.5%",
        trend: "up",
        icon: DollarSign,
        color: "from-green-500 to-emerald-600",
      },
      {
        title: "Total Orders",
        value: stats.totalOrders,
        change: "+8.2%",
        trend: "up",
        icon: ShoppingBag,
        color: "from-blue-500 to-cyan-600",
      },
      {
        title: "Total Customers",
        value: stats.totalCustomers,
        change: "+15.3%",
        trend: "up",
        icon: Users,
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "Top States",
        value: stats.topStates?.[0]?.state || "N/A",
        change: `${stats.topStates?.[0]?.orderCount || 0} Orders`,
        trend: "up",
        icon: Package,
        color: "from-orange-500 to-red-500",
      },
    ];

    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here’s your store performance summary.
          </p>
        </div>

        {/* ========== STAT CARDS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* ========== RECENT ORDERS ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Orders
              </h3>
              <button
                onClick={() => handleNavigation("orders")}
                className="text-[#8C3C4E] text-sm font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No recent orders found.
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.orderId}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.firstName} {order.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{order.total}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.orderStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TOP STATES */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Top States by Orders
              </h3>
            </div>

            {stats.topStates?.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No data available.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topStates.map((state, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition"
                  >
                    <span className="font-medium text-gray-800">
                      {state.state}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {state.orderCount} Orders
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // ✅ Render Section Switch
  const renderContent = () => {
    switch (activeSection) {
      case "orders":
        return <OrdersSection />;
      case "products":
        return <ProductsSection />;
      case "customers":
        return <CustomersSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardSection />;
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

  // ✅ Full Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE6E1] to-[#F8F0ED]">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#8C3C4E] to-[#B25C6F] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Kaushalya Art
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {["dashboard", "orders", "products", "customers", "settings"].map(
            (section) => (
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
            )
          )}
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
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <div className="text-right">
                <p className="font-semibold text-gray-900">Admin User</p>
                <p className="text-sm text-gray-600">
                  mansurimonis@gmail.com
                </p>
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
