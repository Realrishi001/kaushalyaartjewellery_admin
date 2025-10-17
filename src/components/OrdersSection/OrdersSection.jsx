"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FileDown, Loader2, Download, Barcode, RefreshCcw } from "lucide-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import JsBarcode from "jsbarcode";

export default function OrdersSection() {
  const BASE_URL = "http://localhost:3085/api/orders";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Fetch all orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Filter orders based on search input
  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Export all orders to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders_report.xlsx");
  };

  // ✅ Generate invoice with barcode (PDF)
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    // Header Section with Brand
    doc.setFillColor(140, 60, 78); // #8C3C4E
    doc.rect(0, 0, 210, 35, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("KAUSHALYA ART", 14, 15);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Artworks & Crafts", 14, 22);
    doc.text("www.kaushalyaart.com | contact@kaushalyaart.com", 14, 28);

    // Invoice Title & Barcode
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 14, 48);

    // Generate Barcode
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, order.orderId, { 
      format: "CODE128", 
      width: 1.5, 
      height: 35,
      displayValue: false 
    });
    const barcodeData = canvas.toDataURL("image/png");
    doc.addImage(barcodeData, "PNG", 145, 40, 50, 15);

    // Invoice Details Box
    doc.setFillColor(253, 230, 225); // #FDE6E1
    doc.roundedRect(14, 60, 85, 35, 2, 2, "F");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 60, 78);
    doc.text("INVOICE DETAILS", 18, 67);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Invoice No: ${order.orderId}`, 18, 74);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 18, 80);
    doc.text(`Payment: ${order.paymentMethod}`, 18, 86);
    doc.text(`Status: ${order.orderStatus}`, 18, 92);

    // Shipping Address Box
    doc.setFillColor(253, 230, 225);
    doc.roundedRect(111, 60, 85, 35, 2, 2, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 60, 78);
    doc.text("SHIP TO", 115, 67);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`${order.firstName} ${order.lastName}`, 115, 74);
    doc.text(`${order.phone}`, 115, 80);
    
    const addressLines = doc.splitTextToSize(
      `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`, 
      70
    );
    doc.text(addressLines, 115, 86);

    // Items Table
    const items = Array.isArray(order.items)
      ? order.items.map((item, index) => [
          index + 1,
          item.name || "N/A",
          item.quantity || 1,
          `Rs ${parseFloat(item.price || 0).toFixed(2)}`,
          `Rs ${parseFloat(item.total || 0).toFixed(2)}`,
        ])
      : [];

    autoTable(doc, {
      startY: 105,
      head: [["#", "Item Description", "Qty", "Unit Price", "Amount"]],
      body: items,
      theme: "striped",
      headStyles: {
        fillColor: [140, 60, 78],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 90 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 32, halign: "right" },
      },
      alternateRowStyles: {
        fillColor: [253, 246, 245],
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
    });

    // Summary Section
    const finalY = doc.lastAutoTable?.finalY || 120;
    const summaryX = 125;
    
    // Helper function to safely format numbers
    const formatCurrency = (value) => {
      const num = parseFloat(value) || 0;
      return num.toFixed(2);
    };
    
    doc.setDrawColor(200, 200, 200);
    doc.line(summaryX - 5, finalY + 10, 196, finalY + 10);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Subtotal:", summaryX, finalY + 18);
    doc.text(`Rs ${formatCurrency(order.subtotal)}`, 196, finalY + 18, { align: "right" });
    
    doc.text("Tax (GST):", summaryX, finalY + 25);
    doc.text(`Rs ${formatCurrency(order.tax)}`, 196, finalY + 25, { align: "right" });
    
    doc.text("Shipping:", summaryX, finalY + 32);
    doc.text(`Rs ${formatCurrency(order.shipping)}`, 196, finalY + 32, { align: "right" });
    
    doc.line(summaryX - 5, finalY + 36, 196, finalY + 36);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(140, 60, 78);
    doc.text("Total:", summaryX, finalY + 45);
    doc.text(`Rs ${formatCurrency(order.total)}`, 196, finalY + 45, { align: "right" });

    // Footer Section
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 270, 210, 27, "F");
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your business!", 105, 278, { align: "center" });
    doc.text("For any queries, please contact us at support@kaushalyaart.com", 105, 284, { align: "center" });
    
    doc.setFontSize(7);
    doc.text("This is a computer-generated invoice and does not require a signature.", 105, 291, { align: "center" });

    // Save PDF
    doc.save(`Invoice_${order.orderId}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-700">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading orders...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <div className="flex space-x-3">
          <button
            onClick={exportToExcel}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export Excel
          </button>
          <button
            onClick={fetchOrders}
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#8C3C4E] focus:outline-none"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#FDE6E1] text-gray-800 text-left">
              <th className="p-3 border-b">Order ID</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Total</th>
              <th className="p-3 border-b">Payment</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="p-3 font-semibold text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="p-3 text-gray-700">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="p-3 text-gray-800 font-semibold">
                    ₹{order.total}
                  </td>
                  <td className="p-3 text-gray-700">{order.paymentMethod}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                  </td>
                  <td className="p-3 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => downloadInvoice(order)}
                      className="bg-[#8C3C4E] hover:bg-[#7A3243] text-white px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center transition"
                    >
                      <Barcode className="w-3.5 h-3.5 mr-1" /> Invoice
                    </button>
                    <button
                      onClick={() => downloadInvoice(order)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center transition"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}