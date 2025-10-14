import CustomAudio from '@/components/layout/CustomAudio';
import React, { memo, useEffect, ReactElement } from 'react';
import FillBlank from './FillBlank';
import { questionEnumType } from '@/ultils/typeQuestion';
import MultiChoiceOneRight from './MultiChoiceOneRight';
import ShortAnswer from './ShortAnswer';
import Image from '@/components/shared/Image';
import { QuestionData } from '@/types/question';

interface ReadingAnswerProps {
  dataQuestion: QuestionData;
  idQuestion: string | number;
  part?: number;
}

const ReadingAnswer: React.FC<ReadingAnswerProps> = ({ dataQuestion, idQuestion, part }) => {
  // render listQuestionChildren
  const getContentQuestion = (data: QuestionData): ReactElement[] => {
    let listItemQuestion: ReactElement[] = [];
    data?.listQuestionChildren?.map((item: any, index: number) => {
      let itemQuestion: ReactElement = <></>;
      switch (item?.quiz_type) {
        case questionEnumType.ONE_RIGHT:
          itemQuestion = (
            <MultiChoiceOneRight
              key={index}
              dataQuestion={item}
              idQuestion={idQuestion}
            />
          );
          break;
        case questionEnumType.FILL_BLANK:
          itemQuestion = (
            <FillBlank
              quizType={6}
              key={index}
              dataQuestion={item}
              idQuestion={idQuestion}
              part={part}
            />
          );
          break;
        case questionEnumType.SHORT:
          itemQuestion = (
            <ShortAnswer
              key={index}
              dataQuestion={item}
              idQuestion={idQuestion}
            />
          );
        default:
          break;
      }
      listItemQuestion.push(itemQuestion);
    });
    return listItemQuestion;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-auto flex-col h-full sm:flex-row gap-6 pb-2 md:pb-12">
      <div className="sm:flex-1 h-full flex-col overflow-y-auto sm:pb-4">
        {dataQuestion?.audio !== '' && (
          <CustomAudio
            quizType={6}
            autoPlay={true}
            srcAudio={dataQuestion?.audio || ''}
          />
        )}
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{
            __html: dataQuestion?.text || '',
          }}
        ></div>
        <div className="flex justify-center items-center mt-4 w-full">
          {dataQuestion?.image && (
            <Image
              height={200}
              width={300}
              loader={() => dataQuestion?.image || ''}
              src={dataQuestion?.image}
              alt="image_one_right_question"
            />
          )}
        </div>
      </div>
      <div className="sm:flex-1 h-full flex-col overflow-y-auto pr-3">
        {getContentQuestion(dataQuestion)}
      </div>
    </div>
  );
};

export default memo(ReadingAnswer);

