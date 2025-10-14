import ExamInfo from '@/components/organisms/Exam/ExamInfo';
import { t } from 'i18next';

const Info = () => {
  const data = {
    title: t('listening_info.title'),
    time: t('listening_info.time'),
    instructExam: [
      t('listening_info.instruct_exam_1'),
      t('listening_info.instruct_exam_2'),
    ],
    instructPractice: [
      t('listening_info.instruct_practice_1'),
      t('listening_info.instruct_practice_2'),
    ],
    infoExam: [
      t('listening_info.info_exam_1'),
      t('listening_info.info_exam_2'),
      t('listening_info.info_exam_3'),
      t('listening_info.info_exam_4'),
      t('listening_info.info_exam_5'),
      t('listening_info.info_exam_6'),
      t('listening_info.info_exam_7'),
    ],
    infoPractice: [
      t('listening_info.info_practice_1'),
      t('listening_info.info_practice_2'),
      t('listening_info.info_practice_3'),
      t('listening_info.info_practice_4'),
      t('listening_info.info_practice_5'),
      t('listening_info.info_practice_6'),
      t('listening_info.info_practice_7'),
      t('listening_info.info_practice_8'),
      t('listening_info.info_practice_9'),
      t('listening_info.info_practice_10'),
    ],
    aboutExam: [
      t('listening_info.about_exam_1'),
      t('listening_info.about_exam_2'),
    ],
    aboutPractice: [
      t('listening_info.about_practice_1'),
    ],
  };

  return (
    <>
      <ExamInfo data={data} />
    </>
  );
};

export default Info;
