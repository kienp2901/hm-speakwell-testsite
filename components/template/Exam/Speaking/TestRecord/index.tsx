import Wavesurfer from '@/components/organisms/Exam/WaveForm';
import Button from '@/components/sharedV2/Button';
import useRecorder from '@/hooks/UseRecorder';
import { Microphone, Pause, PlayCircle, VolumeHigh } from 'iconsax-react';
const microphone = '/images/microphone.svg';
import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const TestRecord = () => {
  const audioRef = useRef<any>();

  const [recorder, setRecorder] = useState<any>(null);
  const [isPlay, setIsPlay] = useState(false);

  const blinkAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

  const FlashingText: any = styled.span`
    animation: ${blinkAnimation} 1s linear infinite;
  `;

  const [audioURL, isRecording, startRecording, stopRecording, deleteData] =
    useRecorder() as [string, boolean, () => void, () => void, () => void];

  const record = () => {
    if (recorder) {
      if (isRecording) {
        stopRecording();
      } else {
        deleteData();
        startRecording();
      }
    } else {
      alert('Chưa cấp quyền sử dụng micro');
    }
  };

  const handlePlayRecord = () => {
    setIsPlay(prev => !prev);
  };

  useEffect(() => {
    const requestRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return new MediaRecorder(stream);
    };
    requestRecorder().then(setRecorder, console.error);
  }, []);

  useEffect(() => {
    if (isPlay) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlay]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="mt-10 lg:mt-16 text-2xl">Check your device</h3>
      <div className="bg-white border rounded-2xl p-6 sm:pb-10 lg:pb-24 w-[95%] sm:w-3/4 lg:w-2/3 xl:w-1/2 mt-10 lg:mt-16">
        <div className="flex items-center">
          <VolumeHigh
            className="mr-2"
            size="22"
            color="#000000"
            variant="Bold"
          />
          <h4 className="text-xl">Test micro</h4>
        </div>
        <p className="text-sm mt-2">
          Put on your micro and click the Record button to record your voice,
          then click the Play button to check your voice.
        </p>

        <div className="flex mt-6 items-center">
          <div className=" items-center">
            <Button
              variant="outline"
              className="bg-white hover:bg-ct-primary-500/[.001] flex mr-4"
              onClick={record}
            >
              <Microphone size="18" color="#1294F2" variant="Bold" className='mr-2' />
              {isRecording ? 'Stop' : 'Record'}
            </Button>
            {isRecording && (
              <FlashingText className="text-[red] text-[12px] text-center">
                Recording...
              </FlashingText>
            )}
          </div>

          {audioURL && (
            <div className="flex w-[400px] bg-white rounded-full border border-ct-primary-400">
              <div className="flex justify-center items-center px-4">
                {isPlay ? (
                  <Pause
                    className="cursor-pointer"
                    size="24"
                    color="#1294F2"
                    variant="Bold"
                    onClick={handlePlayRecord}
                  />
                ) : (
                  <PlayCircle
                    className="cursor-pointer"
                    size="24"
                    color="#1294F2"
                    variant="Bold"
                    onClick={handlePlayRecord}
                  />
                )}
              </div>
              <Wavesurfer play={isPlay} audioFile={audioURL} />
            </div>
          )}
          <audio
            ref={audioRef}
            src={audioURL}
            onEnded={() => setIsPlay(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default TestRecord;
