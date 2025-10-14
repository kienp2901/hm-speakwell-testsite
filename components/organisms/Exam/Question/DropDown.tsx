/* eslint-disable prefer-const */
import React, { useEffect, useMemo, useState } from 'react';
import MathJaxRender from '@/components/sharedV2/MathJax';
import { Divider, Select } from '@mantine/core';
import { getIndexQuestion, getIndexQuestion2, getListUserAnswer } from '@/utils';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ListUserAnswer } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { postExamPartSave } from '@/service/api/examConfig';
import { useRouter } from 'next/router';

interface DropDownProps {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType?: number;
}

const DropDown = ({
  question,
  indexQuestion,
  type,
  data,
  page,
  listDataResult,
  idHistoryRound,
  contestType = 0,
}: DropDownProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = router.asPath;
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual);
  const [content, setContent] = useState<string>('');
  const { listQuestionChildren } = question;
  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data]);

  const changeAnswerFill = async () => {
    const dataFill = [];
    for (let i = 0; i < question?.listQuestionChildren?.length; i++) {
      const ele = document.getElementById(
        `dropdown-${question.idChildQuestion}-${listQuestionChildren[i].idChildQuestion}`,
      ) as HTMLInputElement;
      let item = null;

      if (question.listQuestionChildren[i].quiz_type === 1) {
        item = {
          idChildQuestion: question.listQuestionChildren[i].idChildQuestion,
          answer: ele.value && [Number(ele.value)],
        };
      } else {
        const indexAnswer = question.listQuestionChildren[
          i
        ].listSelectOptions?.findIndex(
          (it: any) => it.answer_id === Number(ele.value),
        );

        item = {
          idChildQuestion: question.listQuestionChildren[i].idChildQuestion,
          answer:
            question.listQuestionChildren[i].listSelectOptions[indexAnswer]
              ?.answer_content || '',
          value:
            indexAnswer !== -1
              ? [
                  Number(
                    question.listQuestionChildren[i].listSelectOptions[
                      indexAnswer
                    ]?.answer_id,
                  ),
                ]
              : '',
        };
      }

      dataFill.push(item);
    }

    let listUserAnswer = getListUserAnswer(
      listUserAnswerState,
      data,
      page,
      question,
      dataFill,
    );
    dispatch(setListUserAnswer(listUserAnswer));

    const response = await postExamPartSave({
      contest_type: contestType,
      idHistory: idHistoryRound,
      listUserAnswer: [...listUserAnswer],
    });
  };

  const checkUserAnswer = (idChildQuestion: any) => {
    if (type === 'answer-detail') {
      const index = listDataResult.findIndex(
        (item: any) => item.idChildQuestion === idChildQuestion,
      );
      if (index === -1) {
        return false;
      } else {
        return listDataResult[index].isTrue;
      }
    }
  };

  const renderUserAnswer = (item: any) => {
    if (type === 'answer-detail') {
      const index = listDataResult.findIndex(
        (i: any) => i.idChildQuestion === item.idChildQuestion,
      );
      if (listDataResult[index]?.answer && index !== -1) {
        if (item?.quiz_type === 1) {
          const answer = Number(listDataResult[index]?.answer[0]);
          return `
          <option selected value=${answer}>${
            item.listSelectOptions.find((it: any) => it.answer_id === answer)
              .answer_content
          }</option>`;
        } else {
          return `
          <option selected value=${Number(listDataResult[index].value[0])}>${
            listDataResult[index]?.answer
          }</option>`;
        }
      }
      return `
      <option selected></option>`;
    }
  };

  useEffect(() => {
    let indexInputFill = indexFillQues;
    let contentQuestion = `${question?.text}`;
    const regex = /___/gi;
    let result;
    const indices = [];
    while ((result = regex.exec(question?.text))) {
      indices.push(result.index);
    }

    indices.map((item: any, index: any) => {
      if (listQuestionChildren[index] !== undefined) {
        contentQuestion = contentQuestion.replace(
          '___',
          `${
            type === 'answer-detail'
              ? `
              ${
                pathname.includes('exercise')
                  ? ''
                  : `<span class="bg-ct-secondary-100 w-8 h-8 select-none inline-flex justify-center items-center rounded-full text-sm text-ct-secondary-500" id='question-${
                      indexInputFill + 1
                    }'>
                ${indexInputFill + 1}
              </span>`
              }
              <select disabled id='dropdown-${question.idChildQuestion}-${
                  listQuestionChildren[index]?.idChildQuestion
                }' class="dropdown-select rounded border min-w-[200px] max-w-[300px] py-[6px] px-2 pr-10 mx-2 my-2 focus:outline-none ${
                  checkUserAnswer(listQuestionChildren[index]?.idChildQuestion)
                    ? 'text-ct-true'
                    : 'text-ct-fail'
                }">

                ${renderUserAnswer(listQuestionChildren[index])}
              
              </select>
              `
              : `
              ${
                pathname.includes('exercise')
                  ? ''
                  : `<span class="bg-ct-secondary-100 w-8 h-8 select-none inline-flex justify-center items-center rounded-full text-sm text-ct-secondary-500" id='question-${
                      indexInputFill + 1
                    }'>
                ${indexInputFill + 1}
              </span>`
              }
              <select id='dropdown-${question.idChildQuestion}-${
                  listQuestionChildren[index]?.idChildQuestion
                }' class="dropdown-select rounded border min-w-[200px] max-w-[300px] py-[5px] px-2 pr-10 mx-2 my-2 text-[#000] focus:outline-none">
          <option value="" disabled selected hidden>Select your option</option>
          ${listQuestionChildren[index].listSelectOptions.map((item: any) => {
            return `<option key=${item.answer_id} value=${item.answer_id}>${item.answer_content}</option>`;
          })}
        </select>`
          }`,
        );
        indexInputFill++;
      }
    });
    setContent(contentQuestion);
  }, [listDataResult, question, type]);

  useEffect(() => {
    const index = listUserAnswerState.findIndex(
      (i: any) => i.idQuestion === data[page - 1].idQuestion,
    );
    if (index !== -1) {
      const indexQues = listUserAnswerState[index]?.answer?.findIndex(
        (i: any) => i.idChildQuestion === question.idChildQuestion,
      );
      if (indexQues !== -1) {
        listUserAnswerState[index]?.answer[indexQues].answer.map(
          (item: any) => {
            if (item.answer !== '') {
              const element = document.getElementById(
                `dropdown-${question.idChildQuestion}-${item.idChildQuestion}`,
              ) as any;

              if (element !== null) {
                if (typeof item.answer === 'string') {
                  element.value = item.value;
                } else {
                  element.value = item.answer;
                }
              }
            }
          },
        );
      }
    }
  }, [content, listUserAnswerState]);

  return (
    <div className={`mt-4 `}>
      <p>
        <MathJaxRender math={`${question?.description}`} />
      </p>
      <div className="flex items-baseline">
        <div className="flex items-start" onInput={changeAnswerFill}>
          {pathname.includes('exercise') ? (
            <span className=" bg-ct-secondary-100 w-6 h-6 inline-flex flex-shrink-0 justify-center items-center rounded-full text-sm text-ct-secondary-500 mr-2">
              {getIndexQuestion2(
                data,
                page,
                question.idChildQuestion || question.idQuestion,
              )}
            </span>
          ) : (
            ''
          )}
          <MathJaxRender math={`${content}`} />
        </div>
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
        <div>
          <Divider className="border-ct-neutral-300" my="sm" />
          {question.listQuestionChildren.map((item: any, index: any) => (
            <div
              key={item.idChildQuestion}
              className={`flex items-center mt-2 ${
                checkUserAnswer(listQuestionChildren[index]?.idChildQuestion) &&
                'hidden'
              }`}
            >
              <span className="bg-ct-primary-400 w-8 h-8 inline-flex justify-center items-center rounded-full text-sm text-white">
                {indexFillQues + index + 1}
              </span>
              <p className="ml-2">
                Answer:{' '}
                <span className="text-ct-true">
                  {listQuestionChildren[index]?.listSelectOptions?.find(
                    (i: any) => i.is_true,
                  )?.answer_content || ''}
                </span>
              </p>
            </div>
          ))}
          <div className="bg-white mt-2 sm:mt-3 rounded-2xl px-[6px] sm:px-3 py-2 sm:py-[10px]">
            <span className="text-ct-primary-400">Explain</span>
            <p
              dangerouslySetInnerHTML={{
                __html: question.solution || 'no data',
              }}
            ></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
