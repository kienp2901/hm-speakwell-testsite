/* eslint-disable no-nested-ternary */
import Button from '@/components/sharedV2/Button';
import { useRouter } from 'next/router';

import AnswerDetail from './AnswerDetail';
import AnswerGradle from './AnswerGradle';
import AnswerKey from './AnswerKey';
import AnswerTaskDetail from './AnswerTaskDetail';
import Info from './Info';
import TestWriting from './TestWriting';

const Writing = () => {
  const router = useRouter();
  const pathname = router.asPath;

  const getLastSegment = (pathname: string) => pathname.split('/').filter(Boolean).pop();
  const last = getLastSegment(pathname);

  return (
    <>
      {last === 'test' ? (
        <TestWriting />
      ) : last === 'wait-grading' ? (
        <AnswerGradle />
      ) : last === 'answer-key' ? (
        <AnswerKey />
      ) : last === 'answer-detail' ? (
        <AnswerDetail />
      ) : last === 'answer-task-detail' ? (
        <AnswerTaskDetail />
      ) : (
        <>
          <Info />
          <Button
            className="mt-10 xl:mt-14 2xl:mt-20 mx-auto"
            onClick={() => {
              router.replace(`${pathname}/test`);
              localStorage.setItem(
                'time_start',
                `${Math.floor(Date.now() / 1000)}`,
              );
            }}
          >
            Start test
          </Button>
        </>
      )}
    </>
  );
};

export default Writing;
