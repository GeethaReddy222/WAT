
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserGraduate, FaClipboardList, FaPlusCircle } from 'react-icons/fa';
import FacultySidebar from './FacultySidebar';

export default function Faculty() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [facultyName, setFacultyName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('facultyName');
    if (storedName) {
      setFacultyName(storedName);
    }
  }, []);

  // Reordered cards as requested
  const cards = [
      {
      title: 'Create WAT',
      description: 'create a new wat by usig syllubus.',
      icon: <FaPlusCircle className="text-3xl text-purple-600 mb-2" />,
      onClick: () => navigate('/faculty/mcqs'),
    },
    {
      title: 'View WATs',
      description: 'View all active WATs.',
      icon: <FaClipboardList className="text-3xl text-green-600 mb-2" />,
      onClick: () => navigate('/faculty/view-wats'), // Updated path
    },
    {
      title: 'Student Details',
      description: 'View year-wise student data .',
      icon: <FaUserGraduate className="text-3xl text-blue-600 mb-2" />,
      onClick: () => navigate('/faculty/students-details'), // Updated path
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-blue-600 text-2xl">
          <FaBars />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <FacultySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 mt-8 overflow-y-auto flex flex-col items-center">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">Welcome, {facultyName || 'Faculty'} 👋</h2>
            <p className="text-gray-600">Here's what you can do today</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <div
                key={idx}
                onClick={card.onClick}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  {card.icon}
                  <h3 className="text-xl font-semibold text-center">{card.title}</h3>
                  <p className="text-gray-500 text-center text-sm mt-2">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}