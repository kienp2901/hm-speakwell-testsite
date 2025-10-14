import { Modal, Slider } from '@mantine/core';
import {
  PlayCircle,
  VideoSquare,
  VolumeCross,
  VolumeHigh,
  VolumeLow1,
} from 'iconsax-react';
import { useMemo, useRef, useState } from 'react';

type ModalVideoAIProps = {
  isOpen: boolean;
  onClose: () => void;
  videoAI: string;
  page: number;
};

const ModalVideoAI = ({
  isOpen,
  onClose,
  videoAI,
  page,
}: ModalVideoAIProps) => {
  const [volume, setVolume] = useState<number>(1);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const videoRefAI = useRef<any>();
  const [isPlay, setIsPlay] = useState<boolean>(false);

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
    setDuration(Math.floor(videoRefAI.current.duration));
    videoRefAI.current.volume = volume;
    const playPromise = videoRefAI.current.play();
    playPromise
      .then(() => {
        setIsPlay(false);
      })
      .catch(() => {
        setIsPlay(true);
      });
  };

  const handleVolumeSliderChange = (value: any) => {
    const volume = Number(value);
    videoRefAI.current.volume = volume;
    setVolume(volume);
  };

  return (
    <>
      <Modal
        opened={isOpen}
        centered
        onClose={onClose}
        withCloseButton={false}
        closeOnClickOutside={false}
        className="min-w-[320px] z-[1201]"
        size="auto"
        radius={'lg'}
      >
        <div className="p-2">
          <div className="flex items-center mb-4">
            <VideoSquare size="24" color="#0056a4" variant="Bold" />
            <p className="ml-2">Video tutorial Part {page}</p>
          </div>
          <div className="video-container-AI relative">
            <video
              ref={videoRefAI}
              className="w-full max-w-[640px] rounded-xl"
              src={videoAI}
              playsInline
              disablePictureInPicture
              onLoadedMetadata={handleLoadedData}
              onTimeUpdate={() =>
                setCurrentTime(Math.floor(videoRefAI.current.currentTime))
              }
              onEnded={() => {
                onClose();
                videoRefAI.current.pause();
              }}
            ></video>

            <div className="box-control w-full rounded-b-xl py-3 px-4 flex items-center absolute bg-gradient-to-t from-black bottom-0 pt-6  transition duration-300 ease-linear opacity-0 invisible">
              <p className="text-white text-sm">
                {current} / {durationTime}
              </p>
              {navigator.userAgent.match(/iPad/i) ||
              navigator.userAgent.match(/iPhone/i) ||
              navigator.userAgent.match(/Android/i) ? (
                ''
              ) : (
                <div className="hidden lg:flex items-center flex-1 justify-end ml-4">
                  {volume > 0.5 ? (
                    <VolumeHigh size="20" color="#fff" variant="Bold" />
                  ) : volume > 0 ? (
                    <VolumeLow1 size="20" color="#fff" variant="Bold" />
                  ) : (
                    <VolumeCross size="20" color="#fff" variant="Bold" />
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
                      track: 'h-1 rounded-full bg-white',
                      thumb: 'h-2 w-2 text-white border-white',
                      bar: '-left-1 bg-white',
                    }}
                    styles={() => ({
                      track: {
                        ':before': {
                          backgroundColor: '#bbb',
                          right: '-4px',
                          left: '-4px',
                        },
                      },
                    })}
                  />
                </div>
              )}
            </div>
            {isPlay && (
              <PlayCircle
                className="absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                size="48"
                color="#111"
                variant="Bold"
                onClick={() => {
                  setIsPlay(false);
                  videoRefAI.current.play();
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalVideoAI;
