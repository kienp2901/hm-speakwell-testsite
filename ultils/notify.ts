import { toast } from 'react-toastify';
import { NotifyOptions } from '@/types';

export const Notify = ({ type, message, delay }: NotifyOptions & { delay?: number }) => {
  const options = {
    position: 'top-right' as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    delay: delay || 0
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
};

export default toast;

