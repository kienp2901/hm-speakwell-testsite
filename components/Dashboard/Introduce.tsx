import { Button } from '@mantine/core';
import Image from 'next/image';
import React from 'react';

interface IntroduceProps {
  onNext: (step: number) => void;
}

const Introduce: React.FC<IntroduceProps> = ({ onNext }) => {
  return (
    <div className="lg:w-[830px] px-3 sm:px-6 lg:px-10">
      <img
        className="mx-auto w-38 sm:w-60 lg:w-80"
        src="/images/sudungnangluc.png"
        alt=""
      />
      <p className="font-medium text-center mt-2">
        Kiểm tra trình độ đầu vào của học viên để phân khóa học phù hợp với
        trình độ và mục tiêu của học viên. Bài kiểm tra đánh giá được khả năng
        ngôn ngữ của học viên thông qua 3 kỹ năng: Nghe, Đọc và Viết
      </p>
      <div className="flex items-center flex-col sm:flex-row gap-8 mt-6">
        <div className="w-44 h-44 rounded-full bg-[#FFFDD3] border-[3px] border-[#FF9B27] flex flex-col items-center justify-center text-[#FF9B27]">
          <p className="text-[1.75rem] sm:text-[2.5rem] font-medium">25 phút</p>
          <p className="text-xl">Đánh giá nhanh</p>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Image src="/images/icon-tick.svg" width={24} height={24} alt="" />
            <p className="flex-1">
              Học sinh làm 1 bài test 3 kỹ năng trên test site và cho kết quả
              khóa học tương ứng trình độ
            </p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Image src="/images/icon-tick.svg" width={24} height={24} alt="" />
            <p className="flex-1">Dành cho học sinh từ 7-12 tuổi</p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Image src="/images/icon-tick.svg" width={24} height={24} alt="" />
            <p className="flex-1">
              Bài kiểm tra được thiết kế trên tiêu chuẩn các nguồn sách luyện
              thi và đề của của chứng chỉ quốc tế Cambridge cấp độ Starters, Movers, Flyers
            </p>
          </div>
        </div>
      </div>
      <Button
        className="bg-[#30A1E2] h-14 mt-8 px-6 block mx-auto"
        radius={'xl'}
        classNames={{
          label: 'text-base font-bold',
        }}
        onClick={() => onNext(1)}
      >
        Bắt đầu làm bài kiểm tra
      </Button>
    </div>
  );
};

export default Introduce;

