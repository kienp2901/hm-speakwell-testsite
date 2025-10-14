/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
/* eslint-disable no-nested-ternary */
import { Radio } from '@mantine/core';
import MathJaxRender from '@/components/sharedV2/MathJax';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { postExamPartSave } from '@/service/api/examConfig';
import { CursorCustom, FontSize, ListUserAnswer } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import {
  getCursorClass,
  getFontSize,
  getIndexQuestion,
  getListUserAnswer,
} from '@/utils';

interface MultiChoiceOneRightProps {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType?: number;
}

const MultiChoiceOneRight = ({
  question,
  indexQuestion,
  type,
  data,
  page,
  listDataResult,
  idHistoryRound,
  contestType = 0
}: MultiChoiceOneRightProps) => {
  const fontSize = useSelector(FontSize, shallowEqual) || 16;
  const cursorCustom = useSelector(CursorCustom, shallowEqual) || 0;
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual);
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>('');
  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data]);

  const handleChange = async (value: any) => {
    setValue(value);
    let listUserAnswer = getListUserAnswer(
      listUserAnswerState,
      data,
      page,
      question,
      [Number(value)],
    );
    dispatch(setListUserAnswer(listUserAnswer));

    const response = await postExamPartSave({
      contest_type: contestType,
      idHistory: idHistoryRound,
      listUserAnswer: [...listUserAnswer],
    });
  };

  const checkUserAnswer = (item: any) => {
    if (type === 'answer-detail') {
      const index = listDataResult.findIndex(
        (i: any) => i.idChildQuestion === question?.idChildQuestion,
      );
      if (index === -1) {
        return false;
      } else {
        if (listDataResult[index].answer[0] === item.answer_id) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  useEffect(() => {
    const index = listUserAnswerState.findIndex(
      (i: any) => i.idQuestion === data[page - 1].idQuestion,
    );
    if (index !== -1) {
      const indexQues = listUserAnswerState[index]?.answer?.findIndex(
        (i: any) => i.idChildQuestion === question.idChildQuestion,
      );
      if (indexQues !== -1) {
        setValue(`${listUserAnswerState[index]?.answer[indexQues].answer[0]}`);
      }
    }
  }, [question, listUserAnswerState]);

  return (
    <div className={`mt-4`}>
      {question?.description && (
        <p className="mt-4">
          <MathJaxRender math={`${question?.description}`} />
        </p>
      )}

      <div className="flex items-baseline">
        <div
          className="bg-ct-secondary-100 w-8 h-8 flex justify-center items-center rounded-full text-sm text-ct-secondary-500 select-none"
          id={`question-${indexFillQues + 1}`}
        >
          {indexFillQues + 1}
        </div>
        <div className="flex-1 ml-2">
          <MathJaxRender
            math={`${question?.text?.replaceAll('&nbsp;', ' ')}`}
          />
        </div>
      </div>
      <div className="ml-4">
        {type === 'answer-detail' ? (
          <>
            {question.listSelectOptions.map((item: any, index: any) => (
              <Radio
                label={<MathJaxRender math={`${item?.answer_content}`} />}
                checked={item.is_true || checkUserAnswer(item)}
                onChange={() => {}}
                key={index}
                className="mt-3"
                classNames={{
                  body: 'items-center',
                  radio: 'bg-transparent border-ct-neutral-700',
                  label: `${getFontSize(fontSize)} ${getCursorClass(
                    cursorCustom,
                  )} ${
                    item.is_true
                      ? 'text-ct-true'
                      : checkUserAnswer(item)
                      ? 'text-ct-fail'
                      : ''
                  }`,
                  inner: 'self-center',
                }}
                styles={() => ({
                  radio: {
                    ':checked': {
                      borderColor: `${
                        item.is_true
                          ? '#009521'
                          : checkUserAnswer(item)
                          ? '#FF2323'
                          : '#0056A4'
                      }`,
                      backgroundColor: 'transparent',
                    },
                  },
                  icon: {
                    color: `${
                      item.is_true
                        ? '#009521'
                        : checkUserAnswer(item)
                        ? '#FF2323'
                        : '#0056A4'
                    }`,
                    width: '12px',
                    height: '12px',
                    top: 'calc(50% - 6px)',
                    left: 'calc(50% - 6px)',
                  },
                })}
              />
            ))}
          </>
        ) : (
          <Radio.Group
            value={value}
            onChange={handleChange}
            orientation="vertical"
            spacing="sm"
            offset="md"
          >
            {question.listSelectOptions.map((item: any, index: any) => (
              <Radio
                value={`${item.answer_id}`}
                label={<MathJaxRender math={`${item?.answer_content}`} />}
                key={index}
                classNames={{
                  body: 'items-center border rounded-lg p-2 ',
                  radio: 'bg-transparent border-ct-neutral-700',
                  label: `${getFontSize(fontSize)} ${getCursorClass(
                    cursorCustom,
                  )}`,
                  inner: 'self-center',
                }}
                styles={() => ({
                  radio: {
                    ':checked': {
                      borderColor: '#0056A4',
                      backgroundColor: 'transparent',
                    },
                  },
                  icon: {
                    color: '#0056A4',
                    width: '12px',
                    height: '12px',
                    top: 'calc(50% - 6px)',
                    left: 'calc(50% - 6px)',
                  },
                })}
              />
            ))}
          </Radio.Group>
        )}
      </div>
      <div className="mt-0">
        {question?.image && (
          <img
            className="mt-4 w-fit h-fit object-cover max-w-lg max-h-[512px]"
            src={question?.image}
            alt=""
          />
        )}
        {question?.audio && (
          <audio className="mt-4" src={question?.audio} controls></audio>
        )}
        {question?.video && (
          <video className="mt-4" src={question?.video} controls></video>
        )}
      </div>
      {type === 'answer-detail' && (
        <div className="bg-white mt-2 sm:mt-3 rounded-2xl px-[6px] sm:px-3 py-2 sm:py-[10px]">
          <span className="text-ct-primary-400">Explain</span>
          <p
            dangerouslySetInnerHTML={{ __html: question.solution || 'no data' }}
          ></p>
        </div>
      )}
    </div>
  );
};

export default MultiChoiceOneRight;
