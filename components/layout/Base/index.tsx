import React, { ReactNode } from 'react';
import Header from '../Headers';

interface BaseLayoutProps {
  children: ReactNode;
  rightComponent?: () => React.ReactElement | null;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, rightComponent }) => {
  return (
    <main className="bg_container w-screen h-auto min-h-screen sm:h-screen">
      <div className="star-field w-screen h-auto min-h-screen sm:h-screen flex flex-col items-center justify-center ">
        <div className="layer"></div>
        <div className="layer"></div>
        <div className="layer"></div>
        <div className="flex w-full h-auto min-h-screen sm:h-screen justify-center items-center">
          <div className="w-full h-full min-h-screen sm:h-screen flex flex-col flex-1 ">
            <Header rightComponent={rightComponent} />
            <div className="w-full max-w-[1200px] h-full flex flex-1 mx-auto items-center justify-center">
              <div className="w-full mt-4 h-full flex flex-col sm:px-4">
                {children}
              </div>
            </div>
            <p className=" text-white text-center my-3">
              Copyright 2024 © GalaxyEdu.vn
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BaseLayout;

