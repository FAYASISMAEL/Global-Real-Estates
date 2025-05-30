import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('myListings');
  const [myListings, setMyListings] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        
        const premiumResponse = await fetch(`http://localhost:5000/api/premium/status/${user.email}`);
        if (premiumResponse.ok) {
          const premiumData = await premiumResponse.json();
          setUserStatus(premiumData);
        }
        
        const listingsResponse = await fetch(`http://localhost:5000/api/mylistings/${user.email}`);
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json();
          setMyListings(listingsData);
        }

        const wishlistResponse = await fetch(`http://localhost:5000/api/wishlist/${user.email}`);
        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json();
          setSavedProperties(wishlistData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.email]);

  const handleRemoveFromWishlist = async (propertyId) => {
    if (!user?.email) return;

    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${user.email}/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setSavedProperties(prev => prev.filter(item => item.property._id !== propertyId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition"
        >
          <span className="mr-2">←</span> Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={user.picture}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-blue-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                {userStatus?.isPremium && (
                  <span 
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                    title="Premium Member"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {new Date(user.updated_at).toLocaleDateString()}</p>
              {userStatus?.isPremium && (
                <p className="text-sm text-blue-600 mt-1">
                  Premium member since {new Date(userStatus.premiumStartDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center ${
                activeTab === 'myListings'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('myListings')}
            >
              My Listings
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center ${
                activeTab === 'savedProperties'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('savedProperties')}
            >
              Saved Properties ({savedProperties.length}/3)
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'myListings' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">My Listed Properties</h2>
                  <button
                    onClick={() => navigate('/post')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    + Add New Property
                  </button>
                </div>
                {myListings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't listed any properties yet</p>
                    <button
                      onClick={() => navigate('/post')}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Post Your First Property
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myListings.map((property) => (
                      <div
                        key={property._id}
                        className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer relative group"
                        onClick={() => navigate(`/preview/${property._id}`)}
                      >
                        <div className="relative h-48">
                          {property.status === "disabled" && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
                              <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-center">
                                <div className="text-xl font-bold">SOLD OUT</div>
                                <div className="text-sm mt-1">Property no longer available</div>
                              </div>
                            </div>
                          )}
                          <img
                            src={`http://localhost:5000${property.images[0].startsWith('/') ? property.images[0] : `/${property.images[0]}`}`}
                            alt={property.title}
                            className={`w-full h-48 object-cover ${property.status === "disabled" ? 'filter grayscale' : ''}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-property.jpg';
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="text-white font-semibold text-lg">
                              {property.priceString}
                            </p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {property.title}
                            </h3>
                            {property.status === "disabled" && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                Sold Out
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{property.location}</p>
                          <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mt-3">
                            <div className="text-center p-1 bg-gray-50 rounded">
                              <p>{property.propertyType}</p>
                            </div>
                            <div className="text-center p-1 bg-gray-50 rounded">
                              <p>{property.size} sqft</p>
                            </div>
                            <div className="text-center p-1 bg-gray-50 rounded">
                              <p>{property.bedrooms} beds</p>
                            </div>
                          </div>
                          {property.status === "disabled" && property.soldOutDate && (
                            <p className="text-xs text-red-600 mt-2">
                              Marked as sold on {new Date(property.soldOutDate).toLocaleDateString()}
                            </p>
                          )}
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit/${property._id}`);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit Property →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Saved Properties</h2>
                {savedProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No saved properties yet</p>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Browse Properties
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProperties.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition relative group"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromWishlist(item.property._id);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                          title="Remove from wishlist"
                        >
                          ×
                        </button>
                        <div
                          onClick={() => navigate(`/preview/${item.property._id}`)}
                          className="cursor-pointer"
                        >
                          <div className="relative h-48">
                            {item.property.status === "disabled" && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
                                <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-center">
                                  <div className="text-xl font-bold">SOLD OUT</div>
                                  <div className="text-sm mt-1">Property no longer available</div>
                                </div>
                              </div>
                            )}
                            <img
                              src={`http://localhost:5000${item.property.images[0].startsWith('/') ? item.property.images[0] : `/${item.property.images[0]}`}`}
                              alt={item.property.title}
                              className={`w-full h-48 object-cover ${item.property.status === "disabled" ? 'filter grayscale' : ''}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-property.jpg';
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                              <p className="text-white font-semibold text-lg">
                                {item.property.priceString}
                              </p>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {item.property.title}
                              </h3>
                              {item.property.status === "disabled" && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                  Sold Out
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{item.property.location}</p>
                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mt-3">
                              <div className="text-center p-1 bg-gray-50 rounded">
                                <p>{item.property.propertyType}</p>
                              </div>
                              <div className="text-center p-1 bg-gray-50 rounded">
                                <p>{item.property.size} sqft</p>
                              </div>
                              <div className="text-center p-1 bg-gray-50 rounded">
                                <p>{item.property.bedrooms} beds</p>
                              </div>
                            </div>
                            {item.property.status === "disabled" && item.property.soldOutDate && (
                              <p className="text-xs text-red-600 mt-2">
                                Marked as sold on {new Date(item.property.soldOutDate).toLocaleDateString()}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              Added on {new Date(item.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 