import { Pause, VolumeHigh } from 'iconsax-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { NumberListen } from '@/store/selector';
import { setNumberListen } from '@/store/slice/examInfo';
import { questionEnumType } from '@/ultils/typeQuestion';
import { ThemeIcon, RingProgress, Text, Center } from '@mantine/core';

interface CustomAudioProps {
  quizType: number;
  srcAudio: string;
  autoPlay?: boolean;
}

const CustomAudio: React.FC<CustomAudioProps> = ({ quizType, srcAudio, autoPlay }) => {
  const dispatch = useAppDispatch();
  // số lượt nghe còn lại
  const numberListen = useAppSelector(NumberListen, shallowEqual);
  // audio
  const audioRef = useRef<HTMLAudioElement>(null);
  //   độ dài audio
  const [duration, setDuration] = useState(0);
  // thời gian hiện tại audio
  const [currentTime, setCurrentTime] = useState(0);

  const [onEndAudio, setOnEndAudio] = useState(false);

  // render đội dài audio
  const durationTime = useMemo(() => {
    const minute = Math.floor(duration / 60);
    const second = duration % 60;
    if (minute < 1) {
      return `00:${second > 9 ? second : `0${second}`}`;
    } else {
      return `${minute > 9 ? minute : `0${minute}`}:${
        second > 9 ? second : `0${second}`
      }`;
    }
  }, [duration]);

  //   render thời gian hiện tại
  const current = useMemo(() => {
    const minute = Math.floor(currentTime / 60);
    const second = currentTime % 60;
    if (minute < 1) {
      return `00:${second > 9 ? second : `0${second}`}`;
    } else {
      return `${minute > 9 ? minute : `0${minute}`}:${
        second > 9 ? second : `0${second}`
      }`;
    }
  }, [currentTime]);

  const handleLoadedData = () => {
    if (audioRef.current) {
      setDuration(Math.round(audioRef.current.duration));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(Math.round(audioRef.current.currentTime));
    }
  };

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play();
      }, 2000);
    }
  }, [autoPlay, srcAudio]);

  return (
    <div>
      <audio
        ref={audioRef}
        src={srcAudio}
        preload="metadata"
        onLoadedMetadata={handleLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onPlay={(event) => {
          setOnEndAudio(false);
          dispatch(setNumberListen(numberListen - 1));
        }}
        onEnded={() => {
          setOnEndAudio(true);
          audioRef.current?.pause();
        }}
      />
      <p
        className={`font-medium ${
          quizType !== questionEnumType.READING && 'text-center'
        }`}
      >
        Bấm để nghe
      </p>
      <div
        className={`${
          quizType === questionEnumType.READING ? 'flex items-center gap-4' : ''
        }`}
      >
        {numberListen == 0 && onEndAudio ? (
          <>
            <div
              className={`mt-2 relative rounded-full ${
                quizType !== questionEnumType.READING
                  ? 'w-[6.5rem] h-[6.5rem] mx-auto'
                  : 'w-20 h-20'
              }`}
            >
              <img src="/images/bg-sound-disable.svg" alt="" />
            </div>
            <p
              className={`text-sm mt-1 ${
                quizType !== questionEnumType.READING && 'text-center'
              }`}
            >
              Hết lượt nghe
            </p>
          </>
        ) : (
          <>
            <div
              className={`group mt-2 cursor-pointer relative rounded-full ${
                quizType !== questionEnumType.READING ? 'mx-auto' : 'ml-2'
              }`}
              onClick={() => {
                audioRef.current?.play();
              }}
            >
              <RingProgress
                className={`${
                  quizType !== questionEnumType.READING && 'mx-auto'
                }`}
                sections={[
                  { value: (currentTime / duration) * 100, color: '#30A1E2' },
                ]}
                rootColor="#BDF1FF"
                thickness={quizType !== questionEnumType.READING ? 10 : 7}
                size={quizType !== questionEnumType.READING ? 120 : 90}
                roundCaps
                label={
                  <VolumeHigh
                    className="group-hover:transition-all ease-linear group-hover:scale-110 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    color="#30A1E2"
                    size={`${quizType !== questionEnumType.READING ? 32 : 24}`}
                    variant="Bold"
                  />
                }
              />
            </div>
            <div
              className={`mt-1 ${
                quizType !== questionEnumType.READING && 'text-center'
              }`}
            >
              <p className="text-sm">Lượt nghe còn lại: {numberListen}</p>
              <p className="text-sm mt-1">
                <span className="inline-block w-11">{current}</span> /{' '}
                <span className="inline-block w-11">{durationTime}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomAudio;

