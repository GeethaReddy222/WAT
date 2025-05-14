import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FacultySidebar from './FacultySidebar';
import { FaBars, FaArrowLeft } from 'react-icons/fa';

export default function SectionDetails() {
  const { year } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sections = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FacultySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="md:hidden p-4 bg-white shadow-sm flex items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-blue-600 mr-4">
          <FaBars size={20} />
        </button>
        <button onClick={() => navigate(-1)} className="text-blue-600 mr-4">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-800">Year {year} Sections</h1>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <button 
                onClick={() => navigate('/faculty/student-details')}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
              >
                <FaArrowLeft className="mr-2" />
                Back to Years
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Sections for Year {year}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {sections.map((section) => (
              <div 
                key={section} 
                onClick={() => navigate(`/faculty/student-details/${year}/${section}`)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition transform hover:scale-105 hover:shadow-lg border-l-4 border-green-500 text-center"
              >
                <h2 className="text-4xl font-bold text-green-600 mb-2">{section}</h2>
                <p className="text-gray-600">Section</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};