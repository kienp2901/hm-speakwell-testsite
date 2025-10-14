/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Slider } from '@mantine/core';
import {
  Pause,
  Play,
  PlayCircle,
  VolumeCross,
  VolumeHigh,
  VolumeLow1,
} from 'iconsax-react';

type TestAudioProps = {
  srcAudio: string;
  showVolumeControl?: boolean;
  showCurrentTime?: boolean;
  showDurationTime?: boolean;
  durationAudio?: number;
  isStart: boolean;
  callBack?: any;
  type?: string;
  className?: string;
  primaryColor?: string;
};

const TestAudio = ({
  srcAudio,
  showVolumeControl = true,
  showCurrentTime = true,
  showDurationTime = true,
  durationAudio = 0,
  isStart,
  callBack,
  type,
  className,
  primaryColor = '#1294F2',
}: TestAudioProps) => {
  const audioRef = useRef<any>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    audioRef?.current?.load();
  }, []);

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
    if (audioRef.current.duration === Infinity) {
      setDuration(durationAudio);
    } else {
      setDuration(Math.ceil(audioRef.current.duration));
      callBack && callBack(Math.ceil(audioRef.current.duration));
    }
    setIsPlay(isStart);
    audioRef.current.volume = volume;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(Math.ceil(audioRef.current.currentTime));
  };

  const handleTimeSliderChange = (value: any) => {
    const time = Number(value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    setIsPlay(true);
  };

  const handleVolumeSliderChange = (value: any) => {
    const volume = Number(value);
    audioRef.current.volume = volume;
    setVolume(volume);
  };

  useEffect(() => {
    if (isPlay) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlay]);

  const durationTime = (duration: number) => {
    const minute = Math.floor(duration / 60);
    const second = duration % 60;
    if (minute < 1) {
      return `00:${second > 9 ? second : `0${second}`}`;
    } else {
      return `${minute > 9 ? minute : `0${minute}`}:${
        second > 9 ? second : `0${second}`
      }`;
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={srcAudio}
        preload="metadata"
        onLoadedMetadata={handleLoadedData}
        onEnded={() => setIsPlay(false)}
        onTimeUpdate={handleTimeUpdate}
      />
      <div
        className={`flex w-full items-center  rounded-full bg-white ${
          type === 'speaking-test'
            ? 'py-1 px-1'
            : 'border border-ct-neutral-300 py-3 px-4 sm:px-7'
        } ${className}`}
      >
        <div className="flex flex-1 items-center">
          {!isPlay ? (
            <PlayCircle
              className="cursor-pointer mr-1 sm:mr-2"
              size="24"
              color={primaryColor}
              variant="Bold"
              onClick={() => {
                setIsPlay(true);
                audioRef.current.play();
              }}
            />
          ) : (
            <Pause
              className="cursor-pointer mr-1 sm:mr-2"
              size="24"
              color={primaryColor}
              variant="Bold"
              onClick={() => {
                setIsPlay(false);
                audioRef.current.pause();
              }}
            />
          )}
          {showVolumeControl && (
            <div className="w-24 sm:w-[150px] hidden lg:flex items-center mx-2">
              {volume > 0.5 ? (
                <VolumeHigh size="22" color={primaryColor} variant="Bold" />
              ) : volume > 0 ? (
                <VolumeLow1 size="22" color={primaryColor} variant="Bold" />
              ) : (
                <VolumeCross size="22" color={primaryColor} variant="Bold" />
              )}
              <Slider
                className="flex-1 ml-1 sm:ml-2"
                value={volume}
                label={null}
                min={0}
                max={1}
                step={0.1}
                onChange={handleVolumeSliderChange}
                classNames={{
                  track: 'h-1 rounded-full',
                  thumb: `h-2 w-2 border-[${primaryColor}]`,
                  bar: `bg-[${primaryColor}] -left-1`,
                }}
                styles={() => ({
                  track: {
                    ':before': {
                      backgroundColor: '#E2EBF3',
                      right: '-4px',
                      left: '-4px',
                    },
                  },
                })}
              />
            </div>
          )}
          {showCurrentTime && (
            <span className={`text-[${primaryColor}]`}>{current}</span>
          )}
          <Slider
            className="flex-1"
            value={currentTime}
            label={null}
            min={0}
            max={duration}
            step={1}
            onChange={handleTimeSliderChange}
            color={primaryColor}
            classNames={{
              track: 'h-1 rounded-full',
              thumb: `h-2 w-2 border-[${primaryColor}] color-[${primaryColor}] `,
              bar: `bg-[${primaryColor}] -left-1`,
            }}
            styles={() => ({
              track: {
                ':before': {
                  backgroundColor: '#E2EBF3',
                  right: '-4px',
                  left: '-4px',
                },
              },
            })}
          />
          {showDurationTime && (
            <span className={`text-[${primaryColor}]`}>
              {durationTime(durationAudio || duration)}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default TestAudio;
