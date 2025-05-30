import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PremiumModal from '../Premium/PremiumModal';

const Post = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    location: 'All India',
    price: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    listingType: 'buy',
    propertyType: 'Apartment',
  });
  const [images, setImages] = useState(Array(5).fill(null));
  const [imageFiles, setImageFiles] = useState(Array(5).fill(null));
  const [errors, setErrors] = useState({});
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: location.pathname,
        },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, location.pathname]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(`http://localhost:5000/api/premium/status/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setUserStatus(data);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };

    if (isAuthenticated) {
      checkUserStatus();
    }
  }, [isAuthenticated, user?.email]);

  const locations = ['All India', 'Mumbai', 'Delhi', 'Bangalore', 'Kerala'];
  const listingTypes = ['buy', 'rent'];
  const propertyTypes = ['Apartment', 'Villa', 'Plot'];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 2 * 1024 * 1024;

    const oversizedFiles = files.filter((file) => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: 'Each image must be less than 2MB',
      }));
      return;
    }

    setImageFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      let fileIndex = 0;
      for (let i = 0; i < newFiles.length && fileIndex < files.length; i++) {
        if (newFiles[i] === null) {
          newFiles[i] = files[fileIndex];
          fileIndex++;
        }
      }
      if (fileIndex < files.length) {
        for (let i = 0; i < newFiles.length && fileIndex < files.length; i++) {
          newFiles[i] = files[fileIndex];
          fileIndex++;
        }
      }
      return newFiles;
    });

    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((imageUrls) => {
      setImages((prevImages) => {
        const newImages = [...prevImages];
        let urlIndex = 0;
        for (let i = 0; i < newImages.length && urlIndex < imageUrls.length; i++) {
          if (newImages[i] === null) {
            newImages[i] = imageUrls[urlIndex];
            urlIndex++;
          }
        }
        if (urlIndex < imageUrls.length) {
          for (let i = 0; i < newImages.length && urlIndex < imageUrls.length; i++) {
            newImages[i] = imageUrls[urlIndex];
            urlIndex++;
          }
        }
        return newImages;
      });
      setErrors((prevErrors) => ({ ...prevErrors, images: undefined }));
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = 'Valid price is required';
    if (!formData.size || isNaN(formData.size) || formData.size <= 0)
      newErrors.size = 'Valid size is required';
    if (!formData.bedrooms || isNaN(formData.bedrooms) || formData.bedrooms < 0)
      newErrors.bedrooms = 'Valid number of bedrooms is required';
    if (!formData.bathrooms || isNaN(formData.bathrooms) || formData.bathrooms < 0)
      newErrors.bathrooms = 'Valid number of bathrooms is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!imageFiles.some((file) => file !== null)) newErrors.images = 'At least one image is required';
    if (!formData.contactName) newErrors.contactName = 'Name is required';
    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Valid email is required';
    }
    if (!formData.contactPhone) {
      newErrors.contactPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Valid 10-digit phone number is required';
    }
    if (!formData.listingType) newErrors.listingType = 'Listing type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userStatus) return;

    if (!userStatus.isPremium && userStatus.propertyCount >= 2) {
      setShowPremiumModal(true);
      return;
    }

    if (validateForm()) {
      const priceInLakhs = formData.price / 100000;
      const priceString = priceInLakhs >= 100 
        ? `₹${(priceInLakhs/100).toFixed(2)}Cr` 
        : `₹${priceInLakhs.toFixed(1)}L`;

      try {
        const formDataToSend = new FormData();

        const propertyDetails = {
          title: formData.title,
          price: priceInLakhs,
          priceString: priceString,
          details: `${formData.size} sqft • ${formData.location}`,
          location: formData.location,
          size: parseInt(formData.size),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          description: formData.description,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          listingType: formData.listingType,
          propertyType: formData.propertyType,
          userEmail: user.email
        };

        formDataToSend.append('propertyData', JSON.stringify(propertyDetails));

        imageFiles.forEach((file) => {
          if (file) {
            formDataToSend.append('file', file);
          }
        });

        const response = await fetch('http://localhost:5000/api/properties', {
          method: 'POST',
          body: formDataToSend,
        });

        const responseData = await response.json();

        if (response.ok) {
          alert('Property posted successfully!');
          setFormData({
            title: '',
            location: 'All India',
            price: '',
            size: '',
            bedrooms: '',
            bathrooms: '',
            description: '',
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            listingType: 'buy',
            propertyType: 'Apartment',
          });
          setImages(Array(5).fill(null));
          setImageFiles(Array(5).fill(null));
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          if (responseData.error === 'Property limit reached') {
            setShowPremiumModal(true);
          } else {
            alert(`Error: ${responseData.message || responseData.error || 'Failed to post property'}`);
          }
        }
      } catch (error) {
        console.error('Error details:', error);
        alert('Failed to post property. Please check the console for details.');
      }
    }
  };

  const handlePremiumSuccess = () => {
    setShowPremiumModal(false);
    if (user?.email) {
      fetch(`http://localhost:5000/api/premium/status/${user.email}`)
        .then(response => response.json())
        .then(data => setUserStatus(data))
        .catch(error => console.error('Error refreshing user status:', error));
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages;
    });
    setImageFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = null;
      return newFiles;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition"
          >
            <span className="mr-2">←</span> Back to Home
          </button>

          <div className="max-w-4xl mx-auto bg-gray-100 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Post Your Property</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                    Property Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label htmlFor="listingType" className="block text-gray-700 font-medium mb-2">
                    Listing Type
                  </label>
                  <select
                    id="listingType"
                    name="listingType"
                    value={formData.listingType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  >
                    {listingTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.listingType && <p className="text-red-500 text-sm mt-1">{errors.listingType}</p>}
                </div>

                <div>
                  <label htmlFor="propertyType" className="block text-gray-700 font-medium mb-2">
                    Property Type
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                    Price (in Rupees)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handlePriceChange}
                      className="w-full px-4 py-3 pl-8 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter price in rupees"
                      pattern="\d*"
                      inputMode="numeric"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  <p className="text-gray-500 text-sm mt-1">Example: For 50 Lakhs, enter 5000000</p>
                </div>

                <div>
                  <label htmlFor="size" className="block text-gray-700 font-medium mb-2">
                    Size (sq.ft.)
                  </label>
                  <input
                    type="number"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    min="0"
                  />
                  {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-gray-700 font-medium mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    min="0"
                  />
                  {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-gray-700 font-medium mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    min="0"
                  />
                  {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  rows="5"
                  placeholder="Details of the Property"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Photos (Max 5, 2MB each)</h2>
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {Array(5).fill(null).map((_, index) => (
                      <div key={index} className="relative">
                        {images[index] ? (
                          <div>
                            <img
                              src={images[index]}
                              alt={`Uploaded ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-md shadow-sm"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-gray-800 bg-opacity-60 cursor-pointer rounded-full p-1.5 text-white text-xs hover:bg-opacity-80 transition duration-200"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition duration-200">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={imageFiles.filter((file) => file !== null).length >= 5}
                            />
                            <span className="text-2xl text-gray-400">
                              <svg width="36px" height="36px" viewBox="0 0 1024 1024" fillRule="evenodd">
                                <path
                                  className="rui-i1ika"
                                  d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l-38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.040 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.352 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"
                                ></path>
                              </svg>
                            </span>
                            {index === 0 && (
                              <span className="text-xs text-gray-600 text-center mt-1">Add Photos</span>
                            )}
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactName" className="block text-gray-700 font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 text-lg font-medium"
                >
                  Post Property
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSuccess={handlePremiumSuccess}
      />
    </>
  );
};

export default Post;