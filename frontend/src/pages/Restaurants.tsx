import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaMotorcycle, FaMapMarkerAlt } from 'react-icons/fa';

interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  distance: number;
  image: string;
  address: string | { street?: string; city?: string; state?: string; zipCode?: string };
  isActive: boolean;
}

const Restaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = process.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/restaurants`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const formatAddress = (address: any) => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    return [address.street, address.city, address.state, address.zipCode].filter(Boolean).join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded-button hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Restaurants</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                    <span className="text-sm font-medium text-green-800">{restaurant.rating}</span>
                    <FaStar className="text-yellow-500 ml-1 text-xs" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
                <p className="text-gray-600 text-sm mb-2">{formatAddress(restaurant.address)}</p>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <div className="flex items-center mr-3">
                    <FaMotorcycle className="mr-1" />
                    <span>{restaurant.deliveryTime} min</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{restaurant.distance} mi</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Min. order: ${restaurant.minOrder}</span>
                  <button 
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/restaurant/${restaurant._id}`);
                    }}
                  >
                    View Menu <i className="fas fa-chevron-right ml-1 text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;