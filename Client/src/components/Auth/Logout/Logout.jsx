import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
  const { logout } = useAuth0();
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    logout({ returnTo: window.location.origin });
  };

  return (
    <button
      className="w-full text-left px-4 py-2 font-bold text-red-700 cursor-pointer" onClick={handleLogout}
    >
      Log Out
    </button>
  );
};

export default Logout;








// import { useAuth0 } from "@auth0/auth0-react";
// import React from "react";

// const Logout = () => {
//   const { logout } = useAuth0();

//   return <button onClick={() => logout() } className="w-full text-left px-4 py-2 font-bold text-red-700 cursor-pointer">Logout</button>;
// };

// export default Logout;