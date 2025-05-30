import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FacultySidebar from './FacultySidebar';
import { FaBars, FaArrowLeft } from 'react-icons/fa';

export default function StudentsDetails() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedYears = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get('http://localhost:4000/faculty/assigned-years', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setYears(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch assigned years');
        }
      } catch (err) {
        console.error('Error fetching years:', err);
        setError(err.response?.data?.message || 'Failed to load assigned years');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedYears();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FacultySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="md:hidden p-4 bg-white shadow-sm flex items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-blue-600 mr-4">
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-800">Student Details</h1>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Assigned Years</h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
            </div>
          ) : years.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No Years Assigned
              </h3>
              <p className="text-gray-500 mb-4">
                You haven't been assigned to any years yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {years.map((year) => (
                <div 
                  key={year} 
                  onClick={() => navigate(`/faculty/student-details/${year}`)}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition transform hover:scale-105 hover:shadow-lg border-l-4 border-blue-500"
                >
                  <div className="flex flex-col items-center">
                    <h2 className="text-4xl font-bold text-blue-600 mb-2">{year}</h2>
                    <p className="text-gray-600">Year</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}