import { useRouter } from 'next/router';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import FullResult template
const FullResult = dynamic(() => import('@/components/template/Exam/FullResult'), { ssr: false });

export default function ExamResultPage() {
  const router = useRouter();
  const { tenant, campaign, slug, idExam, idHistory } = router.query;

  useEffect(() => {
    if (router.isReady) {
      console.log('Exam Result Page - Route params:', {
        tenant,
        campaign,
        slug,
        idExam,
        idHistory,
      });
    }
  }, [router.isReady, tenant, campaign, slug, idExam, idHistory]);

  // Show loading until router is ready
  if (!router.isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return <FullResult />;
}

