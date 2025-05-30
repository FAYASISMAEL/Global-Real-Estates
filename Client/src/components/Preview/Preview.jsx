import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [savingToWishlist, setSavingToWishlist] = useState(false);
  const [markingAsSold, setMarkingAsSold] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const propertyResponse = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (!propertyResponse.ok) {
          throw new Error('Property not found');
        }
        const propertyData = await propertyResponse.json();
        setProperty(propertyData);

        if (isAuthenticated && user?.email) {
          try {
            const wishlistResponse = await fetch(`http://localhost:5000/api/wishlist/${user.email}/${id}`);
            if (wishlistResponse.ok) {
              const { isInWishlist: status } = await wishlistResponse.json();
              setIsInWishlist(status);
            } else {
              setIsInWishlist(false);
              console.log('Failed to check wishlist status:', await wishlistResponse.text());
            }
          } catch (wishlistError) {
            console.error('Error checking wishlist status:', wishlistError);
            setIsInWishlist(false);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, isAuthenticated, user?.email]);

  const handleContactAgent = () => {
    if (!property) return;
    
    const subject = `Inquiry about ${property.title}`;
    const message = `Hi ${property.contactName},\n\nI am interested in your property: ${property.title}`;
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(property.contactEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(gmailComposeUrl, '_blank');
  };

  const handleSaveToWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setSavingToWishlist(true);

      if (isInWishlist) {
        const response = await fetch(`http://localhost:5000/api/wishlist/${user.email}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        
        if (response.ok) {
          setIsInWishlist(false);
        } else {
          alert(data.error || 'Failed to remove from wishlist');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: user.email,
            propertyId: id,
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setIsInWishlist(true);
        } else {
          if (data.error === 'Wishlist limit reached (maximum 3 properties allowed)') {
            alert('You can only save up to 3 properties in your wishlist. Please remove some properties to add more.');
          } else {
            alert(data.error || 'Failed to add to wishlist');
          }
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setSavingToWishlist(false);
    }
  };

  const handleMarkAsSold = async () => {
    if (!isAuthenticated || user?.email !== property.userEmail) {
      return;
    }

    try {
      setMarkingAsSold(true);
      const response = await fetch(`http://localhost:5000/api/properties/${id}/sold`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
        }),
      });

      if (response.ok) {
        const updatedProperty = await response.json();
        setProperty(updatedProperty);
        setIsInWishlist(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to mark property as sold');
      }
    } catch (error) {
      console.error('Error marking property as sold:', error);
      alert('Failed to mark property as sold. Please try again.');
    } finally {
      setMarkingAsSold(false);
    }
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const previousImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
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

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Property not found</p>
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
      <div className="container mx-auto px-4 py-8 mt-16">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition"
        >
          <span className="mr-2">←</span> Back to Home
        </button>

        <div className="relative rounded-lg overflow-hidden shadow-lg bg-white">
          <div className="relative h-[500px]">
            {property.status === "disabled" && (
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
                <div className="bg-red-600 text-white px-8 py-4 rounded-lg text-center">
                  <div className="text-3xl font-bold transform rotate-45">SOLD OUT</div>
                  <div className="text-lg mt-2">This property is no longer available</div>
                </div>
              </div>
            )}
            {property.images && property.images.length > 0 ? (
              <img
                src={`http://localhost:5000${property.images[currentImageIndex].startsWith('/') ? '' : '/'}${property.images[currentImageIndex]}`}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className={`w-full h-full object-cover ${property.status === "disabled" ? 'filter grayscale' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                  →
                </button>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="mb-6 md:mb-0">
                <h1 className="text-4xl font-bold text-black">{property.title}</h1>
                <p className="text-4xl text-blue-600 mt-2 font-bold">{property.priceString}</p>
                <p className="text-gray-600 mt-1">{property.location}</p>
                {property.status === "disabled" && (
                  <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-700">
                      This property has been sold and is no longer available.
                      {property.soldOutDate && (
                        <span className="block mt-1 text-sm">
                          Marked as sold on {new Date(property.soldOutDate).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">Size</p>
                    <p className="font-semibold">{property.size} sqft</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">Type</p>
                    <p className="font-semibold">{property.propertyType}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                {isAuthenticated && user?.email === property.userEmail ? (
                  <>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="text-yellow-800 text-sm">This is your property listing. You can edit it below.</p>
                    </div>
                    <button
                      onClick={() => navigate(`/edit/${id}`)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                    >
                      <span className="mr-2">✎</span> Edit Property
                    </button>
                    {property.status === "active" && (
                      <button
                        onClick={handleMarkAsSold}
                        disabled={markingAsSold}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                      >
                        <span className="mr-2">🏷️</span>
                        {markingAsSold ? 'Processing...' : 'Mark as Sold'}
                      </button>
                    )}
                  </>
                ) : (
                  property.status === "active" && (
                    <button
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center cursor-pointer justify-center"
                      onClick={handleContactAgent}
                    >
                      <span className="mr-2">📱</span> Contact Seller
                    </button>
                  )
                )}
                
                {isAuthenticated ? (
                  user?.email !== property.userEmail && property.status === "active" ? (
                    <button
                      className={`${
                        isInWishlist
                          ? 'bg-white hover:text-black'
                          : 'bg-white hover:bg-gray-50 border border-gray-300'
                      } text-${isInWishlist ? 'black' : 'gray-800'} px-6 py-3 rounded-lg border border-gray-300 transition flex items-center cursor-pointer justify-center`}
                      onClick={handleSaveToWishlist}
                      disabled={savingToWishlist}
                    >
                      <span className="mr-2">{isInWishlist ? '🚫' : '🛒'}</span>
                      {savingToWishlist
                        ? 'Processing...' : isInWishlist
                        ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                  ) : null
                ) : (
                  property.status === "active" && (
                    <button
                      className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 px-6 py-3 rounded-lg transition flex items-center justify-center"
                      onClick={() => navigate('/login')}
                    >
                      <span className="mr-2">🛒</span>
                      Login to Add to Wishlist
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><span className="font-semibold">Name:</span> {property.contactName}</p>
                <p className="mb-2"><span className="font-semibold">Email:</span> {property.contactEmail}</p>
                <p className="mb-4"><span className="font-semibold">Phone:</span> {property.contactPhone}</p>
                <button
                  onClick={() => window.open('https://zoom.us/j/9832523173', '_blank')}
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <span className="mr-2"></span>
                  {isAuthenticated && user?.email === property.userEmail ? 'Connect with Buyer in Zoom Meeting' : 'Connect with Seller in Zoom Meeting'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;