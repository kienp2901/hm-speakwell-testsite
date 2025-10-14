import { Button } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { examStartApi } from '@/service/api/contest';
import {
  IdBaikiemtraRW,
  IdHistoryContest,
  StudentId,
} from '@/store/selector';
import {
  setIdHistory,
  setListUserAnswer,
} from '@/store/slice/examInfo';

const ReadingWritingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const studentId = useAppSelector(StudentId, shallowEqual);
  const idHistoryContest = useAppSelector(IdHistoryContest, shallowEqual);
  const idBaikiemtra = useAppSelector(IdBaikiemtraRW, shallowEqual);

  const timeRemainingInterval = useRef<NodeJS.Timeout>();
  const [timeRemaining, setTimeRemaining] = useState(15);

  useEffect(() => {
    timeRemainingInterval.current = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (timeRemaining === 0) {
      if (timeRemainingInterval.current) {
        clearInterval(timeRemainingInterval.current);
      }
      router.replace('/reading-writing/test');
    }
  }, [timeRemaining, router]);

  const examStart = async () => {
    const response = await examStartApi(
      studentId,
      idHistoryContest,
      idBaikiemtra,
    );
    console.log(response);
    if (response.data.message === 'OK') {
      dispatch(setIdHistory(response.data?.metadata?.idHistory));
      dispatch(setListUserAnswer([]));
      if (typeof window !== 'undefined') {
        localStorage.setItem('page', '0');
      }
      router.replace('/reading-writing/test');
    }
  };

  return (
    <div className="bg_container w-screen h-auto min-h-screen">
      <div className="star-field w-screen h-auto min-h-screen flex flex-col items-center justify-center gap-12 px-4 sm:px-16 lg:px-0 md:py-4">
        <div className="layer"></div>
        <div className="layer"></div>
        <div className="layer"></div>

        <div className="flex flex-1 items-center justify-center">
          <div
            className="bg-white rounded-3xl py-6 z-10 font-medium"
            style={{
              boxShadow: '0px 6px 6px 0px #0000001A',
            }}
          >
            <div className=" w-full flex pb-8 pt-2 items-center justify-center">
              <img
                className="w-60 sm:w-[23rem]"
                src="/images/icanconnect_logo.png"
                alt=""
              />
            </div>
            <div className="px-6">
              <h2 className="font-bold text-2xl text-primary text-center">
                Reading & Writing
              </h2>
              <p className="text-center mt-2">
                Bạn hãy chuẩn bị bước vào phần đọc và viết
              </p>
              <div className="mt-4 flex items-center justify-center gap-10">
                <img src="/images/img-reading.png" alt="" />
                <div>
                  <p className="text-lg font-bold mt-1">Bài đọc và viết</p>
                  <p>25 phút</p>
                </div>
              </div>

              <div className="flex items-center justify-center py-4">
                <div className=" w-32 h-32 rounded-full bg-[#FFFDD3] border-2  border-[#FF9B27] flex items-center justify-center text-center">
                  <p className=" font-mikakoBold font-bold text-[40px] text-[#FF9B27]">
                    {timeRemaining}s
                  </p>
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
                  Bài thi sẽ tự động kết thúc khi hết thời gian
                </p>
              </div>

              <Button
                className="bg-[#30A1E2] h-14 w-60 mt-8 block mx-auto text-base font-bold"
                radius={'xl'}
                onClick={examStart}
              >
                Bắt đầu
              </Button>
            </div>
          </div>
        </div>
        <p className=" text-white text-center">Copyright 2024 © GalaxyEdu.vn</p>
      </div>
    </div>
  );
};

export default ReadingWritingPage;

