import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 150,
    totalProperties: 324,
    totalCategories: 8,
    reportedListings: 5,
    recentActivity: [
      { id: 1, action: 'New Property Listed', date: '2024-03-20' },
      { id: 2, action: 'User Registration', date: '2024-03-19' },
      { id: 3, action: 'Property Reported', date: '2024-03-18' },
    ]
  });

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'properties' ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('properties')}
          >
            Properties
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'reported' ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('reported')}
          >
            Reported Listings
          </button>
        </div>

        {activeTab === 'analytics' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-indigo-800">Total Users</h3>
                <p className="text-3xl font-bold text-indigo-600">{analyticsData.totalUsers}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Total Properties</h3>
                <p className="text-3xl font-bold text-green-600">{analyticsData.totalProperties}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800">Categories</h3>
                <p className="text-3xl font-bold text-yellow-600">{analyticsData.totalCategories}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-red-800">Reported Listings</h3>
                <p className="text-3xl font-bold text-red-600">{analyticsData.reportedListings}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center bg-gray-50 p-4 rounded">
                    <span>{activity.action}</span>
                    <span className="text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">User Management</h2>
            {/* Add user management content here */}
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Property Management</h2>
            {/* Add property management content here */}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Category Management</h2>
            {/* Add category management content here */}
          </div>
        )}

        {activeTab === 'reported' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Reported Listings</h2>
            {/* Add reported listings content here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 