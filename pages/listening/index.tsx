import { Button, Stepper, RingProgress } from '@mantine/core';
import { Danger, VolumeHigh } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { examStartApi } from '@/service/api/contest';
import {
  IdBaikiemtraListening,
  IdHistoryContest,
  StudentId,
} from '@/store/selector';
import {
  setIdHistory,
  setListUserAnswer,
  setNumberListen,
} from '@/store/slice/examInfo';

const ListeningPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const studentId = useAppSelector(StudentId, shallowEqual);
  const idHistoryContest = useAppSelector(IdHistoryContest, shallowEqual);
  const idBaikiemtra = useAppSelector(IdBaikiemtraListening, shallowEqual);

  const [active, setActive] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const examStart = async () => {
    const response = await examStartApi(
      studentId,
      idHistoryContest,
      idBaikiemtra,
    );
    if (response.data.message === 'OK') {
      dispatch(setIdHistory(response.data?.metadata?.idHistory));
      dispatch(setNumberListen(2));
      dispatch(setListUserAnswer([]));
      setIsListening(false);
      router.replace('/listening/test');
      if (typeof window !== 'undefined') {
        localStorage.setItem('page', '0');
      }
    }
  };


  return (
    <div className="bg_container w-screen h-auto min-h-screen">
      <div className="star-field w-screen h-auto min-h-screen flex flex-col items-center justify-center gap-12 px-4 sm:px-16 lg:px-0 md:py-4">
        <div className="layer"></div>
        <div className="layer"></div>
        <div className="layer"></div>
        <div className="flex flex-col flex-1 absolute top-['50%']">
          <div
            className="bg-white rounded-3xl py-6 z-10 font-medium"
            style={{
              boxShadow: '0px 6px 6px 0px #0000001A',
            }}
          >
            <div className="w-full flex pb-8 pt-2 items-center justify-center">
              <img
                className="w-60 sm:w-[23rem]"
                src="/images/icanconnect_logo.png"
                alt=""
              />
            </div>
            <Stepper
              active={active}
              breakpoint="sm"
              className="[&_.mantine-Stepper-steps]:hidden [&_.mantine-Stepper-content]:p-0"
            >
              <Stepper.Step label="Prepared" description="prepared">
                <div className="px-6">
                  <h2 className="font-bold text-2xl text-primary text-center">
                    Listening
                  </h2>
                  <p className="text-center mt-2">
                    Bạn hãy chuẩn bị bước vào phần nghe
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-10">
                    <img src="/images/img-listening.png" alt="" />
                    <div>
                      <p className="text-lg font-bold mt-1">Bài nghe</p>
                      <p>10 phút</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Image
                      src="/images/icon-tick.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <p className="flex-1">
                      Bạn có thể nghe mỗi audio âm thanh 2 lần
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <Image
                      src="/images/icon-tick.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <p className="flex-1">
                      Khi đã gửi đáp án, không thể quay lại câu hỏi trước
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Image
                      src="/images/icon-tick.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <p className="flex-1">
                      Bài thi sẽ tự động chuyển sang bài đọc và viết khi hết
                      thời gian
                    </p>
                  </div>
                  <Button
                    className="bg-[#30A1E2] h-14 w-60 mt-8 block mx-auto text-base font-bold"
                    radius={'xl'}
                    onClick={() => setActive(1)}
                  >
                    Bắt đầu
                  </Button>
                </div>
              </Stepper.Step>
              
              <Stepper.Step label="Test sound" description="test-sound">
                <div className="px-12">
                  <h2 className="font-bold text-2xl text-primary text-center">
                    Kiểm tra âm thanh
                  </h2>
                  <p className="text-center mt-2">
                    Bạn hãy kiểm tra âm thanh trước khi làm bài
                  </p>
                  <div>
                    <audio
                      ref={audioRef}
                      src="/sound/VolumeTest.wav"
                      preload="metadata"
                      onLoadedMetadata={() =>
                        setDuration(Math.round(audioRef.current?.duration || 0))
                      }
                      onTimeUpdate={() =>
                        setCurrentTime(Math.round(audioRef.current?.currentTime || 0))
                      }
                      onEnded={() => {
                        if (audioRef.current) {
                          audioRef.current.pause();
                        }
                      }}
                    />
                    <div
                      className="group mt-2 cursor-pointer mx-auto relative rounded-full"
                      onClick={() => {
                        audioRef.current?.play();
                      }}
                    >
                      <RingProgress
                        className="mx-auto"
                        sections={[
                          {
                            value: (currentTime / duration) * 100,
                            color: '#30A1E2',
                          },
                        ]}
                        rootColor="#BDF1FF"
                        thickness={7}
                        size={90}
                        roundCaps
                        label={
                          <VolumeHigh
                            className="group-hover:transition-all ease-linear group-hover:scale-110 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            color="#30A1E2"
                            size={24}
                            variant="Bold"
                          />
                        }
                      />
                    </div>

                    <p className="text-center">Bấm để nghe</p>
                    <p className="text-center mt-6">
                      Bạn đã nghe thấy âm thanh chưa?
                    </p>
                  </div>
                  <Button
                    className="bg-[#30A1E2] h-14 w-64 mt-4 block mx-auto text-base font-bold"
                    radius={'xl'}
                    onClick={examStart}
                  >
                    Có, tiếp tục vào bài kiểm tra
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 w-64 mt-4 block mx-auto text-primary border-primary text-base font-bold"
                    radius={'xl'}
                    onClick={() => setIsListening(true)}
                  >
                    Không nghe thấy
                  </Button>
                  {isListening && (
                    <div className="mt-4 rounded-2xl bg-[#FFF8E5] py-2 px-4 max-w-[26rem]">
                      <p className="font-medium flex items-center gap-3">
                        <Danger color="#ff9b27" variant="Bold" /> Bạn hãy kiểm
                        tra những điều sau
                      </p>
                      <ul className="list-disc text-sm mt-2 font-normal pl-4">
                        <li>
                          Thiết bị của bạn đang không tắt bật âm thanh và để âm
                          lượng có thể nghe được
                        </li>
                        <li>
                          Loa hoặc tai nghe của bạn đã được kết nối đúng cách và
                          hoạt động bình thường?
                        </li>
                        <li>
                          Hãy nghe thử âm thanh trên 1 web như youtube để đảm
                          bảo không phải do các vấn đề từ phần cứng
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </Stepper.Step>
            </Stepper>
          </div>
        </div>
        <p className="text-center text-white absolute bottom-0">Copyright 2024 © GalaxyEdu.vn</p>
      </div>
    </div>
  );
};

export default ListeningPage;

