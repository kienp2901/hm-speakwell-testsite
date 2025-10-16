/* eslint-disable no-nested-ternary */
import { Stepper } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setListUserAnswer } from '@/store/slice/examInfo';
import ModalWarning from '@/components/organisms/Exam/ModalWarning';

import AnswerDetail from './AnswerDetail';
import AnswerKey from './AnswerKey';
import Info from './Info';
import TestListening from './TestListening';
import TestSound from './TestSound';
import { t } from 'i18next';

const Listening = () => {
  const router = useRouter();
  const pathname = router.asPath;
  const dispatch = useDispatch();

  const [active, setActive] = useState<number>(0);
  const [isModalWarning, setIsModalWarning] = useState<boolean>(false);
  const getLastSegment = (pathname: string) => pathname.split('/').filter(Boolean).pop();
  const last = getLastSegment(pathname);

  const onStartTest = () => {
    router.replace(`${pathname}/test`);
    dispatch(setListUserAnswer([]));
    sessionStorage.setItem('current-time', '0');
  };

  return (
    <>
      {last === 'test' ? (
        <TestListening />
      ) : last === 'answer-key' ? (
        <AnswerKey />
      ) : last === 'answer-detail' ? (
        <AnswerDetail />
      ) : (
        <>
          <Stepper
            active={active}
            onStepClick={setActive}
            breakpoint="sm"
            classNames={{
              steps: 'hidden',
            }}
          >
            <Stepper.Step>
              <TestSound />
            </Stepper.Step>
            <Stepper.Step>
              <Info />
            </Stepper.Step>
          </Stepper>
          {active === 0 ? (
            <Button
              onClick={() => setActive(1)}
              className="mt-14 lg:mt-20 mx-auto"
            >
              {t('exam_library.continue_exam')}
            </Button>
          ) : (
            <Button
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
              className="mt-10 xl:mt-14 2xl:mt-20 mx-auto"
            >
              {t('exercise.start_test')}
            </Button>
          )}
        </>
      )}
      

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

export default Listening;
