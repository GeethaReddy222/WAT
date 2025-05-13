import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';

export default function FacultyDetails() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const token = localStorage.getItem('admin');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        };

        const response = await axios.get('http://localhost:4000/faculty/all', config);
        console.log("res", response);
        setFacultyList(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching faculty data:', err);
        setError('Failed to load faculty details');
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  const filteredFacultyList = facultyList.filter(faculty =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Faculty Members
              </h1>
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Years
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subjects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFacultyList.map((faculty) => (
                    <tr key={faculty._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {faculty.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {faculty.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          {faculty.years?.map((year) => (
                            <span 
                              key={year}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {year}
                            </span>
                          ))}
                          {!faculty.years?.length && (
                            <span className="text-gray-400 text-sm">Not assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Object.entries(faculty.subjects).map(([year, subjects]) => (
                          <div key={year} className="mb-2">
                            <span className="font-medium">{year}:</span> {subjects.join(', ')}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {faculty.contact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredFacultyList.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No faculty members found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
