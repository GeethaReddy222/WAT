import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FacultySidebar from "./FacultySidebar";
import {
  FaBars,
  FaArrowLeft,
  FaUserGraduate,
  FaFileDownload,
  FaSearch,
} from "react-icons/fa";

export default function FacultyWatResults() {
  const { watId } = useParams();
  const [results, setResults] = useState([]);
  const [watDetails, setWatDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const [watResponse, resultsResponse] = await Promise.all([
          axios.get(`http://localhost:4000/api/wats/wat/${watId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:4000/api/wats/wat-submissions/${watId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!watResponse.data.success) {
          throw new Error("Failed to fetch WAT details");
        }

        if (!resultsResponse.data.success) {
          throw new Error("Failed to fetch WAT results");
        }

        setWatDetails(watResponse.data.data);
        setResults(resultsResponse.data.data);
      } catch (err) {
        console.error("Error fetching WAT results:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load WAT results. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [watId]);

  const filteredResults = results.filter(
    (result) =>
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (result.email &&
        result.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const downloadResults = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    csvContent += "Roll No,Student ID,Name,Email,Score\n";

    // Add data rows
    results.forEach((result) => {
      csvContent += `${result.studentId},${result.rollNumber},${
        result.studentName
      },${result.email || "N/A"},${result.score}\n`;
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${watDetails?.subject}_WAT${watDetails?.watNumber}_results.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FacultySidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-white shadow-sm flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 mr-4"
        >
          <FaBars size={20} />
        </button>
        <button onClick={() => navigate(-1)} className="text-blue-600 mr-4">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-800">WAT Results</h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
              >
                <FaArrowLeft className="mr-2" />
                Back to WATs
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                WAT Results
              </h1>
              {watDetails && (
                <div className="mt-2 text-blue-600">
                  <p className="font-medium">
                    {watDetails.subject} - {watDetails.watNumber}
                  </p>
                  <p className="text-sm">
                    Year : {watDetails.year} • Semester: {watDetails.semester}
                  </p>
                  <p className="text-sm">
                    Total Questions: {watDetails.questions.length}
                  </p>
                </div>
              )}
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
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Student Results
                    </h2>
                    <p className="text-sm text-gray-600">
                      {results.length} students attempted this WAT
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search students..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={downloadResults}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm"
                    >
                      <FaFileDownload className="mr-2" />
                      Export Results
                    </button>
                  </div>
                </div>
              </div>

              {filteredResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Student ID
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Roll No
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResults.map((result, index) => (
                        <tr
                          key={result._id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                            {result.studentId}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                            {result.studentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                            {result.email || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                            {result.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                            {result.score} / {watDetails.questions.length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                    <FaUserGraduate className="text-gray-500 text-3xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {searchTerm
                      ? "No matching students found"
                      : "No students attempted this WAT yet"}
                  </h3>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
