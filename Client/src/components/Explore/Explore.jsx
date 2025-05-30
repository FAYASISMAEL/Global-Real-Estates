import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "All India",
    propertyType: "",
    priceRange: "",
    sortBy: "newest"
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.location && filters.location !== "All India") {
        queryParams.append('location', filters.location);
      }
      if (filters.propertyType) {
        queryParams.append('propertyType', filters.propertyType);
      }
      if (filters.priceRange) {
        switch (filters.priceRange) {
          case 'Below ₹50L':
            queryParams.append('maxPrice', '50');
            break;
          case '₹50L - ₹1Cr':
            queryParams.append('minPrice', '50');
            queryParams.append('maxPrice', '100');
            break;
          case 'Above ₹1Cr':
            queryParams.append('minPrice', '100');
            break;
        }
      }

      const url = `http://localhost:5000/api/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      
      const sortedData = [...data].sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'price-low-high':
            return a.price - b.price;
          case 'price-high-low':
            return b.price - a.price;
          default:
            return 0;
        }
      });
      
      setProperties(sortedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      location: "All India",
      propertyType: "",
      priceRange: "",
      sortBy: "newest"
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition"
        >
          <span className="mr-2">←</span> Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              className="border px-4 py-2 rounded w-full cursor-pointer"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="All India">All India</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Kerala">Kerala</option>
            </select>

            <select
              className="border px-4 py-2 rounded w-full cursor-pointer"
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <option value="">All Property Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
            </select>

            <select
              className="border px-4 py-2 rounded w-full cursor-pointer"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="">All Price Ranges</option>
              <option value="Below ₹50L">Below ₹50L</option>
              <option value="₹50L - ₹1Cr">₹50L - ₹1Cr</option>
              <option value="Above ₹1Cr">Above ₹1Cr</option>
            </select>

            <select
              className="border px-4 py-2 rounded w-full cursor-pointer"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded transition"
            >
              Reset Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {filters.location !== "All India" && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                📍 {filters.location}
                <button
                  onClick={() => handleFilterChange('location', 'All India')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {filters.propertyType && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                🏠 {filters.propertyType}
                <button
                  onClick={() => handleFilterChange('propertyType', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {filters.priceRange && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                💰 {filters.priceRange}
                <button
                  onClick={() => handleFilterChange('priceRange', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProperties}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No properties found matching your criteria.</p>
            <button
              onClick={handleResetFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/preview/${property._id}`)}
              >
                <div className="relative h-48">
                  <img
                    src={`http://localhost:5000${property.images[0].startsWith('/') ? property.images[0] : `/${property.images[0]}`}`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-property.jpg';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-semibold">{property.priceString}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {property.propertyType}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.listingType === 'rent' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{property.size} sqft</span>
                    <div className="flex items-center gap-2">
                      <span>{property.bedrooms} Beds</span> • 
                      <span>{property.bathrooms} Baths</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore; 