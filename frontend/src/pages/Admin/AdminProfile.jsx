import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar'; // ✅ import your sidebar
import { FaBars } from 'react-icons/fa';

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:4000/admin/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAdmin(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching admin profile:', err);
        setError(
          err.response?.data?.message ||
            'Failed to fetch admin profile. Please try again later.'
        );
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-blue-600 text-2xl">
          <FaBars />
        </button>
        <h1 className="text-blue-600 font-bold text-lg">Admin Panel</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Profile Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full w-24 h-24 flex items-center justify-center text-3xl font-semibold shadow-lg">
                {admin?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-4 text-xl font-bold text-blue-600">{admin?.name}</h2>
              <p className="mt-2 text-gray-600">{admin?.email}</p>
              <p className="mt-2 text-gray-600">{admin?.contactNumber}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
