import React from 'react';
import { useState } from 'react';
import { BrowserRouter,Route,Router,Routes, useLocation} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Login from './components/Auth/Login/Login';

function App() {
  const location = useLocation()
  return (
    <>
    {location.pathname === "/login" ? "" : <Navbar/>}
    <Routes>
      <Route path='/' element = {<Home/>} />
      <Route path="/login" element = {<Login />} />
    </Routes>
    </>
  )
}

export default App
