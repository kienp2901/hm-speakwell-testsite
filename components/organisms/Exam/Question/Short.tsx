'use client';
import { Collapse, Divider, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ArrowDown2, Information } from 'iconsax-react';
import { postExamPartSave } from '@/service/api/examConfig';
import { ListUserAnswer } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import MathJaxRender from '@/components/sharedV2/MathJax';
import { getIndexQuestion, getIndexQuestion2, getListUserAnswer } from '@/utils';
import { useRouter } from 'next/router';

interface ShortProps {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType?: number;
}

const Short = ({
  question,
  indexQuestion,
  type,
  data,
  page,
  idHistoryRound,
  contestType = 0,
}: ShortProps) => {
  const router = useRouter();
  const pathname = router.asPath;

  const dispatch = useDispatch();
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual);
  // const listUserAnswerExamState = useSelector(ListUserAnswerExam, shallowEqual);

  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data, page]);

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

    // if (pathName.includes("ielts-test-room")) {
    //   if (pathName.includes("placement-test/")) {
    //     await postPlacementTestRoundSaveApi({
    //       idHistory: idHistoryRound,
    //       listUserAnswer: [...listUserAnswer],
    //     });
    //   } else {
    //     await postExamPartSave({
    //       idHistory: idHistoryRound,
    //       listUserAnswer: [...listUserAnswer],
    //     });
    //   }
    // } else {
    //   let newArr = [...listUserAnswerExamState];
    //   let checkExist = newArr.findIndex(
    //     (item: any) => item.idHistory == idHistoryRound
    //   );
    //   if (checkExist == -1) {
    //     newArr.push({
    //       idHistory: idHistoryRound,
    //       listUserAnswer: [...listUserAnswer],
    //     });
    //   } else {
    //     let dataFilter = newArr.filter(
    //       (item) => item.idHistory != idHistoryRound
    //     );
    //     newArr = [
    //       ...dataFilter,
    //       {
    //         idHistory: idHistoryRound,
    //         listUserAnswer: [...listUserAnswer],
    //       },
    //     ];
    //   }
    //   await postExerciesSaveApi({
    //     idHistoryExercise: LocalStorageService.get("IdHistoryExercise"),
    //     listExerciseAnswer: newArr,
    //   });
    // }
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

      <TextInput
        onChange={event => saveQuestion(event.currentTarget.value)}
        id={`fillblank-${question.idQuestion}-${question.idChildQuestion}`}
        placeholder="Fill answer"
        className="mt-2"
        disabled={type === 'answer-detail'}
      />

      {type === 'answer-detail' && (
        <div>
          <Divider className="border-ct-neutral-300" my="sm" />
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
              <p
                dangerouslySetInnerHTML={{
                  __html: question.solution || 'no data',
                }}
              />
            </Collapse>
          </div>
        </div>
      )}
    </div>
  );
};

export default Short;
