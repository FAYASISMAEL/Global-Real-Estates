import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/wishlist/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setSavedProperties(data);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchWishlist();
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
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view and manage your wishlist.</p>
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition"
        >
          <span className="mr-2">←</span> Back to Home
        </button>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 mt-1">
                  {savedProperties.length} / 3 properties saved
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Browse More Properties
              </button>
            </div>
          </div>

          {savedProperties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-6">
                  Start exploring properties and save your favorites to view them later.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Explore Properties
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative group"
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
                        <>
                          <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex flex-col items-center justify-center">
                            <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-center mb-3">
                              <div className="text-xl font-bold">SOLD OUT</div>
                              <div className="text-sm mt-1">Property no longer available</div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromWishlist(item.property._id);
                              }}
                              className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                            >
                              <span className="mr-2">×</span>
                              Remove from Wishlist
                            </button>
                          </div>
                        </>
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
                      <p className="text-gray-600 text-sm mb-2">{item.property.location}</p>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-3">
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
      </div>
    </div>
  );
};

export default Wishlist; 