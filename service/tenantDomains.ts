// Tenant domains service for hm-speakwell-testsite
// Based on lms-ican-hocmai-main/src/index.tsx

interface TenantDomain {
  domain: string;
  tenant_code: string;
  [key: string]: any;
}

let runtimeTenantCode: string | null = null;

export const setRuntimeTenantCode = (tenantCode: string): void => {
  runtimeTenantCode = tenantCode;
  // console.log('Tenant code set:', tenantCode);
};

export const getRuntimeTenantCode = (): string | null => {
  return runtimeTenantCode;
};

// Prefetch tenant domains on app start using fetch (no axios)
export const fetchTenantDomains = async (): Promise<TenantDomain[] | null> => {
  try {
    const API_BASE = process.env.API_BASE_URL;
    
    // console.log('API_BASE_URL from env:', process.env.API_BASE_URL);
    // console.log('Using API_BASE:', API_BASE);
    // console.log('Fetching tenant domains from:', `${API_BASE}tenant-domains`);
    
    const response = await fetch(`${API_BASE}tenant-domains`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-cache',
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tenant domains: ${response.status}`);
    }
    
    const data: TenantDomain[] = await response.json();
    // console.log('Tenant domains response:', data);
    
    try {
      if (data?.length > 0) {
        // Find tenant code matching current host
        const tenantItem = data.find((item) => {
          // Safely check if item and item.domain exist
          if (item && item.domain && typeof item.domain === 'string') {
            return item.domain.includes(window.location.host);
          }
          return false;
        });
        
        const tenantCode = tenantItem?.tenant_code;
        // console.log('Found tenant item:', tenantItem);
        // console.log('Tenant code:', tenantCode);
        
        if (tenantCode) {
          setRuntimeTenantCode(tenantCode);
          localStorage.setItem('TENANT_DOMAINS', tenantCode);
          // console.log('Tenant code found and set:', tenantCode);
        } else {
          console.log('No matching tenant code found for host:', window.location.host);
        }
      } else {
        console.log('No tenant domains data received');
      }
    } catch (error) {
      console.error('Error processing tenant domains:', error);
    }
    
    // Expose for quick inspection if needed
    (window as any).__TENANT_DOMAINS__ = data;
    return data;
  } catch (error) {
    // Do not block app start; just log the error
    console.error('[tenant-domains] fetchTenantDomains error:', error);
    return null;
  }
};

// Initialize tenant domains on app start
export const initializeTenantDomains = async (): Promise<void> => {
  try {
    // console.log('Initializing tenant domains...');
    await fetchTenantDomains();
    // console.log('Tenant domains initialization completed');
  } catch (error) {
    console.error('Failed to initialize tenant domains:', error);
  }
};

