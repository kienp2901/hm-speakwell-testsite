/* eslint-disable import/order */
/* eslint-disable camelcase */
import { PlayCircle } from 'iconsax-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import TestAudio from '../TestAudio';

interface InterviewProps {
  listQuestion: any;
  listAudioAnswer: any;
}

const Interview = ({ listQuestion, listAudioAnswer }: InterviewProps) => {
  const [srcAudio, setSrcAudio] = useState<any>(null);
  const [idAnswer, setIdAnswer] = useState();

  const durationTime = (duration: number) => {
    const minute = Math.floor(duration / 60);
    const second = duration % 60;
    if (minute < 1) {
      return `00:${second > 9 ? second : `0${second}`}`;
    } else {
      return `${minute > 9 ? minute : `0${minute}`}:${
        second > 9 ? second : `0${second}`
      }`;
    }
  };

  useEffect(() => {
    if (listQuestion.length > 0) {
      setIdAnswer(listQuestion[0]?.idQuestion);
    }
  }, [listQuestion]);

  useEffect(() => {
    const audioCurrent = listAudioAnswer.findIndex(
      (item: any) => item.idQuestion == idAnswer,
    );

    setSrcAudio(listAudioAnswer[audioCurrent]);
    // setSrcAudio(data[Math.floor(Math.random() * 4)].audio);
  }, [idAnswer, listAudioAnswer]);

  const onSelectAudio = (itemAnswer: any) => {
    setIdAnswer(itemAnswer.idQuestion);
  };

  return (
    <div className="flex justify-center flex-col items-center py-4">
      {srcAudio ? (
        <div className="w-full sm:px-4">
          <TestAudio
            srcAudio={String(srcAudio?.filepath)}
            isStart={false}
            type="answer-detail"
          />
        </div>
      ) : (
        <div className=" text-center text-[red] text-xl">No answer</div>
      )}
      <div className="mt-4 w-full sm:w-5/6 lg:w-3/4 cursor-pointer">
        {listQuestion.map((item: any) => (
          <div
            key={item.idQuestion}
            className={`p-[10px] flex items-center justify-between ${
              idAnswer === item.idQuestion &&
              'bg-ct-primary-400 rounded-lg text-white'
            }`}
            onClick={() => onSelectAudio(item)}
          >
            <div className="flex">
              <PlayCircle size="24" color="#ffffff" variant="Bold" />
              <div
                className="ml-3"
                dangerouslySetInnerHTML={{
                  __html: item.text
                    .split('#000000')
                    .join(idAnswer === item.idQuestion ? '#fff' : '#000000'),
                }}
              ></div>
            </div>
            <span className="ml-2 sm:ml-4">
              {durationTime(
                listAudioAnswer.find(
                  (itemAnswer: any) => itemAnswer.idQuestion == item.idQuestion,
                )?.duration ?? 0,
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Interview);
