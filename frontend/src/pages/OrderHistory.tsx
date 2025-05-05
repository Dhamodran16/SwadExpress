import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

// Added a placeholder for useAuthGuard
const useAuthGuard = () => {
  // Placeholder logic for authentication guard
};

// Defined missing variables
const items = []; // Example cart items array
const subtotal = 0; // Example subtotal
const deliveryFee = 0; // Example delivery fee
const tax = 0; // Example tax
const paymentMethod = 'credit'; // Example payment method
const clearCart = () => {
  console.log('Cart cleared');
};

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  restaurantName: string;
  image?: string;
}
interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  orderNumber: string;
}

const OrderHistory: React.FC = () => {  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useAuthGuard();

  useEffect(() => {
    const fetchOrders = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : null;
      if (!userId) {
        setError('You must be logged in to view your orders.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:5001/api/orders/user/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handlePlaceOrder = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      // Redirect to login or show error
      // navigate('/signin');
      return;
    }

    // Gather order data
    const orderData = {
      userId: user.uid,
      items: items, // your cart items array from context or state
      total: subtotal + deliveryFee + tax, // or your total calculation
      status: 'delivered', // or 'processing', etc.
      deliveryAddress: "123 Main Street, Erode, 638052",
      paymentMethod: paymentMethod, // e.g., 'credit', 'cash', etc.
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        // Success: clear cart, show confirmation, navigate, etc.
        clearCart();
        navigate('/order-placed');
      } else {
        // Handle error
        const err = await res.json();
        alert('Order failed: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Order failed: ' + err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-lg font-semibold">{order.items[0]?.restaurantName || 'Restaurant'}</div>
                    <div className="text-xs text-gray-500">Order ID: {order._id}</div>
                  </div>
                  <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Items:</span>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {order.items.map((item, idx) => (
                      <li key={idx}>{item.name} x{item.quantity}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{order.status}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">${order.total.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => navigate('/profile')} className="mt-8 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Back to Profile</button>
      </div>
    </div>
  );
};

export default OrderHistory;