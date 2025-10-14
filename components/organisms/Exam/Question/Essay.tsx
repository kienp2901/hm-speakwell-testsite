'use client';
import { Collapse, Divider, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ArrowDown2, Information } from 'iconsax-react';
import { postExamPartSave } from '@/service/api/examConfig';
import { ListUserAnswer } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import MathJaxRender from '@/components/sharedV2/MathJax';
import { getIndexQuestion, getIndexQuestion2, getListUserAnswer } from '@/utils';
import { useRouter } from 'next/router';
import { set } from 'lodash';
import { listTabAIWriting } from '@/enum';

interface EssayProps {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType?: number;
}

const Essay = ({
  question,
  indexQuestion,
  type,
  data,
  page,
  idHistoryRound,
  contestType = 0,
  listDataResult,
}: EssayProps) => {
  const router = useRouter();
  const pathname = router.asPath;

  const dispatch = useDispatch();
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual);

  // const listUserAnswerExamState = useSelector(ListUserAnswerExam, shallowEqual);

  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data, page]);

  const [userAnswer, setUserAnswer] = useState<string>('');
  const [selectReview, setSelectReview] = useState(0);
  const [dataResultAI, setDataResultAI] = useState<any>([]);

  const [opened, { toggle }] = useDisclosure(false);

  const saveQuestion = async (answer: string) => {
    const listUserAnswer = getListUserAnswer(
      listUserAnswerState,
      data,
      page,
      question,
      answer,
    );
    dispatch(setListUserAnswer(listUserAnswer));
    await postExamPartSave({
      contest_type: contestType,
      idHistory: idHistoryRound,
      listUserAnswer: [...listUserAnswer],
    });
  };

  useEffect(() => {
    const index = listUserAnswerState.findIndex(
      (i: any) => i.idQuestion === data[page - 1].idQuestion,
    );

    if (index !== -1) {
      if (data[page - 1].quizType !== 6) {
        const element = document.getElementById(
          `fillblank-${question?.idQuestion}-${question?.idChildQuestion}`,
        ) as any;
        if (element !== null) {
          element.value = listUserAnswerState[index]?.answer;
        }
      } else {
        const indexQues = listUserAnswerState[index]?.answer?.findIndex(
          (i: any) => i.idChildQuestion === question.idChildQuestion,
        );
        if (indexQues !== -1) {
          const element = document.getElementById(
            `fillblank-${question?.idQuestion}-${question?.idChildQuestion}`,
          ) as any;

          if (element !== null) {
            element.value =
              listUserAnswerState[index]?.answer[indexQues].answer;
          }
        }
      }
    }
  }, [data, listUserAnswerState]);

  useEffect(() => {
    if (type === 'answer-detail') {
      const index = listDataResult.findIndex(
        (i: any) => i.idQuestion === data[page - 1].idQuestion,
      );

      if (index !== -1) {
        if (data[page - 1].quizType !== 6) {
          setDataResultAI(listDataResult[index]?.externalGradingDetail);
          setUserAnswer(listDataResult[index]?.userAnswer || '');
        } else {
          const indexQues = listDataResult[index]?.answer?.findIndex(
            (i: any) => i.idChildQuestion === question.idChildQuestion,
          );
          if (indexQues !== -1) {
            setUserAnswer(
              listDataResult[index]?.userAnswer[indexQues].answer || '',
            );
            setDataResultAI(
              listDataResult[index]?.userAnswer[indexQues]
                ?.externalGradingDetail,
            );
          }
        }
      }
    }
  }, [listDataResult, data]);

  const convertTextToHtml = (text: string) => {
    const html = text
      ?.split('\n')
      .map(line => {
        if (line.startsWith('## ')) {
          return `<h2>${line.substring(3)}</h2>`;
        } else if (line.startsWith('* ')) {
          return `<ul><li>${line.substring(2)}</li></ul>`;
        } else if (line.startsWith('    * ')) {
          return `<li>${line.substring(6)}</li>`;
        } else {
          return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}</p>`;
        }
      })
      .join('');
    return html;
  };

  return (
    <div className="mt-4">
      <div className="flex items-baseline">
        {pathname.includes('exercise') ? (
          <span className=" bg-ct-secondary-100 w-6 h-6 inline-flex flex-shrink-0 justify-center items-center rounded-full text-sm text-ct-secondary-500 mt-1 mr-2">
            {getIndexQuestion2(
              data,
              page,
              question.idChildQuestion || question.idQuestion,
            )}
          </span>
        ) : (
          <div
            className="bg-ct-secondary-100 flex h-8 w-8 select-none items-center justify-center rounded-full text-sm text-ct-secondary-500"
            id={`question-${indexFillQues + 1}`}
          >
            {`${indexFillQues + 1}`}
          </div>
        )}
        <div className="ml-2 flex-1">
          <MathJaxRender
            math={`${question?.text?.replaceAll('&nbsp;', ' ')}`}
          />
        </div>
      </div>

      <div className="mt-0">
        {question?.image && (
          <img
            className="mt-4 size-fit max-h-[512px] max-w-lg object-cover"
            src={question?.image}
            alt=""
          />
        )}
        {question?.audio && (
          <audio className="mt-4" src={question?.audio} controls />
        )}
        {question?.video && (
          <video className="mt-4" src={question?.video} controls />
        )}
      </div>

      {!(type === 'answer-detail') ? (
        <Textarea
          onChange={event => saveQuestion(event.currentTarget.value)}
          id={`fillblank-${question.idQuestion}-${question.idChildQuestion}`}
          placeholder="Type answer here"
          className="mt-2"
          minRows={5}
          maxRows={10}
        />
      ) : (
        <div>
          <div className="rounded-2xl border bg-white mt-4 px-[6px] py-2 sm:px-3 sm:py-[10px]">
            <p
              dangerouslySetInnerHTML={{
                __html: convertTextToHtml(userAnswer || 'no data'),
              }}
            />
          </div>
          <div className="mt-4 w-ful">
            <div className="rounded-2xl border inline-block bg-white px-[6px] py-2 sm:px-3 sm:py-[10px]">
              <p className="text-ct-secondary-600 text-base font-normal">
                IELTS score
                <span className="text-ct-primary-400 text-2xl font-bold ml-6">
                  {' '}
                  {dataResultAI?.score || 0}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-2 rounded-2xl border bg-white px-[6px] py-2 sm:mt-3 sm:px-3 sm:py-[10px]">
            <div
              onClick={toggle}
              className={`flex items-center justify-between ${
                opened && 'mb-2'
              } cursor-pointer`}
            >
              <div className="flex items-center">
                <Information size="15" color="#1294F2" variant="Bold" />
                <span className="text-ct-primary-400 ml-1">Explain</span>
              </div>
              <ArrowDown2
                className={`${opened && 'rotate-180'}`}
                size="24"
                color="#000"
                variant="Bold"
              />
            </div>
            <Collapse in={opened}>
              <div className="relative my-4 w-full">
                <div className=" relative w-[100% ] flex flex-wrap sm:flex-nowrap overflow-x-auto gap-2">
                  {listTabAIWriting.map((item, indexReview) => {
                    return (
                      <div
                        onClick={() => setSelectReview(indexReview)}
                        key={`review-${item.key}`}
                        className={`cursor-pointer flex flex-shrink-0 items-center px-4 py-2 rounded-xl ${
                          selectReview == indexReview
                            ? 'bg-ct-primary-500'
                            : 'bg-neutral-200'
                        }`}
                      >
                        <p
                          className={`${
                            selectReview == indexReview
                              ? 'text-base font-medium text-white'
                              : 'text-sm font-medium text-neutral-500'
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: item.title,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                {dataResultAI?.content?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-[#7893B0] p-4 mt-4">
                    {selectReview == 0 ? (
                      <div className="mt-4 border border-[#7893B0] p-4 rounded-2xl">
                        <p
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: convertTextToHtml(
                              dataResultAI?.content?.find(
                                (item: any) =>
                                  Number(item.part_number) == selectReview + 1,
                              )?.data?.comment,
                            ),
                          }}
                        ></p>
                      </div>
                    ) : selectReview == 5 ? (
                      <p
                        className={`${'text-base text-black'}`}
                        dangerouslySetInnerHTML={{
                          __html: dataResultAI?.content?.find(
                            (item: any) =>
                              Number(item.part_number) == selectReview + 1,
                          )?.data?.comment?.revised_essay,
                        }}
                      />
                    ) : selectReview == 6 ? (
                      <p
                        className="text-justify answer-table"
                        dangerouslySetInnerHTML={{
                          __html: question?.solution,
                        }}
                      />
                    ) : (
                      <div>
                        <span className="text-base text-black font-semibold">
                          Score:{' '}
                          <span className="text-base font-normal text-black">
                            {
                              dataResultAI?.content?.find(
                                (item: any) =>
                                  Number(item.part_number) == selectReview + 1,
                              )?.data?.score
                            }
                          </span>
                        </span>
                        <p />
                        <span className="text-base text-black font-semibold">
                          Comment:&nbsp;
                          <span
                            className={`${'text-base font-normal text-black'}`}
                            dangerouslySetInnerHTML={{
                              __html: dataResultAI?.content?.find(
                                (item: any) =>
                                  Number(item.part_number) == selectReview + 1,
                              )?.data?.comment?.comment,
                            }}
                          />
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Collapse>
          </div>
        </div>
      )}
    </div>
  );
};

export default Essay;
