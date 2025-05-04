import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

interface CartIconProps {
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ className }) => {
  const navigate = useNavigate();
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  const itemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <div 
      className="relative cursor-pointer"
      onClick={() => navigate('/cart')}
    >
      <FaShoppingCart className={`text-2xl text-gray-700 hover:text-orange-600 ${className || ''}`} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon; 