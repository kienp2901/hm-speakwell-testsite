import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { StudentId } from '@/store/selector';

export default function InitComponent() {
  const studentID = useAppSelector(StudentId, shallowEqual);
  const router = useRouter();

  useEffect(() => {
    if (!studentID) {
      // Don't redirect if we're on a dynamic route (tenant/campaign/slug)
      const isDynamicRoute = router.pathname.includes('[tenant]') || 
                            (router.asPath && router.asPath.split('/').length >= 4);
      
      console.log('InitComponent - studentID:', studentID);
      console.log('InitComponent - pathname:', router.pathname);
      console.log('InitComponent - asPath:', router.asPath);
      console.log('InitComponent - isDynamicRoute:', isDynamicRoute);
      
      if (!isDynamicRoute && location.pathname != '/') {
        console.log('InitComponent - Redirecting to /');
        // router.replace('/');
      }
    }
  }, [studentID, router.pathname, router.asPath]);

  return <></>;
}

