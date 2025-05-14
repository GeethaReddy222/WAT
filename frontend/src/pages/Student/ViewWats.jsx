// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import StudentSidebar from '../Student/StudentSidebar';
// import { FaBars, FaClock, FaCalendarAlt, FaBook, FaHourglassStart, FaHourglassEnd } from 'react-icons/fa';

// export default function ViewWats() {
//   const [wats, setWats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [studentYear, setStudentYear] = useState('');
//   const [error, setError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const year = localStorage.getItem('year');
//     if (year) {
//       setStudentYear(year);
//     } else {
//       setError('Student year not found. Please log in again.');
//       setLoading(false);
//       navigate('/student-login');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (!studentYear) return;

//     const fetchWats = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/wats/by-year/${studentYear}`
//         );
        
//         if (!response.data || response.data.length === 0) {
//           setError('No WATs found for your year');
//         } else {
//           // Sort WATs by start time (newest first)
//           const sortedWats = response.data.sort((a, b) => 
//             new Date(b.startTime) - new Date(a.startTime)
//           );
//           setWats(sortedWats);
//         }
//       } catch (err) {
//         console.error('Error fetching WATs:', err);
//         setError(err.response?.data?.message || 'Failed to load WATs. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWats();
//   }, [studentYear]);

//   const currentTime = new Date();

//   const getWatStatus = (start, end) => {
//     const startTime = new Date(start);
//     const endTime = new Date(end);
    
//     if (currentTime < startTime) return 'upcoming';
//     if (currentTime > endTime) return 'completed';
//     return 'active';
//   };

//   const formatDateTime = (dateString) => {
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit', 
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
//       {/* Mobile Header */}
//       <div className="md:hidden p-4 bg-white shadow-sm flex items-center">
//         <button 
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="text-blue-600 mr-4"
//         >
//           <FaBars size={20} />
//         </button>
//         <h1 className="text-xl font-bold text-blue-800">WAT Examinations</h1>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto p-4 md:p-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex justify-between items-center mb-8">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//               Weekly Assessment Tests ({studentYear})
//             </h1>
//             <div className="flex items-center text-sm text-gray-500">
//               <FaClock className="mr-1" />
//               {currentTime.toLocaleDateString()}
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
//               <p>{error}</p>
//             </div>
//           ) : wats.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
//                 <FaBook className="text-blue-500 text-3xl" />
//               </div>
//               <h3 className="text-xl font-medium text-gray-700 mb-2">
//                 No WATs Scheduled
//               </h3>
//               <p className="text-gray-500">
//                 There are currently no WATs available for your year.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {wats.map((wat) => {
//                 const status = getWatStatus(wat.startTime, wat.endTime);
//                 const statusColors = {
//                   active: 'bg-green-100 text-green-800',
//                   upcoming: 'bg-blue-100 text-blue-800',
//                   completed: 'bg-gray-100 text-gray-800'
//                 };

//                 return (
//                   <div key={wat._id} className={`rounded-lg shadow-md overflow-hidden border-l-4 ${
//                     status === 'active' ? 'border-green-500' :
//                     status === 'upcoming' ? 'border-blue-500' : 'border-gray-400'
//                   }`}>
//                     <div className="bg-white p-6">
//                       <div className="flex justify-between items-start mb-3">
//                         <h3 className="text-lg font-semibold text-gray-800">
//                           {wat.subject}
//                         </h3>
//                         <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
//                           {status.charAt(0).toUpperCase() + status.slice(1)}
//                         </span>
//                       </div>
                      
//                       <p className="text-gray-600 mb-1">
//                         WAT {wat.watNumber}
//                       </p>
                      
//                       <div className="mt-4 space-y-2">
//                         <div className="flex items-center text-sm text-gray-600">
//                           <FaHourglassStart className="mr-2 text-blue-500" />
//                           <span>Starts: {formatDateTime(wat.startTime)}</span>
//                         </div>
//                         <div className="flex items-center text-sm text-gray-600">
//                           <FaHourglassEnd className="mr-2 text-blue-500" />
//                           <span>Ends: {formatDateTime(wat.endTime)}</span>
//                         </div>
//                         <div className="flex items-center text-sm text-gray-600">
//                           <FaClock className="mr-2 text-blue-500" />
//                           <span>Duration: {wat.duration || 'N/A'} minutes</span>
//                         </div>
//                       </div>
                      
//                       <div className="mt-6">
//                         {status === 'active' ? (
//                           <button
//                             onClick={() => navigate(`/wats/${wat._id}`)}
//                             className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
//                           >
//                             Attempt Now
//                           </button>
//                         ) : status === 'upcoming' ? (
//                           <button
                           
