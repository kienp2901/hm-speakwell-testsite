import { Player } from '@lottiefiles/react-lottie-player';
import animationLoading from './loading.json';
import Image from 'next/image';

const Loading: React.FC = () => {
  return (
    <div className="bg-[url('/images/bg-board-medium.svg')] md:bg-[url('/images/bg-board-medium.svg')] lg:bg-[url('/images/bg-board-lg.svg')] bg-no-repeat flex flex-1 w-full h-full bg-corver relative overflow-hidden">
      <div className="absolute top-[31%] left-[50%] md:top-[20%] lg:top-[15%] md:left-[50%] translate-y-[-50%] translate-x-[-50%] h-[280px] w-[600px] md:w-[1000px] md:h-[360px] lg:w-[1200px] lg:h-[525px]">
        <Image
          src="/images/board.svg"
          width={'100%'}
          height={'100%'}
          layout="responsive"
          alt=""
        />
      </div>
      <div className="w-[240px] h-[240px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] absolute top-[45%] left-[50%] translate-y-[-50%] translate-x-[-50%]">
        <Player
          src={animationLoading}
          background="transparent"
          style={{
            height: '100%',
            width: '100%',
          }}
          loop
          autoplay
        ></Player>
      </div>
      <p className="text-white whitespace-nowrap absolute top-[54%] left-[50%] lg:top-[64%] lg:left-[52%] translate-y-[-50%] translate-x-[-50%] mt-14 md:mt-24 lg:mt-12">
        Hệ thống đang tạo bài luyện cho bạn...
      </p>
    </div>
  );
};

export default Loading;

