import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Buy");
  const [searchQuery, setSearchQuery] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
  });

  const tabs = ["Buy"];

  const handleSearch = () => {
    console.log("Search Query:", searchQuery);
    navigate(`/property?location=${searchQuery.location}&type=${searchQuery.propertyType}&price=${searchQuery.priceRange}`);
  };

  return (
    <div className="font-sans">
      <section
        className="bg-cover bg-center h-[70vh] text-white flex items-center relative bg-[url(/homebg2.jpg)]"
      >
        <div className="w-full h-full flex items-center bg-black/40">
          <div className="max-w-5xl mx-auto px-6 text-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-md">
              Global Estates
            </h1>
            <p className="mt-2 text-lg md:text-xl text-white drop-shadow-md animation-delay-200">
              Urban Luxury Meets Nature
            </p>
            <button onClick={() => navigate("/property")} className="mt-6 inline-block bg-transparent border hover:bg-blue-700 cursor-pointer text-white px-10 py-3 rounded text-lg transition animation-delay-600">
              Explore Now
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 shadow-md -mt-16 relative z-10 rounded-md max-w-6xl mx-auto px-6">
        <div className="flex space-x-4 border-b mb-4">
          {tabs.map((tab) => (
            <button key={tab} className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 cursor-pointer"
                  : "text-black"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Search by city or area" className="border px-4 py-2 rounded w-full" value={searchQuery.location}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, location: e.target.value })
            }
          />
          <select
            className="border px-4 py-2 rounded w-full cursor-pointer"
            value={searchQuery.propertyType}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, propertyType: e.target.value })
            }
          >
            <option value="">Property Type</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Plot</option>
          </select>
          <select
            className="border px-4 py-2 rounded w-full cursor-pointer"
            value={searchQuery.priceRange}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, priceRange: e.target.value })
            }
          >
            <option value="">Price Range</option>
            <option>Below ₹50L</option>
            <option>₹50L - ₹1Cr</option>
            <option>Above ₹1Cr</option>
          </select>
          <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 1, title: "3BHK Apartment in Bangalore", price: "₹75L", details: "1,200 sqft • Whitefield" },
              { id: 2, title: "2BHK Villa in Mumbai", price: "₹1.2Cr", details: "1,500 sqft • Andheri" },
              { id: 3, title: "Plot in Delhi", price: "₹50L", details: "800 sqft • Dwarka" },
            ].map((property) => (
              <div
                key={property.id}
                className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={`https://townsquare.media/site/717/files/2020/04/featured-image-option-2.jpg?w=780&q=75${property.id}`}
                  alt={property.title}
                  className="w-full h-52 object-cover cursor-pointer"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {property.price} • {property.details}
                  </p>
                  <button
                    onClick={() => navigate(`/property/${property.id}`)}
                    className="text-blue-600 mt-3 inline-block hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
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
            onClick={() => navigate("/post-property")}
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded hover:bg-gray-200 transition"
          >
            Post Your Property
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;