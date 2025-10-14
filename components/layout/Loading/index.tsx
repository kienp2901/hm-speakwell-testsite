import { Player } from '@lottiefiles/react-lottie-player';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <>
      <Player
        src="https://assets4.lottiefiles.com/packages/lf20_YMim6w.json"
        background="transparent"
        style={{ height: '300px', width: '300px' }}
        loop
        autoplay
      ></Player>
    </>
  );
};

export default Loading;

