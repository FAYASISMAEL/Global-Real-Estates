import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperty } from '../Context/PropertyContext';
import BlurText from "../Reactbits/BlurText/BlurText";

const handleAnimationComplete = () => {};

const Home = () => {
  const navigate = useNavigate();
  const { properties, fetchProperties } = useProperty();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({
    location: "All India",
    propertyType: "",
    priceRange: "",
    listingType: ""
  });

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      await fetchProperties();
      setLoading(false);
    };

    loadProperties();
  }, [fetchProperties]);

  const handleFilterChange = (field, value) => {
    setSearchQuery(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery({
      location: "All India",
      propertyType: "",
      priceRange: "",
      listingType: ""
    });
  };

  const filterProperties = () => {
    return properties.filter(property => {
      const locationMatch = searchQuery.location === "All India" || property.location === searchQuery.location;

      const typeMatch = !searchQuery.propertyType || property.propertyType === searchQuery.propertyType;

      const listingMatch = !searchQuery.listingType || property.listingType === searchQuery.listingType;

      let priceMatch = true;
      if (searchQuery.priceRange) {
        const price = parseFloat(property.price);
        switch (searchQuery.priceRange) {
          case 'Below ₹50L':
            priceMatch = price < 50;
            break;
          case '₹50L - ₹1Cr':
            priceMatch = price >= 50 && price <= 100;
            break;
          case 'Above ₹1Cr':
            priceMatch = price > 100;
            break;
          default:
            priceMatch = true;
        }
      }

      return locationMatch && typeMatch && priceMatch && listingMatch;
    });
  };

  const filteredProperties = filterProperties();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <section className="bg-cover bg-center h-[70vh] text-white flex items-center relative bg-[url(/homebg2.jpg)]">
        <div className="w-full h-full flex items-center bg-black/40">
          <div className="max-w-5xl mx-auto px-6 text-left">
            <BlurText
              text="Global Real Estate"
              delay={220}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-md"
            />
            <p className="mt-2 text-lg md:text-xl text-white drop-shadow-md animation-delay-200">
              Urban Luxury Meets Nature
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="mt-6 inline-block bg-transparent border hover:bg-white hover:text-black hover:border-white cursor-pointer text-white px-10 py-3 rounded text-lg transition animation-delay-600"
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 shadow-md -mt-16 relative z-10 rounded-md max-w-6xl mx-auto px-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            <select
              className="border px-4 py-2 rounded w-full cursor-pointer"
              value={searchQuery.location}
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
              value={searchQuery.listingType}
              onChange={(e) => handleFilterChange('listingType', e.target.value)}
            >
              <option value="">All Listing Types</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>

            <select
              className="border px-4 py-2 rounded w-full cursor-pointer"
              value={searchQuery.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <option value="">All Property Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
            </select>

            <select
              className="border px-4 py-2 rounded w-full cursor-pointer"
              value={searchQuery.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="">All Price Ranges</option>
              <option value="Below ₹50L">Below ₹50L</option>
              <option value="₹50L - ₹1Cr">₹50L - ₹1Cr</option>
              <option value="Above ₹1Cr">Above ₹1Cr</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="border px-4 py-2 rounded w-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
            >
              Reset Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {searchQuery.listingType && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                {searchQuery.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                <button
                  onClick={() => handleFilterChange('listingType', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {searchQuery.location !== "All India" && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                {searchQuery.location}
                <button
                  onClick={() => handleFilterChange('location', 'All India')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {searchQuery.propertyType && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                {searchQuery.propertyType}
                <button
                  onClick={() => handleFilterChange('propertyType', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {searchQuery.priceRange && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                {searchQuery.priceRange}
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
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Properties
          </h2>
          {filteredProperties.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">No properties found matching your criteria.</p>
              <button 
                onClick={handleResetFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/preview/${property._id}`)}
                >
                  <div className="relative">
                    <img
                      src={property.images && property.images.length > 0 
                        ? `http://localhost:5000${property.images[0].startsWith('/') ? property.images[0] : `/${property.images[0]}`}`
                        : '/placeholder-property.jpg'}
                      alt={property.title}
                      className="w-full h-52 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-property.jpg';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-semibold text-lg">{property.priceString}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{property.title}</h3>
                      <p className="text-gray-600 text-sm">{property.location}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
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

                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-500">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="font-medium">{property.size}</p>
                        <p className="text-xs">sqft</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="font-medium">{property.bedrooms}</p>
                        <p className="text-xs">Beds</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="font-medium">{property.bathrooms}</p>
                        <p className="text-xs">Baths</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Search</h3>
              <p className="text-gray-600">
                Find the perfect home using filters like location, type, and price.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">2. Schedule Visit</h3>
              <p className="text-gray-600">
                Easily contact the agent and schedule property visits at your convenience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">3. Buy or Rent</h3>
              <p className="text-gray-600">
                Finalize the deal and move into your new dream home.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Seller or Agent?</h2>
          <p className="mb-6">
            List your property and get visibility from thousands of buyers.
          </p>
          <button
            onClick={() => navigate("/post")}
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded hover:bg-gray-200 cursor-pointer transition"
          >
            Post Your Property
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
