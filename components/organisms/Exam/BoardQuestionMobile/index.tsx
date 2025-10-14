import Button from '@/components/sharedV2/Button';
import { questionEnumType } from 'enum';
import { Category, CloseCircle, TaskSquare } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { ListUserAnswer } from 'store/selector';
import { t } from 'i18next';

import ModalAnswer from '../ModalAnswer';

type BoardQuestionMobileProps = {
  onCloseDrawer: () => void;
  listQuestion: any;
  setPage: (page: number) => void;
  contentRef: any;
};

const BoardQuestionMobile = ({
  onCloseDrawer,
  listQuestion,
  setPage,
  contentRef,
}: BoardQuestionMobileProps) => {
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual) || [];

  const [listDataQuestion, setListDataQuestion] = useState<any[]>([]);
  const [indexChildQues, setIndexChildQues] = useState(0);
  const [listDataResult, setListDataResult] = useState<any[]>([]);
  const [isOpenModalAnswer, setIsOpenModalAnswer] = useState(false);

  const handleClickQuestion = (page: number, indexChild: number) => {
    setPage(page + 1);
    setIndexChildQues(indexChild);
  };

  useEffect(() => {
    let arrDataChoice: any[] = [];
    listUserAnswerState.length > 0 &&
      listUserAnswerState?.map((item: any) => {
        item.answer.map((i: any) => {
          if (i.answer[0]?.idChildQuestion) {
            arrDataChoice = [...arrDataChoice, ...i.answer];
          } else {
            arrDataChoice.push(i);
          }
        });
      });

    setListDataResult(arrDataChoice);
  }, [listUserAnswerState]);

  useEffect(() => {
    let arrDataQuestion: any[] = [];
    listQuestion?.map((item: any) => {
      item?.listQuestionChildren.map((i: any) => {
        if (i.quiz_type === questionEnumType.ONE_RIGHT) {
          arrDataQuestion.push(i);
        } else if (i.quiz_type === questionEnumType.MULTIPLE_RIGHT) {
          Array.from({ length: i?.maxAnswerChoice || 1 }).map(() =>
            arrDataQuestion.push(i),
          );
        } else {
          arrDataQuestion = [...arrDataQuestion, ...i.listQuestionChildren];
        }
      });
    });
    setListDataQuestion(arrDataQuestion);
  }, [listQuestion]);

  useEffect(() => {
    if (indexChildQues !== 0) {
      const timer = setTimeout(() => {
        const ele = document.getElementById(`question-${indexChildQues}`);

        if (Number(ele?.offsetTop) > Number(contentRef.current?.offsetHeight)) {
          contentRef.current.scrollTop = Number(ele?.offsetTop) - 200;
        } else if (
          Number(contentRef.current?.scrollTop) >
          Number(contentRef.current?.offsetHeight)
        ) {
          contentRef.current.scrollTop = 0;
        }
      }, 200);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [indexChildQues]);

  useEffect(() => {
    listDataResult.map((item: any) => {
      if (item.answer.length === 0 || item.answer === 'undefined') {
        const eleMobile = document.getElementById(
          `question-mobile-${item.idChildQuestion}`,
        );
        eleMobile?.classList.remove('question-done');
        eleMobile?.classList.add('question-not-done');

        const ele = document.getElementById(`question-${item.idChildQuestion}`);
        ele?.classList.remove('question-done');
        ele?.classList.add('question-not-done');
      } else {
        const eleMobile = document.getElementById(
          `question-mobile-${item.idChildQuestion}`,
        );
        eleMobile?.classList.add('question-done');
        eleMobile?.classList.remove('question-not-done');

        const ele = document.getElementById(`question-${item.idChildQuestion}`);
        ele?.classList.add('question-done');
        ele?.classList.remove('question-not-done');
      }
    });
  }, [listDataResult]);

  return (
    <div className="h-[480px] px-4 pt-1 pb-6 rounded-t-2xl relative overflow-auto">
      <CloseCircle
        size={'26'}
        color="#0067c5"
        variant="Bulk"
        className="absolute cursor-pointer top-1 right-2"
        onClick={() => onCloseDrawer()}
      />
      <div className="flex items-center mt-5">
        <Category size={'18'} color="#000000" variant="Bold" />
        <p className="font-medium ml-2">{t('board_question_mobile.question_palette')}</p>
      </div>
      <div className="flex items-center mt-3">
        <div className="flex items-center text-sm">
          <span className="w-3 h-3 bg-ct-neutral-200 rounded-full mr-2"></span>{' '}
          {t('board_question_mobile.unanswered')}
        </div>
        <div className="flex items-center text-sm ml-4">
          <span className="w-3 h-3 bg-ct-primary-400 rounded-full mr-2"></span>{' '}
          {t('board_question_mobile.answered')}
        </div>
      </div>

      {listQuestion?.length > 0 &&
        listQuestion?.map((item: any, index: any) => {
          let arrDataQuestion: any[] = [];
          item?.listQuestionChildren.map((i: any) => {
            if (
              i.quiz_type === questionEnumType.ONE_RIGHT ||
              i.quiz_type === questionEnumType.MULTIPLE_RIGHT
            ) {
              arrDataQuestion.push(i);
            } else {
              arrDataQuestion = [...arrDataQuestion, ...i.listQuestionChildren];
            }
          });

          return (
            <div className="mt-4" key={index}>
              <p className="flex items-center font-medium">
                {t('board_question_mobile.section')} {index + 1}
              </p>
              <div className="grid gap-x-1 gap-y-2 grid-cols-8 mt-3">
                {arrDataQuestion.map((it: any) => {
                  const indexChild =
                    listDataQuestion.findIndex(
                      (i: any) => i.idChildQuestion === it.idChildQuestion,
                    ) + 1;
                  return (
                    <div
                      className="question-not-done cursor-pointer rounded-3xl py-2 text-center text-xs"
                      id={`question-mobile-${it.idChildQuestion}`}
                      key={it.idChildQuestion}
                      onClick={() => handleClickQuestion(index, indexChild)}
                    >
                      {it.quiz_type === questionEnumType.MULTIPLE_RIGHT
                        ? `${indexChild}-${
                            indexChild - 1 + (it?.maxAnswerChoice || 1)
                          }`
                        : indexChild}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      <Button
        className="text-sm mt-4 font-medium mx-auto"
        onClick={() => setIsOpenModalAnswer(true)}
      >
        <TaskSquare size="20" color="#ffffff" variant="Bold" /> {t('board_question_mobile.review')}
      </Button>

      <ModalAnswer
        isOpen={isOpenModalAnswer}
        onClose={() => setIsOpenModalAnswer(false)}
        listQuestion={listQuestion}
        listDataQuestion={listDataQuestion}
        listDataResult={listDataResult}
      />
    </div>
  );
};

export default BoardQuestionMobile;
