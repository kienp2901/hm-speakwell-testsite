import ExamInfo from '@/components/organisms/Exam/ExamInfo';
import Button from '@/components/sharedV2/Button';
import { useRouter } from 'next/router';

const Info = () => {
  const router = useRouter();
  const pathname = router.asPath;

  const data = {
    title: 'IELTS Speaking',
    time: '11-15 minutes',
    instructExam: [
      'Answer all questions.',
      'You will have 05 seconds to prepare before each question in Part 1 and Part 3. The recording will start automatically after 05 seconds.*',
      'You will have 01 minute to prepare for Part 2, during which you can take notes. The recording will start automatically after 01 minute.',
    ],
    instructPractice: [
      'Click record to record your answers.',
      'Answer all questions.',
    ],
    infoExam: [
      'There are 03 parts in this test.',
      'You can only record your answer ONCE for each question.',
      'Pay attention to the length of the recording.',
      "Click 'Start test' when you are ready.",
      "Click 'Submit' to finish test.",
    ],
    infoPractice: [
      'There are 03 parts in this test.',
      'You can record your answers as many times as you like. Click “Next question” when you are satisfied with your answer.*',
      ' You can take as much time as you like to prepare before you record.*',
      'Pay attention to the length of the recording.',
      "Click 'Start test' when you are ready.",
      "Click 'Submit' to finish test.",
    ],
    aboutExam: [
      '*This is an added feature. You will not have time to think in Speaking Part 1 and 3 in the real test.',
    ],
    aboutPractice: [
      '*This is an added feature. In the real test, you will not have time to think in Speaking Part 1 and 3, and you will have 01 minute to prepare for Part 2. You can answer each question ONLY ONCE.',
    ],
  };
  return (
    <>
      <ExamInfo data={data} />
    </>
  );
};

export default Info;
