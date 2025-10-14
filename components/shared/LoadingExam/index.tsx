import { Player } from '@lottiefiles/react-lottie-player';

const LoadingExam = () => {
  return (
    <>
      <Player
        src="/images/loadingIelts.json"
        background="transparent"
        style={{ height: '100px', width: '100px' }}
        loop
        autoplay
      />
    </>
  );
};

export default LoadingExam;

