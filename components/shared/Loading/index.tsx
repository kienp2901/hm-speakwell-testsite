import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import defaultLoading from './default-loading.json';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center flex-1">
      <Player
        src={defaultLoading}
        background="transparent"
        style={{
          height: '100px',
          width: '100px',
        }}
        loop
        autoplay
      ></Player>
    </div>
  );
};

export default Loading;

