import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../Student/StudentSidebar';
import { FaBars, FaBook, FaSearch, FaTrophy } from 'react-icons/fa';

export default function ViewMarks() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const student = JSON.parse(localStorage.getItem('user'));
        if (!student?.id) {
          navigate('/login');
          return;
        }
        
        const res = await axios.get(
          `http://localhost:4000/api/wats/submissions/${student.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        // Filter out invalid submissions
        const validSubmissions = res.data.filter(sub => {
          return (
            typeof sub.score === 'number' && 
            typeof sub.totalQuestions === 'number' &&
            sub.watDetails?.subject &&
            sub.watDetails?.watNumber
          );
        });
        
        setSubmissions(validSubmissions);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError(err.response?.data?.error || 'Failed to fetch results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [navigate]);

  const organizeResults = () => {
    const subjectMap = {};
    
    // Process each submission
    submissions.forEach(submission => {
      const { subject, watNumber } = submission.watDetails;
      const percentage = Math.round((submission.score / submission.totalQuestions) * 10);
      
      // Initialize subject if not exists
      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          subject,
          wats: {},
          percentages: []
        };
      }
      
      // Store the WAT result
      subjectMap[subject].wats[watNumber] = {
        score: submission.score,
        total: submission.totalQuestions,
        percentage: percentage
      };
      
      // Store percentage for average calculation
      subjectMap[subject].percentages.push(percentage);
    });

    // Calculate best 3 averages for each subject
    Object.values(subjectMap).forEach(subject => {
      // Sort percentages in descending order and take top 3
      const sortedPercentages = [...subject.percentages].sort((a, b) => b - a);
      const best3 = sortedPercentages.slice(0, 3);
      
      subject.best3Avg = best3.length > 0
        ? Math.round(best3.reduce((sum, p) => sum + p, 0) / best3.length)
        : null;
    });

    // Get all unique WAT numbers across all subjects
    const allWatNumbers = Array.from(
      new Set(
        submissions.map(sub => sub.watDetails.watNumber)
      )
    ).sort((a, b) => a - b);

    return {
      subjects: Object.values(subjectMap),
      watNumbers: allWatNumbers
    };
  };

  const { subjects: subjectResults, watNumbers } = organizeResults();

  const filteredResults = subjectResults.filter(result =>
    result.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your results...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className="text-red-500 text-xl font-medium mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Your WAT Results</h1>
            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                className="pl-10 pr-3 py-2 border rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FaBook className="mx-auto text-4xl text-blue-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">No WATs Completed Yet</h3>
              <p className="text-gray-600 mb-4">You haven't completed any WATs yet.</p>
              <button 
                onClick={() => navigate('/student/wats')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                View Available WATs
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      {watNumbers.map(num => (
                        <th key={num} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                           {num}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Best 3 Avg 
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((subject, idx) => (
                        <tr key={`${subject.subject}-${idx}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {subject.subject}
                          </td>
                          {watNumbers.map(num => {
                            const wat = subject.wats[num];
                            return (
                              <td key={num} className="px-6 py-4 whitespace-nowrap text-center">
                                {wat ? (
                                  <div className="flex flex-col items-center">
                                    <span className="font-medium">
                                      {wat.score}
                                    </span>
                                    {/* <span className={`text-xs ${wat.percentage >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                                      ({wat.percentage})
                                    </span> */}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-6 py-4 whitespace-nowrap text-center font-medium">
                            {subject.best3Avg !== null ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                subject.best3Avg >= 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {subject.best3Avg}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={watNumbers.length + 2} className="px-6 py-4 text-center text-gray-500">
                          No subjects match your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}