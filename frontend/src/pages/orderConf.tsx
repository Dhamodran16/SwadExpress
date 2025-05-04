// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const OrderConf: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const savedAddresses = [
    {
      street: '123 Main Street',
      apt: 'Apt 4B',
      city: 'Erode',
      state: 'Tamil Nadu',
      zip: '638052'
    }
  ];
  const [deliveryType, setDeliveryType] = useState('asap');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCVV] = useState('');
  const [digitalPaymentCode, setDigitalPaymentCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);
  const navigate = useNavigate();

  // Calculate cart totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardExpiry(formatExpiryDate(value));
  };

  // Generate unique payment code for digital payments
  const generatePaymentCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Validate credit card details
  const validateCardDetails = () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
      return false;
    }
    // Basic validation for card number (16 digits)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      return false;
    }
    // Basic validation for expiry date (MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpiry)) {
      return false;
    }
    // Basic validation for CVV (3 or 4 digits)
    if (!/^[0-9]{3,4}$/.test(cardCVV)) {
      return false;
    }
    return true;
  };

  // Place order handler
  const handlePlaceOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    switch (paymentMethod) {
      case 'credit':
        if (!validateCardDetails()) {
          toast.error('Please enter valid card details');
          return;
        }
        break;
      case 'digital':
        if (!digitalPaymentCode) {
          toast.error('Please generate a payment code');
          return;
        }
        break;
      case 'cash':
        // No validation needed for cash on delivery
        break;
      default:
        toast.error('Please select a valid payment method');
        return;
    }

    // Get the current user
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to place an order');
      return;
    }

    // Prepare order data
    const orderData = {
      userId: user.uid,
      items: items.map(item => ({
        ...item,
        restaurantName: item.restaurantName || 'Unknown Restaurant',
      })),
      total: getTotalPrice() + 3.99 + getTotalPrice() * 0.08, // subtotal + deliveryFee + tax
      status: 'delivered',
      createdAt: new Date().toISOString(),
      paymentMethod: {
        type: paymentMethod,
        details: paymentMethod === 'credit' ? {
          cardNumber: cardNumber,
          cardName: cardName,
          cardExpiry: cardExpiry,
          cardCVV: cardCVV
        } : paymentMethod === 'digital' ? {
          digitalPaymentCode: digitalPaymentCode
        } : {}
      }
    };

    // Send order to backend
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const order = await res.json();
        setOrderNumber(order.orderNumber);
        clearCart();
        localStorage.setItem('latestOrder', JSON.stringify(order));
        navigate(`/order/${order._id}`);
      } else {
        const err = await res.json();
        toast.error('Order failed: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Order failed: ' + err);
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    if (method === 'digital') {
      setDigitalPaymentCode(generatePaymentCode());
    }
  };

  useEffect(() => {
    const checkProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      try {
        const res = await fetch(`${API_URL}/api/users/${user.uid}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const profile = await res.json();
        const VALID_PAYMENT_METHODS = ['Google Pay', 'Apple Pay', 'Cash on Delivery', 'Credit/Debit Card'];
        const isComplete =
          profile.displayName && profile.displayName.trim() !== '' &&
          profile.email && profile.email.trim() !== '' &&
          profile.phone && profile.phone.trim() !== '' &&
          profile.address && profile.address.trim() !== '' &&
          profile.deliveryAddress && profile.deliveryAddress.trim() !== '' &&
          profile.preferredPaymentMethod && VALID_PAYMENT_METHODS.includes(profile.preferredPaymentMethod);
        if (!isComplete) {
          toast.error('Fill out profile page to continue.');
          navigate('/profile');
        }
      } catch (err) {
        toast.error('Could not verify profile completeness.');
        navigate('/profile');
      }
    };
    checkProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowOrderDetails(false)}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-4 max-h-96 overflow-auto pr-2">
              {items.length === 0 ? (
                <div className="text-gray-500 text-center">No items in this order.</div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center border-b pb-3 last:border-b-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden mr-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-800 text-sm font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {showOrderPlaced && orderNumber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 text-center">
            <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
            <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
            <p className="text-gray-700 mb-4">Your order number is:</p>
            <div className="text-2xl font-mono font-bold text-indigo-600 mb-4">{orderNumber}</div>
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
              onClick={() => { setShowOrderPlaced(false); navigate('/orders'); }}
            >
              View Order History
            </button>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-800 mr-4 cursor-pointer bg-transparent border-none"
            style={{ background: 'none', border: 'none' }}
            aria-label="Back"
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
          <h1 className="text-3xl font-semibold text-gray-800">Checkout</h1>
        </div>
        {/* Progress Indicator */}
        <div className="mb-8">
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
              <span className="mt-2 text-sm font-medium text-gray-800">Checkout</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                <i className="fas fa-check"></i>
              </div>
              <span className="mt-2 text-sm text-gray-500">Complete</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Forms */}
          <div className="lg:w-2/3">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Delivery Address</h2>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer whitespace-nowrap">
                    + Add New Address
                  </button>
                </div>
                {savedAddresses.length > 0 ? (
                  <div>
                    {savedAddresses.map((address, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg mb-4 cursor-pointer ${selectedAddress === index ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                        onClick={() => setSelectedAddress(index)}
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            <div className={`w-5 h-5 rounded-full border ${selectedAddress === index ? 'border-indigo-600' : 'border-gray-400'} flex items-center justify-center`}>
                              {selectedAddress === index && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <p className="text-gray-800 font-medium">{address.street}</p>
                            <p className="text-gray-600 text-sm">{address.apt}, {address.city}, {address.state} {address.zip}</p>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm cursor-pointer whitespace-nowrap">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="street"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder="Enter your street address"
                      />
                    </div>
                    <div>
                      <label htmlFor="apt" className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, Suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        id="apt"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder="Apt, Suite, Floor, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <div className="relative">
                          <select
                            id="state"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
                          >
                            <option value="">Select State</option>
                            <option value="CA">California</option>
                            <option value="NY">New York</option>
                            <option value="TX">Texas</option>
                            <option value="FL">Florida</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <i className="fas fa-chevron-down text-gray-400"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder="ZIP Code"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        id="save-address"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="save-address" className="ml-2 block text-sm text-gray-700">
                        Save this address for future orders
                      </label>
                    </div>
                  </form>
                )}
              </div>
            </div>
            {/* Delivery Time Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Time</h2>
                <div className="flex space-x-4 mb-4">
                  <div
                    className={`flex-1 p-4 border rounded-lg cursor-pointer ${deliveryType === 'asap' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                    onClick={() => setDeliveryType('asap')}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className={`w-5 h-5 rounded-full border ${deliveryType === 'asap' ? 'border-indigo-600' : 'border-gray-400'} flex items-center justify-center`}>
                          {deliveryType === 'asap' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">ASAP Delivery</p>
                        <p className="text-sm text-gray-600">30-45 minutes</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex-1 p-4 border rounded-lg cursor-pointer ${deliveryType === 'scheduled' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                    onClick={() => setDeliveryType('scheduled')}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className={`w-5 h-5 rounded-full border ${deliveryType === 'scheduled' ? 'border-indigo-600' : 'border-gray-400'} flex items-center justify-center`}>
                          {deliveryType === 'scheduled' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Schedule for Later</p>
                        <p className="text-sm text-gray-600">Choose a time slot</p>
                      </div>
                    </div>
                  </div>
                </div>
                {deliveryType === 'scheduled' && (
                  <div className="mt-4">
                    <label htmlFor="time-slot" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Delivery Time
                    </label>
                    <div className="relative">
                      <select
                        id="time-slot"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
                      >
                        <option value="">Select a time slot</option>
                        <option value="12:00-12:30">Today, 12:00 PM - 12:30 PM</option>
                        <option value="12:30-13:00">Today, 12:30 PM - 1:00 PM</option>
                        <option value="13:00-13:30">Today, 1:00 PM - 1:30 PM</option>
                        <option value="13:30-14:00">Today, 1:30 PM - 2:00 PM</option>
                        <option value="18:00-18:30">Today, 6:00 PM - 6:30 PM</option>
                        <option value="18:30-19:00">Today, 6:30 PM - 7:00 PM</option>
                        <option value="19:00-19:30">Today, 7:00 PM - 7:30 PM</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <i className="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                <div className="space-y-4">
                  {/* Credit/Debit Card */}
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'credit' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                    onClick={() => handlePaymentMethodChange('credit')}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className={`w-5 h-5 rounded-full border ${paymentMethod === 'credit' ? 'border-indigo-600' : 'border-gray-400'} flex items-center justify-center`}>
                          {paymentMethod === 'credit' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">Credit/Debit Card</p>
                      </div>
                      <i className="fas fa-credit-card text-gray-400"></i>
                    </div>
                    {paymentMethod === 'credit' && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                              type="text"
                              value={cardCVV}
                              onChange={(e) => setCVV(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Digital Payments */}
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'digital' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                    onClick={() => handlePaymentMethodChange('digital')}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className={`w-5 h-5 rounded-full border ${paymentMethod === 'digital' ? 'border-indigo-600' : 'border-gray-400'} flex items-center justify-center`}>
                          {paymentMethod === 'digital' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">Digital Payment (Google Pay/Apple Pay/PayPal)</p>
                      </div>
                      <i className="fas fa-mobile-alt text-gray-400"></i>
                    </div>
                    {paymentMethod === 'digital' && (
                      <div className="mt-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">Your payment code:</p>
                          <p className="text-lg font-mono font-bold text-indigo-600">{digitalPaymentCode}</p>
                          <p className="text-xs text-gray-500 mt-2">Please use this code to complete your payment</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                    onClick={() => handlePaymentMethodChange('cash')}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className={`w-5 h-5 rounded-full border ${paymentMethod === 'cash' ? 'border-indigo-600' : 'border-gray-400'} flex items-center justify-center`}>
                          {paymentMethod === 'cash' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                      <i className="fas fa-money-bill-wave text-gray-400"></i>
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
              {/* Order Items */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">Items ({items.length})</h3>
                  <button
                    className="text-indigo-600 text-sm font-medium cursor-pointer whitespace-nowrap"
                    onClick={() => setShowOrderDetails(true)}
                  >
                    View Details
                  </button>
                </div>
                <div className="space-y-4 max-h-60 overflow-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-800 text-sm font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs">{item.restaurantName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                    <p className="font-medium text-gray-800">
                      {deliveryType === 'asap' ? '30-45 minutes' : selectedTime ? `Today, ${selectedTime.replace('-', ' - ')}` : 'Select a time slot'}
                    </p>
                  </div>
                </div>
              </div>
              {/* Terms and Place Order */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms(!acceptTerms)}
                    className="h-4 w-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                    I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>
                  </label>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className={`block w-full py-3 px-4 rounded-lg font-medium !rounded-button cursor-pointer whitespace-nowrap text-center ${acceptTerms ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'}`}
                > 
                  Place Order
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="block w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer bg-transparent border-none mt-2"
                  style={{ background: 'none' }}
                >
                  Return to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConf;
