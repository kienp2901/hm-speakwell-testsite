/* eslint-disable no-nested-ternary */
import Button from '@/components/sharedV2/Button';
import { Book1, Edit2, VoiceSquare } from 'iconsax-react';
// import SpeakingIcon from 'images/speaking_icon2.svg';
const SpeakingIcon = '/images/speaking_icon2.svg';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { t } from 'i18next';

import ModalIntruction from '../ModalIntruction';

const ExamInfo = ({ data }: any) => {
  const router = useRouter();
  const pathname = router.asPath;
  const [isIntruction, setIsIntruction] = useState<boolean>(false);

  return (
    <div className="sm:mt-6 lg:mt-12 px-4 sm:px-8 lg:px-16 xl:px-24 font-be-vietnam">
      <h3 className="flex items-center text-2xl">
        {pathname.includes('/listening') ? (
          <VoiceSquare
            className="mr-3"
            size="32"
            color="#000000"
            variant="Bold"
          />
        ) : pathname.includes('/reading') ? (
          <Book1 className="mr-3" size="32" color="#000000" variant="Bold" />
        ) : pathname.includes('/writing') ? (
          <Edit2 className="mr-3" size="32" color="#000000" variant="Bold" />
        ) : (
          <img className="w-8 h-8 mr-3" src={SpeakingIcon} alt="" />
        )}{' '}
        {data.title}
      </h3>
      <p className="py-4">{t('exam_info.time')}: {data.time}</p>
      {pathname.includes('/practice') ? (
        <>
          <h3 className="text-2xl">{t('exam_info.instructions_to_candidates')}</h3>
          <ul className="list-disc py-4 ml-7">
            {data.instructPractice.map((item: any, index: any) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h3 className="text-2xl">{t('exam_info.information_for_candidates')}</h3>
          <ul className="list-disc py-4 ml-7">
            {data.infoPractice.map((item: any, index: any) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div>
            {data.aboutPractice.map((item: any, index: any) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3 className="text-2xl">{t('exam_info.instructions_to_candidates')}</h3>
          <ul className="list-disc py-4 ml-7">
            {data.instructExam.map((item: any, index: any) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h3 className="text-2xl">{t('exam_info.information_for_candidates')}</h3>
          <ul className="list-disc py-4 ml-7">
            {data.infoExam.map((item: any, index: any) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div>
            {pathname.includes('/listening') ? (
              <>
                <h3 className="text-2xl">{t('exam_info.about_exam_mode')}</h3>
                <ul className="list-disc py-4 ml-7">
                  {data.aboutExam.map((item: any, index: any) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                {data.aboutExam.map((item: any, index: any) => (
                  <p key={index}>{item}</p>
                ))}
              </>
            )}
          </div>
        </>
      )}

      {/*  */}
      <Button
        className="my-6 hidden lg:block"
        variant="outline"
        onClick={() => setIsIntruction(true)}
      >
        {t('exam_info.instruction')}
      </Button>
      <ModalIntruction
        isIntruction={isIntruction}
        onClose={() => setIsIntruction(false)}
        pathName={pathname}
      />
    </div>
  );
};

export default ExamInfo;
