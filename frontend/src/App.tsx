import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/menu-item/:id" element={<ProtectedRoute><ViewMenuItem /></ProtectedRoute>} />
      <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
      <Route path="/restaurants" element={<ProtectedRoute><Restaurants /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><BuyFood /></ProtectedRoute>} />
      <Route path="/order-confirmation" element={<ProtectedRoute><OrderConf /></ProtectedRoute>} />
      <Route path="/order-placed" element={<ProtectedRoute><CartDetails /></ProtectedRoute>} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/order/:orderId" element={<ProtectedRoute><CartDetails /></ProtectedRoute>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
