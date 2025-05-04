import axios from 'axios';

export const getFoodItems = () => axios.get('http://localhost:5000/api/food-items');
export const placeOrder = (order: any) => axios.post('http://localhost:5000/api/orders', order);
