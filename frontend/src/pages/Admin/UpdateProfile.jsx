import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

export default function UpdateProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    contactNumber: '',
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:4000/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setAdminData({
            name: res.data.name || '',
            email: res.data.email || '',
            contactNumber: res.data.contactNumber || '',
          });
        }
      } catch (error) {
        console.error("Error fetching admin data", error);
        setError('Failed to load profile data');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
  
      const res = await axios.put(
        'http://localhost:5000/admin/update', 
        adminData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => navigate('/admin/profile'), 1500);
      }
    } catch (error) {
      console.error("Update error:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.response.status === 403) {
          setError('You do not have permission to perform this action');
        } else {
          setError(error.response.data?.message || 'Error updating profile');
        }
      } else if (error.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !adminData.name) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-blue-600 text-2xl"
        >
          <FaBars />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 overflow-y-auto flex justify-center items-start">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mt-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
              Update Profile
            </h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  value={adminData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  value={adminData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  name="contactNumber"
                  type="tel"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  value={adminData.contactNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10,15}"
                  title="10-15 digit phone number"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}