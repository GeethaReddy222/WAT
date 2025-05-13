import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';

export default function YearStudents() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sections = ['A', 'B', 'C', 'D', 'E'];

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
        <button 
          onClick={() => navigate(-1)} 
          className="text-blue-600 mr-4"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-800">
          {year} Year Sections
        </h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={() => navigate('/admin/students')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <FiArrowLeft className="mr-2" />
              Back to All Years
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {year} Year Sections
            </h1>
            <p className="text-gray-600 mt-2">
              Select a section to view students
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {sections.map(section => (
              <div 
                key={section}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-l-4 border-green-500"
                onClick={() => navigate(`/admin/students/${year}/${section}`)}
              >
                <h2 className="text-3xl font-bold text-center text-green-600 mb-2">
                  {section}
                </h2>
                <p className="text-center text-gray-600">Section</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}