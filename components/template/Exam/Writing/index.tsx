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

  return (
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
  );
};

export default Writing;
