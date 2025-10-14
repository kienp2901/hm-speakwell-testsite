import { toast, TypeOptions } from 'react-toastify';
import { NotifyOptions } from '@/types';

export const Notify = ({ type, message, delay }: NotifyOptions & { delay?: number }) => {
  toast[type as TypeOptions](message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    delay: delay || 0
  });
};

export default toast;

