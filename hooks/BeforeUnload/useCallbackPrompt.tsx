import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { postExamPartStopApi } from '@/service/api/examConfig';
import { IdHistoryContest } from '@/store/selector';

export function useCallbackPrompt(when: boolean): [boolean, () => void, () => void] {
  const router = useRouter();
  const dispatch = useDispatch();

  const idHistoryContest = useSelector(IdHistoryContest, shallowEqual);

  const [showPrompt, setShowPrompt] = useState(false);
  const [lastLocation, setLastLocation] = useState<string | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
  }, []);

  const confirmNavigation = useCallback(async () => {
    setShowPrompt(false);
    setConfirmedNavigation(true);
    localStorage.removeItem('page');
    dispatch(setListUserAnswer([]));
    
    if (router.asPath.includes('/test')) {
      await postExamPartStopApi(idHistoryContest as string);
    }
    
    const ele = document.getElementsByTagName('audio');
    if (ele.length > 0) {
      ele[0].setAttribute('src', '');
    }
  }, [idHistoryContest, router.asPath, dispatch]);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      const historyPath = localStorage.getItem('historyPath') || '/';
      router.push(historyPath);
    }
  }, [confirmedNavigation, lastLocation, router]);

  // Handle Next.js route changes
  useEffect(() => {
    if (!when) return;

    const handleRouteChange = (url: string) => {
      if (!confirmedNavigation && url !== router.asPath) {
        setShowPrompt(true);
        setLastLocation(url);
        router.events.emit('routeChangeError');
        throw 'Route change aborted.';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [when, confirmedNavigation, router]);

  // Handle browser back/forward
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when]);

  return [showPrompt, confirmNavigation, cancelNavigation];
}

