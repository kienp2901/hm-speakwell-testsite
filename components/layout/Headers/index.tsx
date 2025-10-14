import React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setIsModalInfo } from '@/store/slice/examInfo';

interface HeaderProps {
  rightComponent?: () => React.ReactElement | null;
}

const Header: React.FC<HeaderProps> = ({ rightComponent }) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className="h-[48px] w-full sm:h-14 lg:h-16 bg-white py-2 px-4"
      style={{
        boxShadow: '0px 4px 8px 0px #15436F1A',
      }}
    >
      <div className="max-w-[1200px] h-full mx-auto flex items-center justify-center sm:justify-start">
        <img
          className="hidden md:block w-48 h-8 mb-3"
          src="/images/icanconnect_logo.png"
          alt=""
        />
        <div className="flex flex-1 md:ml-4 items-end justify-start">
          <h1 className="font-bold text-base  sm:text-xl lg:text-2xl text-primary uppercase">
            Speakwell placement test
          </h1>
        </div>

        {!location.pathname.includes('result') && (
          <img
            className="md:hidden cursor-pointer"
            src="/images/icon-info.svg"
            alt=""
            onClick={() => {
              dispatch(setIsModalInfo(true));
            }}
          />
        )}
        {rightComponent && rightComponent()}
      </div>
    </div>
  );
};

export default Header;

