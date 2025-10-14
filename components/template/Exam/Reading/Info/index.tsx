import ExamInfo from '@/components/organisms/Exam/ExamInfo';

const Info = () => {
  const data = {
    title: 'IELTS Academic Reading',
    time: '1 hour',
    instructPractice: [
      'Answer all the questions.',
      'You can change your answers at any time during the test.',
      'You can answer the questions in any order.',
    ],
    instructExam: [
      'Answer all the questions.',
      'You can change your answers at any time during the test.',
      'You can answer the questions in any order.',
    ],
    infoPractice: [
      'There are 40 questions in this test.',
      'Each question carries one mark.',
      'You WILL NOT lose points for incorrect answers, so try to answer all questions.',
      'You WILL NOT have additional time to check your answers after 60 minutes.',
      'You can submit the test early if you finish before 60 minutes.*',
      "Click 'Start test' when you are ready.",
    ],
    infoExam: [
      'There are 40 questions in this test.',
      'Each question carries one mark.',
      'You WILL NOT lose points for incorrect answers, so try to answer all questions.',
      'You WILL NOT have additional time to check your answers after 60 minutes.',
      'You can submit the test early if you finish before 60 minutes.*',
      "Click 'Start test' when you are ready.",
    ],
    aboutPractice: [
      '*In the real test, you will have to wait 60 minutes to end before you can move on to the next part.',
    ],
    aboutExam: [
      '*In the real test, you will have to wait 60 minutes to end before you can move on to the next part.',
    ],
  };
  return (
    <>
      <ExamInfo data={data} />
    </>
  );
};

export default Info;
