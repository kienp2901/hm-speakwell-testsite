/* eslint-disable no-nested-ternary */
import { Stepper } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setListUserAudio } from '@/store/slice/examInfo';

import TestSound from '../Listening/TestSound';

import AnswerDetail from './AnswerDetail';
import AnswerKey from './AnswerKey';
import Info from './Info';
import TestRecord from './TestRecord';
import TestSpeaking from './TestSpeaking';
import WaitGrading from './WaitGrading';

const Speaking = () => {
  const router = useRouter();
  const pathname = router.asPath;
  const dispatch = useDispatch();

  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    const removeStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      stream.getTracks()[0].stop(); // get all tracks from the MediaStream
    };

    removeStream();
  }, []);

  return (
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
          <TestRecord />
        </Stepper.Step>
        <Stepper.Step>
          <Info />
        </Stepper.Step>
      </Stepper>
      {active !== 2 ? (
        <Button
          onClick={() => setActive(active + 1)}
          className="mt-10 xl:mt-14 2xl:mt-20 mx-auto"
        >
          Continue
        </Button>
      ) : (
        <Button
          onClick={async () => {
            router.replace(`${pathname}/test`);
            dispatch(setListUserAudio([]));
          }}
          className="mt-10 xl:mt-14 2xl:mt-20 mx-auto"
        >
          Start test
        </Button>
      )}
    </>
  );
};

export default Speaking;
