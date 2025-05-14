import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';

export default function StudentManagement() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const years = ['E1', 'E2', 'E3', 'E4'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-white shadow-sm flex items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-blue-600 mr-4"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-800">
          Student Management
        </h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Student Management
            </h1>
            <p className="text-gray-600 mt-2">
              Select academic year to view students
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {years.map(year => (
              <div 
                key={year}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500"
                onClick={() => navigate(`/admin/students/${year}`)}
              >
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">
                  {year}
                </h2>
                <p className="text-center text-gray-600">Year</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}