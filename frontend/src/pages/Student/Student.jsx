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
  const [submissions, setSubmissions] = useState([]);
  const [studentId, setStudentId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const year = localStorage.getItem('year');
    const id = localStorage.getItem('_id'); // Changed from 'studentId' to '_id'
    console.log("Year from localStorage:", year);
    console.log("Student _id from localStorage:", id);
    
    if (year && id) {
      setStudentYear(year);
      setStudentId(id);
    } else {
      console.error('Student data not found in localStorage');
      setError('Student data not found. Please log in again.');
      setLoading(false);
      navigate('/student-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!studentYear || !studentId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [watsResponse, submissionsResponse] = await Promise.all([
          axios.get(`http://localhost:4000/api/wats/active/by-year/${studentYear}`),
          axios.get(`http://localhost:4000/api/wats/submissions/student/${studentId}`)
        ]);
        
        console.log("WATs Response:", watsResponse.data);
        console.log("Submissions Response:", submissionsResponse.data);
        
        setWats(watsResponse.data);
        setSubmissions(submissionsResponse.data);
        
        if (!watsResponse.data || watsResponse.data.length === 0) {
          setError('No active WATs found for your year');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        if (err.response) {
          console.error("Server responded with:", err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentYear, studentId]);

  const hasAttempted = (watId) => {
    return submissions.some(sub => sub.watId === watId);
  };

  if (error) {
    return (
      <div className="flex min-h-screen">
        <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 max-w-4xl mx-auto p-6 mt-8">
          <h2 className="text-3xl font-bold text-center mb-6">Available WATs for {studentYear}</h2>
          <p className="text-center text-500">{error}</p>
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
          ) : wats.length === 0 ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wats.map((wat) => {
                const start = new Date(wat.startTime);
                const end = new Date(wat.endTime);
                const attempted = hasAttempted(wat._id);

                return (
                  <div key={wat._id} className={`border border-gray-300 rounded-lg p-4 shadow-md ${attempted ? 'bg-gray-50' : 'bg-white'}`}>
                    <h3 className="text-xl font-semibold text-blue-700">
                      {wat.subject} - WAT {wat.watNumber}
                    </h3>
                    <p><strong>Start Time:</strong> {start.toLocaleString()}</p>
                    <p><strong>End Time:</strong> {end.toLocaleString()}</p>
                    {attempted ? (
                      <>
                        <p className="text-sm text-green-600 mt-2 font-medium">You have already attempted this WAT</p>
                        <button
                          disabled
                          className="mt-3 inline-block bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                        >
                          Attempted
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-green-600 mt-2 font-medium">This WAT is currently active</p>
                        <a
                          href={`/wats/${wat._id}`}
                          className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Attempt WAT
                        </a>
                      </>
                    )}
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