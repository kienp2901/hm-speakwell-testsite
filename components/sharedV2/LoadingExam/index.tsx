import { Player } from '@lottiefiles/react-lottie-player';
const submitWritingSuccess = '/images/loadingIelts.json';

const LoadingExam = () => {
  return (
    <>
      <Player
        src={submitWritingSuccess}
        background="transparent"
        // speed={1}
        style={{ height: '100px', width: '100px' }}
        loop
        autoplay
      ></Player>
    </>
  );
};

export default LoadingExam;
