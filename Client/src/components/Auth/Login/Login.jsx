import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect() } className="w-full text-left px-4 py-2 text-blue-700 cursor-pointer">LogIn/Register</button>;
};

export default LoginButton;