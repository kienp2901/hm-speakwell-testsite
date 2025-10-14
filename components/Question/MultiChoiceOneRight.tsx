import CustomAudio from '@/components/layout/CustomAudio';
import { memo, useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { examSaveApi } from '@/service/api/contest';
import { IdHistory, ListUserAnswer, StudentId } from '@/store/selector';
import {
  setListUserAnswer,
  setListUserAnswerDraft,
} from '@/store/slice/examInfo';
import { AnswerType } from '@/ultils/typeQuestion';
import { QuestionData } from '@/types/question';

interface MultiChoiceOneRightProps {
  dataQuestion: QuestionData;
  idQuestion: string | number;
  isCustom?: boolean;
}

const MultiChoiceOneRight: React.FC<MultiChoiceOneRightProps> = ({ dataQuestion, idQuestion, isCustom }) => {
  const dispatch = useAppDispatch();
  // listUserAnswer store
  const listUserAnswer = useAppSelector(ListUserAnswer, shallowEqual);

  const [value, setValue] = useState<string | number | undefined>();

  const onClickAnswer = async (answer_id: string | number) => {
    let listUserAnswerTemp = [...listUserAnswer];
    const indexUserAnswer = listUserAnswer.findIndex(
      (item) => item.idQuestion === idQuestion,
    );

    if (dataQuestion.idChildQuestion) {
      if (indexUserAnswer === -1) {
        listUserAnswerTemp.push({
          idQuestion: idQuestion,
          quiz_type: dataQuestion?.quiz_type,
          answer: [
            {
              idChildQuestion: dataQuestion.idChildQuestion,
              answer: [answer_id],
            },
          ],
        });
      } else {
        let listUserAnswerChild = [...listUserAnswer[indexUserAnswer].answer];
        const indexUserAnswerChild = listUserAnswer[
          indexUserAnswer
        ].answer.findIndex(
          (item: any) => item.idChildQuestion === dataQuestion.idChildQuestion,
        );
        if (indexUserAnswerChild === -1) {
          listUserAnswerChild.push({
            idChildQuestion: dataQuestion.idChildQuestion,
            answer: [answer_id],
          });
        } else {
          listUserAnswerChild.splice(indexUserAnswerChild, 1, {
            idChildQuestion: dataQuestion.idChildQuestion,
            answer: [answer_id],
          });
        }
        listUserAnswerTemp.splice(indexUserAnswer, 1, {
          idQuestion: idQuestion,
          quiz_type: dataQuestion?.quiz_type,
          answer: [...listUserAnswerChild],
        });
      }
    } else {
      if (indexUserAnswer === -1) {
        listUserAnswerTemp.push({
          quiz_type: dataQuestion?.quiz_type,
          idQuestion: idQuestion,
          answer: [answer_id],
        });
      } else {
        listUserAnswerTemp.splice(indexUserAnswer, 1, {
          quiz_type: dataQuestion?.quiz_type,
          idQuestion: idQuestion,
          answer: [answer_id],
        });
      }
    }

    dispatch(setListUserAnswerDraft(listUserAnswerTemp));
    dispatch(setListUserAnswer(listUserAnswerTemp));
    setValue(answer_id);
  };

  // fill answer đã làm
  useEffect(() => {
    if (listUserAnswer.length > 0) {
      const indexUserAnswer = listUserAnswer.findIndex(
        (item) => item.idQuestion === idQuestion,
      );
      if (dataQuestion.idChildQuestion) {
        if (indexUserAnswer !== -1) {
          const indexUserAnswerChild = listUserAnswer[
            indexUserAnswer
          ].answer.findIndex(
            (item: any) => item.idChildQuestion === dataQuestion.idChildQuestion,
          );
          if (indexUserAnswerChild !== -1) {
            setValue(
              listUserAnswer[indexUserAnswer].answer[indexUserAnswerChild]
                .answer[0],
            );
          }
        }
      } else {
        if (indexUserAnswer !== -1) {
          setValue(listUserAnswer[indexUserAnswer].answer[0]);
        }
      }
    }
  }, []);

  return (
    <div className={`${isCustom ? 'h-full' : ''} pb-22`}>
      {dataQuestion?.audio !== '' && (
        <CustomAudio
          quizType={1}
          autoPlay={true}
          srcAudio={dataQuestion?.audio || ''}
        />
      )}
      {dataQuestion?.answer_type === AnswerType.IMAGE && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 mx-auto w-full">
          {dataQuestion?.listSelectOptions?.map((item, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                key={index}
                src={item.answer_url_image}
                alt=""
                className={`w-32 h-38 rounded-2xl cursor-pointer ${
                  value === item.answer_id &&
                  'outline outline-[3px] outline-offset-4 outline-primary'
                }`}
                onClick={() => onClickAnswer(item.answer_id)}
              />
            </div>
          ))}
        </div>
      )}
      {dataQuestion?.answer_type === AnswerType.TEXT && (
        <div className="p-6 rounded-3xl border-2 border-support_Blue">
          <p dangerouslySetInnerHTML={{ __html: dataQuestion?.text || '' }}></p>
          {dataQuestion?.listSelectOptions?.map((item, index) => (
            <div
              key={index}
              className={`cursor-pointer mt-2 w-full md:w-96 h-12 flex items-center px-4 rounded-lg ${
                value === item.answer_id
                  ? 'border-2 border-[#30A1E2]'
                  : 'border border-[#E0E0E0]'
              }`}
              onClick={() => onClickAnswer(item.answer_id)}
            >
              <p dangerouslySetInnerHTML={{ __html: item?.answer_content }}></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(MultiChoiceOneRight);

