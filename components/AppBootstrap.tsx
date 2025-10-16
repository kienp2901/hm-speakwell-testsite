import { useEffect, useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { initializeTenantDomains } from '@/service/tenantDomains';
import { setAccessToken, setEmsToken, setEmsRefreshToken } from '@/store/slice/auth';

interface AppBootstrapProps {
  children: ReactNode;
}

// Component to ensure tenant domains are loaded before rendering app
export default function AppBootstrap({ children }: AppBootstrapProps) {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // console.log('AppBootstrap: Starting initialization...');
        
        // 1. Wait for fetchTenantDomains to complete to ensure tenant code is set
        await initializeTenantDomains();
        
        // 2. Restore tokens from localStorage if exist
        const savedAccessToken = localStorage.getItem('ACCESS_TOKEN');
        const savedEmsToken = localStorage.getItem('EMS_TOKEN');
        const savedEmsRefreshToken = localStorage.getItem('EMS_REFRESH_TOKEN');
        
        if (savedAccessToken) {
          // console.log('Restoring access token from localStorage');
          dispatch(setAccessToken(savedAccessToken));
        }
        
        if (savedEmsToken) {
          // console.log('Restoring EMS token from localStorage');
          dispatch(setEmsToken(savedEmsToken));
        }
        
        if (savedEmsRefreshToken) {
          // console.log('Restoring EMS refresh token from localStorage');
          dispatch(setEmsRefreshToken(savedEmsRefreshToken));
        }
        
        // console.log('AppBootstrap: Initialization completed');
      } catch (error) {
        // Log error but don't block app rendering
        console.error('[AppBootstrap] initialization failed:', error);
      } finally {
        // Mark ready to render app
        setIsReady(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Display loading while waiting for initialization to complete
  if (!isReady) {
    return (
      <div className="bg_container w-screen h-auto min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Initializing...</div>
      </div>
    );
  }

  // Render children when ready
  return <>{children}</>;
}

