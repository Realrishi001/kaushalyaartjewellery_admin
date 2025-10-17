"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FileDown, Loader2, RefreshCcw } from "lucide-react";
import * as XLSX from "xlsx";

export default function CustomersSection() {
  const BASE_URL = "http://localhost:3085/api/user";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL);
      if (res.data.success) setUsers(res.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Search filter
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_report.xlsx");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-700">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading customers...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <div className="flex space-x-3">
          <button
            onClick={exportToExcel}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export Excel
          </button>
          <button
            onClick={fetchUsers}
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
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#8C3C4E] focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#FDE6E1] text-gray-800 text-left">
              <th className="p-3 border-b">User ID</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Joined On</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="p-3 text-gray-700 font-semibold">{user.id}</td>
                  <td className="p-3 text-gray-800 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-3 text-gray-700">{user.email}</td>
                  <td className="p-3 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
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
