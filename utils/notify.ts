/* eslint-disable object-shorthand */
import { toast } from 'react-toastify';

export interface Notify {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  delay?: number;
}

export const notify = ({ type, message, delay = 0 }: Notify) => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    delay: delay,
  });
};

export default toast;
