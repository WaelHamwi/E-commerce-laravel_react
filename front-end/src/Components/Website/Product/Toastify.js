import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToastSuccess = (message) => {

  toast.success(message, {
    position: "top-right", // Position of the toast
    autoClose: 3000, // Delay in milliseconds before the toast automatically closes
    hideProgressBar: false, // Hide or show the progress bar
    closeOnClick: true, // Close the toast when clicked
    pauseOnHover: true, // Pause the timer when hovered
    draggable: true, // Allow the toast to be draggable
    progress: undefined // Progress bar style
  });
};

export const showToastError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};
