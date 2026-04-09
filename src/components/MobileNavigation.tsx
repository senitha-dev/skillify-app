import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { toast } from 'sonner';

export default function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPress = useRef<number>(0);

  useEffect(() => {
    const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
      // If we are on the login page or the dashboard (root), handle exit logic
      if (location.pathname === '/' || location.pathname === '/login') {
        const now = Date.now();
        if (now - lastBackPress.current < 2000) {
          // Double tap detected
          App.exitApp();
        } else {
          lastBackPress.current = now;
          toast.info('Press back again to exit', {
            duration: 2000,
            position: 'bottom-center',
          });
        }
      } else {
        // Otherwise, just go back in history
        if (canGoBack) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }
    });

    return () => {
      backButtonListener.then(l => l.remove());
    };
  }, [location.pathname, navigate]);

  return null;
}