//                             className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded-md cursor-not-allowed"
//                           >
//                             Starts Soon
//                           </button>
//                         ) : (
//                           <button
                       
//                             className="w-full bg-gray-200 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed"
//                           >
//                             Completed
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../Student/StudentSidebar';
import { FaBars, FaClock, FaCalendarAlt, FaBook, FaHourglassStart, FaHourglassEnd, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function ViewWats() {
  const [wats, setWats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentYear, setStudentYear] = useState('');
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedWat, setExpandedWat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const year = localStorage.getItem('year');
    if (year) {
      setStudentYear(year);
    } else {
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
        const response = await axios.get(
          `http://localhost:4000/api/wats/by-year/${studentYear}`
        );
        
        if (!response.data || response.data.length === 0) {
          setError('No WATs found for your year');
        } else {
          const sortedWats = response.data.sort((a, b) => 
            new Date(b.startTime) - new Date(a.startTime)
          );
          setWats(sortedWats);
        }
      } catch (err) {
        console.error('Error fetching WATs:', err);
        setError(err.response?.data?.message || 'Failed to load WATs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWats();
  }, [studentYear]);

  const currentTime = new Date();

  const categorizeWats = () => {
    const active = [];
    const upcoming = [];
    const completed = [];

    wats.forEach(wat => {
      const start = new Date(wat.startTime);
      const end = new Date(wat.endTime);
      
      if (currentTime < start) {
        upcoming.push(wat);
      } else if (currentTime > end) {
        completed.push(wat);
      } else {
        active.push(wat);
      }
    });

    return { active, upcoming, completed };
  };

  const { active, upcoming, completed } = categorizeWats();

  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const toggleExpandWat = (watId) => {
    setExpandedWat(expandedWat === watId ? null : watId);
  };

  const renderWatSection = (title, wats, status) => {
    if (wats.length === 0) return null;

    const statusColors = {
      active: 'bg-green-100 text-green-800 border-green-500',
      upcoming: 'bg-blue-100 text-blue-800 border-blue-500',
      completed: 'bg-gray-100 text-gray-800 border-gray-400'
    };

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${statusColors[status].split(' ')[0]}`}></span>
          {title} ({wats.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wats.map((wat) => (
            <div 
              key={wat._id} 
              className={`rounded-lg shadow-md overflow-hidden border-l-4 cursor-pointer transition-all ${
                status === 'active' ? 'border-green-500 hover:shadow-lg' :
                status === 'upcoming' ? 'border-blue-500 hover:shadow-lg' : 
                'border-gray-400 hover:shadow-md'
              }`}
              onClick={() => toggleExpandWat(wat._id)}
            >
              <div className="bg-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {wat.subject}
                    </h3>
                    <p className="text-gray-600">WAT {wat.watNumber}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                {expandedWat === wat._id && (
                  <div className="mt-4 space-y-2 animate-fadeIn">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaHourglassStart className="mr-2 text-blue-500" />
                      <span>Starts: {formatDateTime(wat.startTime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaHourglassEnd className="mr-2 text-blue-500" />
                      <span>Ends: {formatDateTime(wat.endTime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="mr-2 text-blue-500" />
                      <span>Duration: {wat.duration || 'N/A'} minutes</span>
                    </div>
                    {wat.description && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p className="font-medium">Description:</p>
                        <p>{wat.description}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center">
                  <button 
                    className="text-blue-600 text-sm flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpandWat(wat._id);
                    }}
                  >
                    {expandedWat === wat._id ? (
                      <>
                        <FaChevronUp className="mr-1" /> Less details
                      </>
                    ) : (
                      <>
                        <FaChevronDown className="mr-1" /> More details
                      </>
                    )}
                  </button>

                  {status === 'active' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/wats/${wat._id}`);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
                    >
                      Attempt Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-white shadow-sm flex items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 mr-4"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-800">WAT Examinations</h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Weekly Assessment Tests ({studentYear})
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <FaClock className="mr-1" />
              {currentTime.toLocaleDateString()}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
            </div>
          ) : wats.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <FaBook className="text-blue-500 text-3xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No WATs Scheduled
              </h3>
              <p className="text-gray-500">
                There are currently no WATs available for your year.
              </p>
            </div>
          ) : (
            <>
              {renderWatSection("Active WATs", active, 'active')}
              {renderWatSection("Upcoming WATs", upcoming, 'upcoming')}
              {renderWatSection("Completed WATs", completed, 'completed')}
            </>
          )}
        </div>
      </main>
    </div>
  );
}