/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { useEffect, useMemo, useState } from 'react';
import MathJaxRender from '@/components/sharedV2/MathJax';
import {
  getCursorClass,
  getFontSize,
  getIndexQuestion,
  getListUserAnswer,
} from '@/utils';
import { Checkbox } from '@mantine/core';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { CursorCustom, FontSize, ListUserAnswer } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { postExamPartSave } from '@/service/api/examConfig';

interface MultiChoiceMultiRightProps {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType?: number;
}

const MultiChoiceMultiRight = ({
  question,
  indexQuestion,
  type,
  data,
  page,
  listDataResult,
  idHistoryRound,
  contestType = 0,
}: MultiChoiceMultiRightProps) => {
  const fontSize = useSelector(FontSize, shallowEqual) || 16;
  const cursorCustom = useSelector(CursorCustom, shallowEqual) || 0;
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual);
  const dispatch = useDispatch();

  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data]);
  const [value, setValue] = useState<string[]>([]);
  const [disabledCheckbox, setDisabledCheckbox] = useState<boolean>(false);

  const handleChange = async (value: any) => {
    setValue(value);
    let dataChoice: any[] = [];
    dataChoice = value.map((item: any) => Number(item));
    let listUserAnswer = getListUserAnswer(
      listUserAnswerState,
      data,
      page,
      question,
      dataChoice,
    );
    dispatch(setListUserAnswer(listUserAnswer));

    await postExamPartSave({
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
        const indexAnswer = listDataResult[index].answer.findIndex(
          (it: any) => it === item.answer_id,
        );
        if (indexAnswer !== -1) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  useEffect(() => {
    if (value?.length === question?.maxAnswerChoice) {
      setDisabledCheckbox(true);
    } else {
      setDisabledCheckbox(false);
    }
  }, [value]);

  useEffect(() => {
    const index = listUserAnswerState.findIndex(
      (i: any) => i.idQuestion === data[page - 1].idQuestion,
    );
    if (index !== -1) {
      const indexQues = listUserAnswerState[index]?.answer?.findIndex(
        (i: any) => i.idChildQuestion === question.idChildQuestion,
      );
      if (indexQues !== -1) {
        let arrUserAnswer = listUserAnswerState[index]?.answer[
          indexQues
        ].answer.map((item: any) => item.toString());
        setValue(arrUserAnswer);
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
          className="bg-ct-secondary-100 w-12 h-8 flex justify-center items-center rounded-full text-sm text-ct-secondary-500 select-none"
          id={`question-${indexFillQues + 1}`}
        >
          {`${indexFillQues + 1}-${
            indexFillQues + question?.maxAnswerChoice || indexFillQues + 2
          }`}
        </div>
        <div className="flex-1 ml-2">
          <MathJaxRender
            math={`${question?.text?.replaceAll('&nbsp;', ' ')}`}
          />
        </div>
      </div>
      <div className="ml-4">
        {type === 'answer-detail' ? (
          question.listSelectOptions.map((item: any, index: any) => (
            <>
              <Checkbox
                key={index}
                className="flex mt-2"
                label={<MathJaxRender math={`${item?.answer_content}`} />}
                onChange={() => {}}
                checked={item.is_true || checkUserAnswer(item)}
                classNames={{
                  body: 'items-center',
                  label: `${getFontSize(fontSize)} ${getCursorClass(
                    cursorCustom,
                  )}`,
                  inner: 'self-center',
                  input: 'bg-transparent border-ct-neutral-700',
                }}
                styles={() => ({
                  input: {
                    ':checked': {
                      backgroundColor: `${
                        item.is_true
                          ? '#009521'
                          : checkUserAnswer(item)
                          ? '#FF2323'
                          : '#0056A4'
                      }`,
                      borderColor: `${
                        item.is_true
                          ? '#009521'
                          : checkUserAnswer(item)
                          ? '#FF2323'
                          : '#0056A4'
                      }`,
                    },
                  },
                })}
              />
            </>
          ))
        ) : (
          <Checkbox.Group value={value} onChange={handleChange}>
            <div>
              {question.listSelectOptions.map((item: any, index: any) => (
                <Checkbox
                  key={index}
                  className="flex mb-2"
                  disabled={
                    value.findIndex(
                      (i: any) => Number(i) === item.answer_id,
                    ) === -1 && disabledCheckbox
                  }
                  value={`${item.answer_id}`}
                  label={<MathJaxRender math={`${item?.answer_content}`} />}
                  classNames={{
                    body: 'items-center',
                    label: `${getFontSize(fontSize)} ${getCursorClass(
                      cursorCustom,
                    )}`,
                    inner: 'self-center',
                    input: 'bg-transparent border-ct-neutral-700',
                  }}
                  styles={() => ({
                    input: {
                      ':checked': {
                        backgroundColor: '#0056A4',
                        borderColor: '#0056A4',
                      },
                    },
                  })}
                />
              ))}
            </div>
          </Checkbox.Group>
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

export default MultiChoiceMultiRight;
