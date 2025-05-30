import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "../Auth/Login/Login";
import Logout from "../Auth/Logout/Logout";

const Navbar = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth0();

  useEffect(() => {
    const handleUserLogin = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              picture: user.picture
            }),
          });

          if (response.ok) {
            localStorage.setItem("userEmail", user.email);
          } else {
            console.error('Failed to handle user login');
          }
        } catch (error) {
          console.error('Error handling user login:', error);
        }
      }
    };

    handleUserLogin();
  }, [isAuthenticated, user]);

  useEffect(() => {
    let activityInterval;
    
    if (isAuthenticated && user?.email) {
      updateUserActivity();
      
      activityInterval = setInterval(updateUserActivity, 5 * 60 * 1000);
    }

    return () => {
      if (activityInterval) {
        clearInterval(activityInterval);
      }
    };
  }, [isAuthenticated, user?.email]);

  const updateUserActivity = async () => {
    if (!user?.email) return;

    try {
      await fetch(`http://localhost:5000/api/users/activity/${user.email}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error updating user activity:', error);
    }
  };

  const handleLogout = async () => {
    try {
      if (user?.email) {
        await fetch(`http://localhost:5000/api/users/logout/${user.email}`, {
          method: 'POST',
        });
      }
      localStorage.removeItem("userEmail");
      
      logout({ returnTo: window.location.origin });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-transparent absolute w-full z-20">
      <div className="flex items-center">
        <div onClick={() => navigate("/")}>
          <img
            className="h-25 cursor-pointer"
            src="/Global_real_estate-logo.png"
            alt="Logo"
          />
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
                      <button
                        className="w-full text-left px-4 py-2 font-bold text-red-700 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
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
