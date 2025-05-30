import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "../Auth/Login/Login";
import Logout from "../Auth/Logout/Logout";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState("All India");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    if (isAuthenticated && user?.email) {
      localStorage.setItem("userEmail", user.email);
    }
  }, [isAuthenticated, user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
  };

  const locations = ["All India", "Mumbai", "Delhi", "Bangalore", "Kerala"];

  return (
    <nav className="flex justify-between items-center p-4 bg-transparent absolute w-full z-20">
      <div className="flex items-center space-x-4">
        <div onClick={() => navigate("/")}>
          <img
            className="h-25 cursor-pointer"
            src="/Global_real_estate-logo.png"
            alt="Logo"
          />
        </div>

        <div className="relative">
          <button
            className="border rounded p-1 text-white bg-transparent border-white drop-shadow-md flex"
            onClick={toggleLocationDropdown}
            aria-label="Select location"
          >
            {selectedLocation}
            <span className="ml-2">▼</span>
          </button>
          {isLocationDropdownOpen && (
            <div className="absolute top-10 left-0 bg-white rounded border shadow-lg w-36 z-10">
              <ul className="py-2">
                {locations.map((location) => (
                  <li key={location}>
                    <button
                      className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleLocationSelect(location)}
                    >
                      {location}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="bg-white text-black px-4 py-2 cursor-pointer rounded-full drop-shadow-md"
          onClick={() => navigate("/post")}
        >
          Post Property
        </button>

        <button
          className="bg-white text-black px-4 py-2 cursor-pointer rounded-full drop-shadow-md"
          onClick={() => navigate("/wishlist")}
        >
          WishList 🛒
        </button>

        <div
          className="relative"
          onMouseEnter={() => setIsProfileDropdownOpen(true)}
          onMouseLeave={() => setIsProfileDropdownOpen(false)}
        >
          <img
            className="h-10 w-10 rounded-full cursor-pointer object-cover"
            src={
              isAuthenticated && user?.picture
                ? user.picture
                : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt="Profile"
          />

          {isProfileDropdownOpen && (
            <div className="absolute top-10 right-0 bg-white rounded border shadow-lg w-48 min-w-fit z-10">
              <ul className="py-2">
                {isAuthenticated ? (
                  <>
                    <li>
                      <span className="block w-full text-left px-4 py-2 text-blue-700 truncate font-bold">
                        {user?.email.split("@")[0]}
                      </span>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 text-black cursor-pointer font-bold"
                        onClick={() => navigate("/profile")}
                      >
                        My Profile
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 text-black cursor-pointer font-bold"
                        onClick={() => navigate("/settings")}
                      >
                        Settings
                      </button>
                    </li>
                    <li>
                      <Logout />
                    </li>
                  </>
                ) : (
                  <li>
                    <Login />
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


















// import React from "react";
// import { useNavigate } from "react-router-dom";

// import Login from "../Auth/Login/Login";
// import Logout from "../Auth/Logout/Logout";

// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
//   const [isLocationDropdownOpen, setIsLocationDropdownOpen] = React.useState(false);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
//   const [selectedLocation, setSelectedLocation] = React.useState("All India");
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const toggleLocationDropdown = () => {
//     setIsLocationDropdownOpen(!isLocationDropdownOpen);
//   };

//   const handleLocationSelect = (location) => {
//     setSelectedLocation(location);
//     setIsLocationDropdownOpen(false);
//   };

//   const locations = ["All India", "Mumbai", "Delhi", "Bangalore", "Kerala"];

//   return (
//     <nav className="flex justify-between items-center p-4 bg-transparent absolute w-full z-20">
//       <div className="flex items-center space-x-4">
//         <div onClick={() => navigate('/')}>
//           <img className="h-25 cursor-pointer" src="/Global_real_estate-logo.png" alt="Logo"/>
//         </div>

//         <div className="relative">
//           <button
//             className="border rounded p-1 text-white bg-transparent border-white drop-shadow-md flex"
//             onClick={toggleLocationDropdown}
//             aria-label="Select location"
//           >
//             {selectedLocation}
//             <span className="ml-2">▼</span>
//           </button>
//           {isLocationDropdownOpen && (
//             <div className="absolute top-10 left-0 bg-white rounded border shadow-lg w-36 z-10">
//               <ul className="py-2">
//                 {locations.map((location) => (
//                   <li key={location}>
//                     <button
//                       className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
//                       onClick={() => handleLocationSelect(location)}
//                     >
//                       {location}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex items-center space-x-4">
//         <button
//           className="bg-white text-black px-4 py-2 cursor-pointer rounded-full drop-shadow-md"
//           onClick={() => navigate('/post-property')}
//         >
//           Post Property
//         </button>

//         <button
//           className="bg-white text-black px-4 py-2 cursor-pointer rounded-full drop-shadow-md"
//           onClick={() => navigate('/wishlist')}
//         >
//           WishList 🛒
//         </button>

//         <div className="relative" onMouseEnter={() => setIsProfileDropdownOpen(true)}
//           onMouseLeave={() => setIsProfileDropdownOpen(false)}
//         >
//           <img className="h-10 w-10 rounded-full cursor-pointer object-cover" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="Profile"/>

//           {isProfileDropdownOpen && (
//             <div className="absolute top-10 right-0 bg-white rounded border shadow-lg w-35 h-45 z-10">
//               <ul className="py-2">
//                 <li>
//                   {/* <button className="w-full text-left px-4 py-2 text-blue-700 cursor-pointer" onClick={() => navigate('/login')}>
//                     LogIn/Register
//                   </button> */}
//                   <Login/>
//                 </li>
//                 <li>
//                   <button className="w-full text-left px-4 py-2 text-black cursor-pointer" onClick={() => navigate('/profile')}>
//                     My Profile
//                   </button>
//                 </li>
//                 <li>
//                   <button className="w-full text-left px-4 py-2 text-black cursor-pointer" onClick={() => navigate('/settings')}>
//                     Settings
//                   </button>
//                 </li>
//                 <li>
//                   <Logout/>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
