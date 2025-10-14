/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import Button from '@/components/sharedV2/Button';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setListUserAnswer } from '@/store/slice/examInfo';
import ModalWarning from '@/components/organisms/Exam/ModalWarning';

import AnswerDetail from './AnswerDetail';
import AnswerKey from './AnswerKey';
import Info from './Info';
import TestReading from './TestReading';

const Reading = () => {
  const router = useRouter();
  const pathname = router.asPath;
  const dispatch = useDispatch();

  const [isModalWarning, setIsModalWarning] = useState<boolean>(false);

  // const getExamPartStart = async (idExam: number, idRound: number) => {
  //   const response = await postExamPartStartApi(idExam, idRound);
  //   if (response.status === 200) {
  //   }
  // };

  const onStartTest = () => {
    router.replace(`${pathname}/test`);
    dispatch(setListUserAnswer([]));
    localStorage.setItem('time_start', `${Math.floor(Date.now() / 1000)}`);
  };

  return (
    <>
      <Info />
      <Button
        className="mt-10 xl:mt-14 2xl:mt-20 mx-auto"
        onClick={() => {
          if (
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/Android/i)
          ) {
            setIsModalWarning(true);
          } else {
            onStartTest();
          }
        }}
      >
        Start test
      </Button>

      {(navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/Android/i)) && (
        <ModalWarning
          isOpen={isModalWarning}
          onClose={() => setIsModalWarning(false)}
          onStart={onStartTest}
        />
      )}
    </>
  );
};

export default Reading;
