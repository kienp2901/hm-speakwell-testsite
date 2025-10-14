import ExamInfo from '@/components/organisms/Exam/ExamInfo';

const Info = () => {
  const data = {
    title: 'IELTS Academic Writing',
    time: '1 hour',
    instructPractice: [
      'Answer both tasks',
      'You can change your answers at any time during the test',
    ],
    instructExam: [
      'Answer both tasks',
      'You can change your answers at any time during the test',
    ],
    infoPractice: [
      'There are 2 tasks in this test.',
      'Task 2 contributes twice as much as Task 1 to the writing score.',
      'You can check your word count while typing.',
      'The test clock will show you how long you have left.',
      'You can submit the test early if you finish before 60 minutes.*',
      "Click 'Start test' when you are ready.",
    ],
    infoExam: [
      'There are 2 tasks in this test.',
      'Task 2 contributes twice as much as Task 1 to the writing score.',
      'You can check your word count while typing.',
      'The test clock will show you how long you have left.',
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
