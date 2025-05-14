
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './StudentSidebar.jsx';

export default function Student() {
  const [wats, setWats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentYear, setStudentYear] = useState('');
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const year = localStorage.getItem('year');
    console.log("Year from localStorage:", year);
    
    if (year) {
      setStudentYear(year);
    } else {
      console.error('Student year not found in localStorage');
      setError('Student year not found. Please log in again.');
      setLoading(false);
      navigate('/student-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!studentYear) return;

    const fetchWats = async () => {
      setLoading(true);
      try {
        console.log(`Fetching WATs for year: ${studentYear}`);
        const response = await axios.get(
          `http://localhost:4000/api/wats/by-year/${studentYear}`
        );
        
        console.log("API Response:", response.data);
        
        if (!response.data || response.data.length === 0) {
          setError('No WATs found for your year');
        } else {
          setWats(response.data);
        }
      } catch (err) {
        console.error('Error fetching WATs:', err);
        setError('Failed to load WATs. Please try again later.');
        if (err.response) {
          console.error("Server responded with:", err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWats();
  }, [studentYear]);

  const currentTime = new Date();

  // Filter only active WATs
  const activeWats = wats.filter(wat => {
    const start = new Date(wat.startTime);
    const end = new Date(wat.endTime);
    return currentTime >= start && currentTime <= end;
  });

  if (error) {
    return (
      <div className="flex min-h-screen">
        <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 max-w-4xl mx-auto p-6 mt-8">
          <h2 className="text-3xl font-bold text-center mb-6">Available WATs for {studentYear}</h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 mt-8">
          <h2 className="text-3xl font-bold text-center mb-6">
            Active WATs for {studentYear}
          </h2>

          {loading ? (
  <div className="flex flex-col items-center justify-center py-12 space-y-3">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-500"></div>
    <p className="text-gray-500 font-medium text-sm">Loading WATs...</p>
  </div>
) : activeWats.length === 0 ? (
  <div className="text-center py-12 px-6 bg-gray-50 rounded-lg max-w-md mx-auto">
    <svg
      className="mx-auto h-10 w-10 text-gray-400 animate-fade-in"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h3 className="mt-3 text-base font-medium text-gray-700">No Active WATs Found</h3>
    
  </div>
): (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeWats.map((wat) => {
                const start = new Date(wat.startTime);
                const end = new Date(wat.endTime);

                return (
                  <div key={wat._id} className="border border-gray-300 rounded-lg p-4 shadow-md bg-white">
                    <h3 className="text-xl font-semibold text-blue-700">
                      {wat.subject} - WAT {wat.watNumber}
                    </h3>
                    <p><strong>Start Time:</strong> {start.toLocaleString()}</p>
                    <p><strong>End Time:</strong> {end.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2 font-medium">This WAT is currently active</p>
                    <a
                      href={`/wats/${wat._id}`}
                      className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Attempt WAT
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}