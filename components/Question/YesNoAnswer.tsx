import { Button } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { examSaveApi } from '@/service/api/contest';
import { IdHistory, ListUserAnswer, StudentId } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { QuestionData } from '@/types/question';

interface YesNoAnswerProps {
  question: QuestionData;
}

const YesNoAnswer: React.FC<YesNoAnswerProps> = ({ question }) => {
  const listUserAnswer = useAppSelector(ListUserAnswer, shallowEqual);
  const studentId = useAppSelector(StudentId, shallowEqual);
  const idHistory = useAppSelector(IdHistory, shallowEqual);

  const dispatch = useAppDispatch();
  const [value, setValue] = useState<string | number | undefined>();

  useEffect(() => {
    const answerDraft = listUserAnswer?.find(
      (item) => item?.idQuestion == question?.idQuestion,
    );
    if (answerDraft) {
      const answerChild = answerDraft?.answer?.find(
        (answerChild: any) =>
          answerChild?.idChildQuestion == question?.idChildQuestion,
      );
      if (question?.idChildQuestion) {
        if (answerChild) {
          setValue(answerChild?.answer[0]);
        }
      } else {
        setValue(answerDraft?.answer[0]);
      }
    }
  }, [listUserAnswer, question?.idChildQuestion, question?.idQuestion]);

  const handleSelectOption = async (answerId: string | number) => {
    const listUserAnswerTemp = {
      idQuestion: question?.idQuestion,
      quiz_type: question?.quiz_type,
      answer: [Number(answerId)],
    };
    setValue(answerId);

    const response = await examSaveApi(studentId, {
      idHistory: idHistory,
      listUserAnswer: [listUserAnswerTemp],
    });
    const dataFilter = listUserAnswer.filter(
      (item) => item?.idQuestion != listUserAnswerTemp?.idQuestion,
    );
    dispatch(setListUserAnswer([listUserAnswerTemp, ...dataFilter]));
  };

  return (
    <div className="h-full">
      <img
        className=" w-40 h-40 md:w-64 md:h-64 block mx-auto"
        src={question?.image}
        alt=""
      />
      <p
        className="font-medium text-center mt-4"
        dangerouslySetInnerHTML={{
          __html: question.text || '',
        }}
      ></p>
      <div className="flex items-center justify-center gap-6 mt-2">
        {question.listSelectOptions?.map((item, index) => (
          <Button
            key={index}
            className={`h-14 w-40 text-lg font-bold ${
              value === item.answer_id
                ? item.answer_content === 'Đúng'
                  ? 'bg-[#3BC44E] hover:bg-[#3BC44E] text-white'
                  : 'bg-[#FA4136] hover:bg-[#FA4136] text-white'
                : 'text-neutral border-2 border-neutral hover:bg-transparent'
            }`}
            radius={'xl'}
            leftIcon={
              item.answer_content === 'Đúng' ? (
                value === item.answer_id ? (
                  <img alt="" src="/images/icon-true-choice.svg" />
                ) : (
                  <img alt="" src="/images/icon-true.svg" />
                )
              ) : value === item.answer_id ? (
                <img alt="" src="/images/icon-false-choice.svg" />
              ) : (
                <img alt="" src="/images/icon-false.svg" />
              )
            }
            onClick={() => handleSelectOption(item.answer_id)}
          >
            {item.answer_content == 'Đúng' ? 'Yes' : 'No'}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default YesNoAnswer;

