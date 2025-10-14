import { Button } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

const SubmitListen: React.FC = () => {
  const router = useRouter();

  return (
    <div className="w-screen h-screen bg-[url('/images/bg_speakwell.svg')] flex flex-col items-center justify-center gap-12">
      <Image src="/images/icanconnect_logo.png" width={368} height={54} alt="" />
      <div
        className="bg-white rounded-3xl py-6 z-10 font-medium"
        style={{
          boxShadow: '0px 6px 6px 0px #0000001A',
        }}
      >
        <div className="px-10">
          <h2 className="font-bold text-2xl text-primary text-center">
            Tốt lắm
          </h2>
          <p className="text-center mt-2">
            Bạn hãy chuẩn bị bước vào phần đọc và viết
          </p>
          <div className="mt-6 mx-auto w-36 h-36 rounded-full bg-[#FFFDD3] border-[3px] border-[#FF9B27] flex flex-col items-center justify-center text-[#FF9B27]">
            <p className="text-[1.75rem] sm:text-[2.5rem] font-medium">15s</p>
          </div>
          <Button
            className="bg-[#30A1E2] h-14 w-72 mt-8 block mx-auto text-base font-bold"
            radius={'xl'}
            onClick={() => {
              router.push('/reading-writing');
            }}
          >
            Tiếp tục vào phần nghe và viết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmitListen;

