import { toast } from 'sonner';

/**
 * AppToast Utility
 * Wrapper around 'sonner' for consistent feedback across the app.
 */
const AppToast = {
  success: (message, description = '') => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  },
  error: (message, description = '') => {
    toast.error(message, {
      description,
      duration: 4000,
    });
  },
  info: (message, description = '') => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  },
  warning: (message, description = '') => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },
};

export default AppToast;
