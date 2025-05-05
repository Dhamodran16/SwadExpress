// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React from 'react';

const App: React.FC = () => {
  // Order details
  const orderNumber = "ORD-38291";
  const estimatedDelivery = "30-45 minutes";
  const deliveryAddress = {
    street: '123 Main Street',
    apt: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105'
  };
  const paymentMethod = "Visa •••• 4582";
 
  // Cart items
  const cartItems = [
    {
      id: 'item1',
      name: 'Double Cheese Burger',
      restaurantName: 'Burger Palace',
      price: 12.99,
      quantity: 2,
      image: 'https://readdy.ai/api/search-image?query=A%20professional%20food%20photography%20of%20a%20juicy%20double%20cheeseburger%20with%20melted%20cheese%2C%20fresh%20lettuce%2C%20tomato%2C%20and%20sauce%20on%20a%20sesame%20seed%20bun%2C%20on%20a%20minimalist%20light%20background%2C%20high-quality%2C%20appetizing%2C%20commercial%20food%20photography&width=100&height=100&seq=1&orientation=squarish',
      customization: 'Extra cheese, No onions',
      specialInstructions: 'Cook well done please'
    },
    {
      id: 'item2',
      name: 'Margherita Pizza',
      restaurantName: 'Pizza Heaven',
      price: 18.50,
      quantity: 1,
      image: 'https://readdy.ai/api/search-image?query=A%20professional%20food%20photography%20of%20a%20margherita%20pizza%20with%20melted%20mozzarella%20cheese%20and%20fresh%20basil%20leaves%20on%20a%20thin%20crust%2C%20on%20a%20minimalist%20light%20background%2C%20high-quality%2C%20appetizing%2C%20commercial%20food%20photography&width=100&height=100&seq=2&orientation=squarish',
      customization: 'Thin crust'
    },
    {
      id: 'item3',
      name: 'Chicken Caesar Salad',
      restaurantName: 'Fresh Greens',
      price: 9.99,
      quantity: 1,
      image: 'https://readdy.ai/api/search-image?query=A%20professional%20food%20photography%20of%20a%20fresh%20chicken%20caesar%20salad%20with%20grilled%20chicken%20strips%2C%20crisp%20romaine%20lettuce%2C%20parmesan%20cheese%2C%20and%20croutons%2C%20on%20a%20minimalist%20light%20background%2C%20high-quality%2C%20appetizing%2C%20commercial%20food%20photography&width=100&height=100&seq=3&orientation=squarish',
    }
  ];
 
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <a
            href="https://readdy.ai/home/e7399373-5bc5-457c-9e6c-d2aad8b7f67d/d61aa1b8-f767-47ff-989a-c418a873ce2b"
            data-readdy="true"
            className="text-indigo-600 hover:text-indigo-800 mr-4 cursor-pointer"
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </a>
          <h1 className="text-3xl font-semibold text-gray-800">Order Confirmed</h1>
        </div>
       
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <span className="mt-2 text-sm text-gray-600">Cart</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-indigo-600"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <span className="mt-2 text-sm text-gray-600">Checkout</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-indigo-600"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                <i className="fas fa-check"></i>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-800">Complete</span>
            </div>
          </div>
        </div>
       
        {/* Success Message */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-check text-4xl text-green-500"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Successfully Placed!</h2>
          <p className="text-gray-600 mb-4 text-center">
            Thank you for your order. We've received your order and will begin processing it right away.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
            <div className="bg-gray-100 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-bold text-gray-800">{orderNumber}</p>
            </div>
            <div className="bg-gray-100 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-bold text-gray-800">{estimatedDelivery}</p>
            </div>
          </div>
        </div>
       
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:w-2/3">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-map-marker-alt text-indigo-600"></i>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Delivery Address</h2>
                    <p className="text-gray-800">{deliveryAddress.street}</p>
                    <p className="text-gray-600">{deliveryAddress.apt}, {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip}</p>
                  </div>
                </div>
              </div>
            </div>
           
            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-credit-card text-indigo-600"></i>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Method</h2>
                    <div className="flex items-center">
                      <i className="fab fa-cc-visa text-blue-700 mr-2 text-2xl"></i>
                      <p className="text-gray-800">{paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
            {/* Order Items Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Items</h2>
               
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="text-gray-800 font-medium">{item.name}</p>
                          <p className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="text-gray-600 text-sm">{item.restaurantName}</p>
                        {item.customization && (
                          <p className="text-gray-600 text-sm mt-1">
                            <span className="font-medium">Customization:</span> {item.customization}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Instructions:</span> {item.specialInstructions}
                          </p>
                        )}
                        <div className="mt-2 inline-block bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
           
            {/* Delivery Status */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Status</h2>
               
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                 
                  <div className="relative flex items-start mb-6">
                        <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10 relative">
                        <i className="fas fa-check text-white text-sm"></i>
                          </div>
                        </div>
                        <div>
                      <p className="font-medium text-gray-800">Order Confirmed</p>
                      <p className="text-sm text-gray-600">May 4, 2025 • 12:30 PM</p>
                    </div>
                        </div>
                 
                  <div className="relative flex items-start mb-6">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center z-10 relative">
                        <i className="fas fa-utensils text-indigo-600 text-sm"></i>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Preparing Your Order</p>
                      <p className="text-sm text-gray-600">Estimated: 10-15 minutes</p>
                    </div>
                  </div>
                 
                  <div className="relative flex items-start mb-6">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center z-10 relative">
                        <i className="fas fa-motorcycle text-gray-500 text-sm"></i>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Out for Delivery</p>
                      <p className="text-sm text-gray-600">Estimated: 20-30 minutes</p>
                    </div>
                  </div>
                 
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center z-10 relative">
                        <i className="fas fa-home text-gray-500 text-sm"></i>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Delivered</p>
                      <p className="text-sm text-gray-600">Estimated: 30-45 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         
          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
             
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-800">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-xl text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
             
              {/* Delivery Time */}
              <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-clock text-indigo-600 mr-3"></i>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery Time</p>
                    <p className="font-medium text-gray-800">{estimatedDelivery}</p>
                  </div>
                </div>
              </div>
             
              {/* Help Section */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you have any questions about your order, please contact our support team.
                </p>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center cursor-pointer whitespace-nowrap">
                  <i className="fas fa-headset mr-2"></i> Contact Support
                </button>
              </div>
             
              {/* Action Buttons */}
              <div className="space-y-4">
                <button className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 !rounded-button cursor-pointer whitespace-nowrap">
                  <i className="fas fa-map-marker-alt mr-2"></i> Track Order
                </button>
               
                <a
                  href="https://readdy.ai/home/e7399373-5bc5-457c-9e6c-d2aad8b7f67d/d61aa1b8-f767-47ff-989a-c418a873ce2b"
                  data-readdy="true"
                  className="block w-full py-3 px-4 bg-white border border-gray-300 text-indigo-600 font-medium rounded-lg hover:bg-gray-50 text-center !rounded-button cursor-pointer whitespace-nowrap"
                  onClick={() => navigate('/')}
                >
                  <i className="fas fa-home mr-2"></i> Return to Home
                </a>
              </div>
            </div>
          </div>
        </div>
       
        {/* Additional Information */}
        <div className="mt-12 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What's Next?</h2>
           
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-bell text-indigo-600 text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">
                  We'll send you real-time updates about your order status via email and app notifications.
                </p>
              </div>
             
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-star text-indigo-600 text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Rate Your Experience</h3>
                <p className="text-sm text-gray-600">
                  After delivery, you'll be able to rate your food and delivery experience to help us improve.
                </p>
              </div>
             
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-utensils text-indigo-600 text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Reorder Favorites</h3>
                <p className="text-sm text-gray-600">
                  Loved your meal? You can easily reorder from your order history in just a few clicks.
                </p>
              </div>
            </div>
          </div>
        </div>
       
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© 2025 Food Delivery App. All rights reserved.</p>
          <div className="flex justify-center mt-2 space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;