import React, { useEffect, useState } from 'react';
// import Split from 'react-split';
import Split from 'split.js';

export default function MySlpit({ leftContent, rightContent }: any) {
  const [stateWidth, setStateWidth] = useState(window.innerWidth);

  useEffect(() => {
    Split(['#split-0', '#split-1'], {
      minSize: 400,
      gutterSize: 9,
      sizes: [50, 50],
      expandToMin: false,
      cursor: 'col-resize',
    });

    let timerRotate: any;

    window.screen?.orientation?.addEventListener('change', () => {
      timerRotate = setTimeout(() => {
        setStateWidth(window.innerWidth);
      }, 100);
    });

    window.addEventListener('resize', () => {
      setStateWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener('resize', () => {
        setStateWidth(window.innerWidth);
      });
      window.screen?.orientation?.removeEventListener('change', () => {
        timerRotate = setTimeout(() => {
          setStateWidth(window.innerWidth);
        }, 100);
      });
      clearTimeout(timerRotate);
    };
  }, []);

  return (
    // <Split
    //   className="flex h-full"
    //   sizes={[50, 50]}
    //   minSize={[500, 700]}
    //   expandToMin={false}
    //   gutterSize={20}
    //   gutterAlign="center"
    //   snapOffset={30}
    //   dragInterval={1}
    //   cursor="col-resize"
    // >
    //   <div className="bg-[#E2EBF3]">{leftContent()}</div>
    //   <div className="bg-[#FFFFFF]">{rightContent()}</div>
    // </Split>
    <>
      {stateWidth > 1023 ? (
        <div className="flex h-full w-full responsive-desktop">
          <div id="split-0" className="bg-[#F9F9F9]">
            {leftContent()}
          </div>
          <div id="split-1" className="bg-[#F9F9F9]">
            {rightContent()}
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full responsive-mobile">
          <div id="split-0" className="bg-[#F9F9F9] hidden">
            {leftContent()}
          </div>
          <div id="split-1" className="bg-[#F9F9F9]">
            {rightContent()}
          </div>
        </div>
      )}
    </>
  );
}
