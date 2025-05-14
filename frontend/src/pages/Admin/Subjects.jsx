import React, { useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';


export default function Subjects() {
  const [year, setYear] = useState('E1');
  const [semester, setSemester] = useState('sem1');
  const [subjects, setSubjects] = useState([{ code: '', name: '' }]);

  const handleChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const addSubjectField = () => {
    setSubjects([...subjects, { code: '', name: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/subjects/add', {
        year,
        semester,
        subjects,
      });
      alert('Subjects added/updated successfully!');
      setSubjects([{ code: '', name: '' }]);
    } catch (err) {
      console.error(err);
      alert('Failed to add subjects');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
   
      {/* Main Content with Sidebar */}
      <div className="flex flex-1 bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <AdminSidebar />
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Add Subjects</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Year & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['E1', 'E2', 'E3', 'E4'].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sem1">Semester 1</option>
                    <option value="sem2">Semester 2</option>
                  </select>
                </div>
              </div>

              {/* Subject Fields */}
              <div className="space-y-4">
                {subjects.map((subject, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Subject Code</label>
                      <input
                        type="text"
                        value={subject.code}
                        onChange={(e) => handleChange(idx, 'code', e.target.value)}
                        placeholder="e.g., CS201"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Subject Name</label>
                      <input
                        type="text"
                        value={subject.name}
                        onChange={(e) => handleChange(idx, 'name', e.target.value)}
                        placeholder="enter subject"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={addSubjectField}
                  className="text-blue-600 hover:underline font-medium"
                >
                  + Add another subject
                </button>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Save Subjects
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    
    </div>
  );
}
