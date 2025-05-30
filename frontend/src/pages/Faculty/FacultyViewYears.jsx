import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FacultySidebar from './FacultySidebar';
import { FaBars, FaArrowRight } from 'react-icons/fa';

export default function FacultyViewYears() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultyYears = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/faculty/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.years) {
          setYears(response.data.years);
        }
      } catch (err) {
        console.error('Error fetching faculty years:', err);
        setError('Failed to load faculty data');
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyYears();
  }, []);

  const handleYearClick = (year) => {
    navigate(`/faculty/view-wats/${year}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FacultySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="md:hidden p-4 bg-white shadow-sm flex items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 mr-4"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-800">Select Year</h1>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Select Academic Year
          </h1>

          {error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
            </div>
          ) : years.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-800">No years assigned to you</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all hover:-translate-y-1 border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Year {year}</h3>
                    <FaArrowRight className="text-blue-500" />
                  </div>
                  <p className="text-gray-600 mt-2">View WATs for this year</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}