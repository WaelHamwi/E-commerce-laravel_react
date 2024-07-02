import Axios from '../../../Api/Axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CART } from '../../../Api/Api';

const updateQuantity = async (productId, quantity) => {
  try {
    const response = await Axios.put(`/${CART}/update-quantity/product`, {
      product_id: productId,
      quantity: quantity
    });

    toast.success('Quantity updated successfully');

    return response.data.message;
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw error;
  }
}; 

export default updateQuantity;
