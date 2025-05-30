import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PropertyProvider } from './components/Context/PropertyContext';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Post from './components/Post/Post';
import Preview from './components/Preview/Preview';
import Profile from './components/Profile/Profile';
import EditProperty from './components/EditProperty/EditProperty';
import Explore from './components/Explore/Explore';
import Wishlist from './components/Wishlist/Wishlist';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith('/preview') || 
                    location.pathname === '/post' || 
                    location.pathname === '/wishlist' || 
                    location.pathname === '/profile' || 
                    location.pathname === '/explore' || 
                    location.pathname.startsWith('/edit') ||
                    location.pathname.startsWith('/admin');

  return (
    <PropertyProvider>
      <div>
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<Post />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit/:id" element={<EditProperty />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </PropertyProvider>
  );
};

export default App;


//       <Route path="/preview/:id" element={<Preview />} />
