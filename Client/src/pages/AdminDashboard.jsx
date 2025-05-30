import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reportedListings, setReportedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'analytics':
          const { data: analyticsData } = await axios.get('http://localhost:5000/admin/analytics');
          setAnalytics(analyticsData);
          break;
        case 'users':
          const { data: usersData } = await axios.get('http://localhost:5000/admin/users');
          setUsers(usersData);
          break;
        case 'properties':
          const { data: propertiesData } = await axios.get('http://localhost:5000/admin/properties');
          setProperties(propertiesData);
          break;
        case 'categories':
          const { data: categoriesData } = await axios.get('http://localhost:5000/admin/categories');
          setCategories(categoriesData);
          break;
        case 'reports':
          const { data: reportsData } = await axios.get('http://localhost:5000/admin/reported-listings');
          setReportedListings(reportsData);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleUpdatePropertyStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/admin/properties/${id}/status`, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  const handleUpdateUserStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/admin/users/${id}/status`, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/properties/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleAddCategory = async (name, description) => {
    try {
      await axios.post('http://localhost:5000/admin/categories', { name, description });
      fetchData();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleRemoveCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/categories/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error removing category:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <nav className="flex border-b">
            {['analytics', 'users', 'properties', 'categories', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'analytics' && analytics && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium">Total Users</h3>
                        <p className="text-3xl font-bold mt-2">{analytics.users.total}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium">Premium Users</h3>
                        <p className="text-3xl font-bold mt-2">{analytics.users.premium}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium">Regular Users</h3>
                        <p className="text-3xl font-bold mt-2">{analytics.users.regular}</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium mb-4">Property Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Total Properties</h4>
                          <p className="text-2xl font-bold">{analytics.properties.total}</p>
                        </div>
                        {Object.entries(analytics.properties.byStatus).map(([status, count]) => (
                          <div key={status}>
                            <h4 className="text-sm font-medium text-gray-500">{status}</h4>
                            <p className="text-2xl font-bold">{count}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {analytics.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className={`w-2 h-2 mt-2 rounded-full ${
                                activity.type === 'property' ? 'bg-green-500' :
                                activity.type === 'user' ? 'bg-blue-500' : 'bg-red-500'
                              }`}></div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-sm text-gray-500">
                                {activity.title || activity.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(activity.date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleUpdateUserStatus(user._id, user.status === 'active' ? 'inactive' : 'active')}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Toggle Status
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'properties' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {properties.map((property) => (
                          <tr key={property._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{property.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{property.propertyType?.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {property.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button
                                onClick={() => handleUpdatePropertyStatus(property._id, property.status === 'active' ? 'inactive' : 'active')}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Toggle Status
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">Add New Category</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const name = e.target.name.value;
                        const description = e.target.description.value;
                        handleAddCategory(name, description);
                        e.target.reset();
                      }} className="space-y-4">
                        <div>
                          <input
                            type="text"
                            name="name"
                            placeholder="Category Name"
                            required
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                          Add Category
                        </button>
                      </form>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {categories.map((category) => (
                            <tr key={category._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                              <td className="px-6 py-4">{category.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => handleRemoveCategory(category._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportedListings.map((report) => (
                          <tr key={report._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{report.propertyId?.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{report.reportedBy?.name}</td>
                            <td className="px-6 py-4">{report.reason}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {report.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 