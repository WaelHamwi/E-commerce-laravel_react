import Axios from '../../../Api/Axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CART, PRODUCT } from '../../../Api/Api';

const RemoveFromCart = async (productId, cartItems, setCartItems) => {
  try {
    const response = await Axios.delete(`/${CART}/remove/${PRODUCT}?product_id=${productId}`);
    const cartItemCount = response.data.count;
    toast.success('Item removed from cart successfully');
    const updatedCartItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCartItems);
    return cartItemCount;
  } catch (error) {
    console.error('Error removing product from cart:', error);
    throw error;
  }
}; 

export default RemoveFromCart;
