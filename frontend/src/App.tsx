import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewMenuItem from './pages/ViewMenuItem';
import RestaurantDetails from './pages/RestaurantDetails';
import Restaurants from './pages/Restaurants';
import CartDetails from './pages/CartDetails';
import BuyFood from './pages/BuyFood';
import OrderConf from './pages/orderConf';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import OrderHistory from './pages/OrderHistory';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Home from './pages/home';
import Index from './pages/index';

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  if (loading) return null;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/menu-item/:id" element={<ViewMenuItem />} />
      <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/cart" element={<BuyFood />} />
      <Route path="/order-confirmation" element={<OrderConf />} />
      <Route path="/order-placed" element={<CartDetails />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<OrderHistory />} />
    </Routes>
  );
};

const App: React.FC = () => {
  console.log("App component rendered");
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;