import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/store/hooks';
import { shallowEqual } from 'react-redux';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  });

  return null;
}

