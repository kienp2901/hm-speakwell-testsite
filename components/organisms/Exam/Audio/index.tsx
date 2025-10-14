/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { Divider, Modal, Slider } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import {
  Backward5Seconds,
  Clock,
  Forward5Seconds,
  PauseCircle,
  PlayCircle,
  VolumeCross,
  VolumeHigh,
  VolumeLow1,
} from 'iconsax-react';
const test_audio = '/sound/testFile.mp3';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

type AudioProps = {
  listAudio: any;
  setPage: (page: number) => void;
  setCheckAudioEnd: (checkAudioEnd: boolean) => void;
  setIsShowButtonSubmit: (isShow: boolean) => void;
  srcAudio: any;
  setSrcAudio: (scr: any) => void;
};

const Audio = ({
  listAudio,
  setPage,
  setCheckAudioEnd,
  srcAudio,
  setSrcAudio,
  setIsShowButtonSubmit,
}: AudioProps) => {
  const checkDevice: any =
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/Android/i) ||
    false;

  const router = useRouter();
  const pathname = router.asPath;

  const audioRef = useRef<any>();
  const [currentTime, setCurrentTime] = useState(0);
  // const [currentTime, setCurrentTime] = useState(() => {
  //   return localStorage.getItem('current-time')
  //     ? Number(localStorage.getItem('current-time'))
  //     : 0;
  // });
  const [duration, setDuration] = useState<number>(0);
  const [isPlay, setIsPlay] = useState(true);
  const [volume, setVolume] = useState(1);
  const [checkPause, setCheckPause] = useState(false);
  const [isModal, setIsModal] = useState<boolean>(false);

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
    setDuration(Math.ceil(audioRef.current.duration));
    audioRef.current.volume = volume;
    audioRef.current.muted = false;

    if (Number(sessionStorage.getItem('current-time')) > 1) {
      setIsModal(true);
      setIsPlay(false);
      audioRef.current.currentTime = Number(
        sessionStorage.getItem('current-time'),
      );
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(Math.ceil(audioRef.current.currentTime));

    sessionStorage.setItem(
      'current-time',
      `${Math.ceil(audioRef.current.currentTime)}`,
    );
  };

  const handleTimeSliderChange = (value: any) => {
    const time = Number(value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    sessionStorage.setItem('current-time', `${time}`);
    // setIsPlay(true);
  };

  const handleVolumeSliderChange = (value: any) => {
    const volume = Number(value);
    audioRef.current.volume = volume;
    setVolume(volume);
  };

  const BackwardTime = () => {
    const time = currentTime - 5 < 0 ? 0 : currentTime - 5;
    setCurrentTime(time);
    sessionStorage.setItem('current-time', `${time}`);
    audioRef.current.currentTime = time;
    // setIsPlay(true);
  };

  const ForwardTime = () => {
    const time = currentTime + 5 > duration ? duration : currentTime + 5;
    setCurrentTime(time);
    sessionStorage.setItem('current-time', `${time}`);
    audioRef.current.currentTime = time;
    // setIsPlay(true);
  };

  useEffect(() => {
    if (isPlay) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlay, srcAudio]);

  useEffect(() => {
    if (duration > 0 && currentTime === duration) {
      const index = listAudio.findIndex((item: any) => item === srcAudio);

      if (pathname.includes('/practice/listening')) {
        if (index === 2) {
          setIsShowButtonSubmit(true);
        }
      } else {
        if (index === listAudio.length - 1) {
          setIsShowButtonSubmit(true);
        }
      }

      if (index === listAudio.length - 1) {
        setCheckAudioEnd(true);
        setCheckPause(true);
        setIsPlay(false);
      } else {
        setTimeout(() => {
          setSrcAudio(listAudio[index + 1]);
          setPage(index + 2);
          localStorage.setItem('page', `${index + 2}`);
          sessionStorage.setItem('current-time', '0');
        }, 300);
      }
    }
  }, [currentTime]);

  return (
    <>
      <audio
        ref={audioRef}
        src={srcAudio}
        preload="metadata"
        onLoadedData={handleLoadedData}
        // onEnded={() => setIsPlay(false)}
        onTimeUpdate={handleTimeUpdate}
        muted
        onPause={() => {
          if (checkPause) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
        }}
        onPlay={() => {
          if (checkPause) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
        }}
      />
      {pathname.includes('/exam/listening') && pathname.includes('/test') ? (
        // <div className="w-auto rounded-2xl px-3 lg:px-2 py-2 bg-white inline-flex items-center">
        //   <div className="p-3 bg-ct-primary-400 rounded-full">
        //     <VolumeHigh size="32" color="#ffffff" variant="Bold" />
        //   </div>
        //   <div className="flex items-center justify-between border border-ct-primary-500 rounded-2xl px-2 py-1 mx-4">
        //     <Clock size="22" color="#0056a4" variant="Bold" />
        //     <span className="text-xl text-center text-ct-primary-400 min-w-[65px]">
        //       {current}
        //     </span>
        //   </div>
        //   <div className="hidden lg:flex items-center">
        //     {volume > 0.5 ? (
        //       <VolumeHigh size="22" color="#0067c5" variant="Bold" />
        //     ) : volume > 0 ? (
        //       <VolumeLow1 size="22" color="#0067c5" variant="Bold" />
        //     ) : (
        //       <VolumeCross size="22" color="#0067c5" variant="Bold" />
        //     )}
        //     <Slider
        //       className="w-20 sm:w-24"
        //       value={volume}
        //       label={null}
        //       min={0}
        //       max={1}
        //       step={0.1}
        //       onChange={handleVolumeSliderChange}
        //       classNames={{
        //         track: 'h-1 rounded-full',
        //         thumb: 'h-2 w-2 border-ct-primary-400',
        //         bar: 'bg-ct-primary-400 -left-1',
        //       }}
        //       styles={() => ({
        //         track: {
        //           ':before': {
        //             backgroundColor: '#E2EBF3',
        //             right: '-4px',
        //             left: '-4px',
        //           },
        //         },
        //       })}
        //     />
        //   </div>
        // </div>
        <div
          className={`w-full flex flex-col ${
            checkDevice ? 'flex-row-reverse' : 'lg:flex-row-reverse'
          }  rounded-2xl px-3 sm:px-4 lg:px-6 py-2 lg:py-1 bg-white`}
        >
          <div className="flex flex-1 items-center pt-3 py-3 pl-2 sm:pl-0">
            <p className="text-ct-primary-500 text-xs w-9 sm:w-10">{current}</p>
            <Slider
              className="flex-1 lg:mx-1"
              value={currentTime}
              label={null}
              min={0}
              max={duration}
              step={1}
              disabled
              classNames={{
                track: 'h-2 rounded-full',
                thumb: 'hidden',
                bar: 'bg-ct-primary-400 -left-1',
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
            <p className="text-ct-primary-500 text-xs w-9 sm:w-10 flex justify-end">
              {durationTime}
            </p>
          </div>
          <Divider
            my="sm"
            className={`m-0 mx-2 ${
              checkDevice ? 'mx-2' : 'lg:mx-0'
            } border-ct-neutral-200 hidden sm:block`}
          />
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              {isPlay ? (
                <PauseCircle
                  className="cursor-pointer mx-2 lg:mx-4"
                  size="30"
                  color="#1294F2"
                  variant="Bold"
                  onClick={() => {
                    setCheckPause(true);
                    setIsPlay(false);
                  }}
                />
              ) : (
                <PlayCircle
                  className="cursor-pointer mx-2 lg:mx-4"
                  size="30"
                  color="#1294F2"
                  variant="Bold"
                  onClick={() => {
                    setCheckPause(false);
                    setIsPlay(true);
                  }}
                />
              )}
              <div
                className={`flex ${
                  checkDevice ? 'flex' : 'lg:flex'
                }  items-center`}
              >
                {volume > 0.5 ? (
                  <VolumeHigh size="22" color="#1294F2" variant="Bold" />
                ) : volume > 0 ? (
                  <VolumeLow1 size="22" color="#1294F2" variant="Bold" />
                ) : (
                  <VolumeCross size="22" color="#1294F2" variant="Bold" />
                )}
                <Slider
                  className="w-24"
                  value={volume}
                  label={null}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={handleVolumeSliderChange}
                  classNames={{
                    track: 'h-1 rounded-full',
                    thumb: 'h-2 w-2 border-ct-primary-400',
                    bar: 'bg-ct-primary-400 -left-1',
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
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`w-full flex flex-row-reverse ${
            checkDevice ? 'flex-row-reverse' : 'lg:flex-col'
          }  rounded-2xl px-3 sm:px-4 lg:px-6 py-2 lg:py-1 bg-white`}
        >
          <div className="flex flex-1 items-center pt-3 py-3 pl-2 sm:pl-0">
            <p className="text-ct-primary-500 text-xs w-9 sm:w-10">{current}</p>
            <Slider
              className="flex-1 lg:mx-1"
              value={currentTime}
              label={null}
              min={0}
              max={duration}
              step={1}
              onChange={handleTimeSliderChange}
              classNames={{
                track: 'h-2 rounded-full',
                thumb: 'hidden',
                bar: 'bg-ct-primary-400 -left-1',
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
            <p className="text-ct-primary-500 text-xs w-9 sm:w-10 flex justify-end">
              {durationTime}
            </p>
          </div>
          <Divider
            my="sm"
            className={`m-0 mx-2 ${
              checkDevice ? 'mx-2' : 'lg:mx-0'
            } border-ct-neutral-200 hidden sm:block`}
          />
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Backward5Seconds
                className="cursor-pointer"
                size="22"
                color="#0067c5"
                onClick={BackwardTime}
              />
              {isPlay ? (
                <PauseCircle
                  className="cursor-pointer mx-2 lg:mx-4"
                  size="30"
                  color="#0067c5"
                  variant="Bold"
                  onClick={() => {
                    setCheckPause(true);
                    setIsPlay(false);
                  }}
                />
              ) : (
                <PlayCircle
                  className="cursor-pointer mx-2 lg:mx-4"
                  size="30"
                  color="#0067c5"
                  variant="Bold"
                  onClick={() => {
                    setCheckPause(false);
                    setIsPlay(true);
                  }}
                />
              )}
              <Forward5Seconds
                className="cursor-pointer"
                size="22"
                color="#0067c5"
                onClick={ForwardTime}
              />
            </div>
            <div
              className={`hidden ${
                checkDevice ? 'hidden' : 'lg:flex'
              }  items-center`}
            >
              {volume > 0.5 ? (
                <VolumeHigh size="22" color="#0067c5" variant="Bold" />
              ) : volume > 0 ? (
                <VolumeLow1 size="22" color="#0067c5" variant="Bold" />
              ) : (
                <VolumeCross size="22" color="#0067c5" variant="Bold" />
              )}
              <Slider
                className="w-24"
                value={volume}
                label={null}
                min={0}
                max={1}
                step={0.1}
                onChange={handleVolumeSliderChange}
                classNames={{
                  track: 'h-1 rounded-full',
                  thumb: 'h-2 w-2 border-ct-primary-400',
                  bar: 'bg-ct-primary-400 -left-1',
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
          </div>
        </div>
      )}
      {/* modal continue audio */}
      <Modal
        opened={isModal}
        centered
        onClose={() => setIsModal(false)}
        closeOnClickOutside={false}
        withCloseButton={false}
        className="min-w-[360px] z-[1201]"
        size={360}
        radius={'lg'}
      >
        <div>
          <p className="text-center px-8">
            Click "Continue" to continue playing the audio.
          </p>
          <div className="mt-4">
            <Button
              className="mx-auto"
              onClick={() => {
                setIsModal(false);
                setIsPlay(true);
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Audio;
