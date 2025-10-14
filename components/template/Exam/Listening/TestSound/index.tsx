import TestAudio from '@/components/organisms/Exam/TestAudio';
import Button from '@/components/sharedV2/Button';
import { PlayCircle, VolumeHigh } from 'iconsax-react';
const test_audio = '/images/audio/VolumeTest.wav';
import { useState } from 'react';
import { t } from 'i18next';

const TestSound = () => {
  const [isTest, setIsTest] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <h3 className="mt-10 lg:mt-16 text-2xl">{t('test_sound.check_your_device')}</h3>
      <div className="bg-white border rounded-2xl p-6 sm:pb-10 lg:pb-24 w-[95%] sm:w-3/4 lg:w-2/3 xl:w-1/2 mt-10 lg:mt-16">
        <div className="flex items-center">
          <VolumeHigh
            className="mr-2"
            size="22"
            color="#000000"
            variant="Bold"
          />
          <h4 className="text-xl">{t('test_sound.test_sound')}</h4>
        </div>
        <p className="text-sm mt-2 mb-6">
          {t('test_sound.instruction')}
        </p>
        {isTest ? (
          <TestAudio srcAudio={test_audio} isStart={true} />
        ) : (
          <Button
            variant="outline"
            className="bg-white font-medium mt-6 hover:bg-ct-primary-500/[.001]"
            onClick={() => setIsTest(true)}
          >
            <PlayCircle
              className="mr-2"
              size="22"
              color="#1294F2"
              variant="Bold"
            />{' '}
            {t('test_sound.play_sound')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestSound;
