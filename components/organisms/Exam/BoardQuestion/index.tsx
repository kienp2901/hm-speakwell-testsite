/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
import { Divider, Tooltip } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { CursorType, questionEnumType } from '@/enum';
import {
  Brush2,
  BrushSquare,
  Category,
  Eraser,
  MessageAdd1,
  MessageQuestion,
  MessageText,
  TaskSquare,
  Text,
} from 'iconsax-react';
const arrow_icon = '/images/arrow_icon.svg';
const NoHighlight = '/images/no-highlight.svg';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CursorCustom, FontSize, ListUserAnswer } from '@/store/selector';
import { setCursorCustom, setFontSize } from '@/store/slice/examInfo';
import { t } from 'i18next';

import ModalAnswer from '../ModalAnswer';
import ModalIntruction from '../ModalIntruction';

type BoardQuestionProps = {
  showDrawer: any;
  listQuestion: any;
  setPage: (page: number) => void;
  contentRef: any;
};

const BoardQuestion = ({
  showDrawer,
  listQuestion,
  setPage,
  contentRef,
}: BoardQuestionProps) => {
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual) || [];
  const cursorCustom = useSelector(CursorCustom, shallowEqual) || 0;
  const fontSize = useSelector(FontSize, shallowEqual) || 16;

  const router = useRouter();
  const pathname = router.asPath;
  const dispatch = useDispatch();

  const [isOpenModalAnswer, setIsOpenModalAnswer] = useState(false);
  // const [listGraded, setListGraded] = useState<any>([]);
  // const [listQuestion, setListQuestion] = useState<any>([]);
  const [listDataResult, setListDataResult] = useState<any[]>([]);
  const [listDataQuestion, setListDataQuestion] = useState<any[]>([]);
  const [indexChildQues, setIndexChildQues] = useState(0);
  const [isIntruction, setIsIntruction] = useState<boolean>(false);

  const handleClickQuestion = (page: number, indexChild: number) => {
    setPage(page + 1);
    setIndexChildQues(indexChild);
  };

  useEffect(() => {
    let arrDataChoice: any[] = [];
    listUserAnswerState.length > 0 &&
      listUserAnswerState?.map((item: any) => {
        item?.answer?.map((i: any) => {
          if (i?.answer && i?.answer[0]?.idChildQuestion) {
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
    listDataResult.map((item: any) => {
      if (item?.answer?.length === 0 || item?.answer === 'undefined') {
        const ele = document.getElementById(`question-${item.idChildQuestion}`);
        ele?.classList.remove('question-done');
        ele?.classList.add('question-not-done');

        const eleMobile = document.getElementById(
          `question-mobile-${item.idChildQuestion}`,
        );
        eleMobile?.classList.remove('question-done');
        eleMobile?.classList.add('question-not-done');
      } else {
        const ele = document.getElementById(`question-${item.idChildQuestion}`);
        ele?.classList.add('question-done');
        ele?.classList.remove('question-not-done');

        const eleMobile = document.getElementById(
          `question-mobile-${item.idChildQuestion}`,
        );
        eleMobile?.classList.add('question-done');
        eleMobile?.classList.remove('question-not-done');
      }
    });
  }, [listDataResult]);

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

  return (
    <>
      <div className="bg-[#E9F4FF] pl-3 w-full py-5 z-30">
        <img
          onClick={showDrawer}
          className="cursor-pointer"
          src={arrow_icon}
          alt=""
        />
      </div>
      <div
        className={`h-full ${
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/Android/i)
            ? 'pb-[64px]'
            : 'pb-[125px]'
        }`}
      >
        <div className="h-full px-[6px] pt-4 pb-8 overflow-y-auto">
          {'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/Android/i) ? (
            <></>
          ) : (
            <>
              {/* font size */}
              <div className="hidden lg:block">
                <p className="flex items-center font-medium gap-1">
                  <Text size="20" color="#000000" variant="Bold" /> {t('board_question.font_size')}
                </p>
                <div className="flex mt-2 ml-2 items-baseline text-ct-primary-400">
                  <Tooltip label={t('board_question.large')} withArrow>
                    <span
                      className="pr-2 text-lg leading-6 cursor-pointer font-bold"
                      onClick={() => dispatch(setFontSize(20))}
                    >
                      Aa
                      {fontSize === 20 && (
                        <Divider size="md" className="border-ct-primary-400" />
                      )}
                    </span>
                  </Tooltip>

                  <Divider
                    className="h-[18px] border-ct-neutral-700 mt-1"
                    orientation="vertical"
                  />
                  <Tooltip label={t('board_question.medium')} withArrow>
                    <span
                      className="px-2 text-sm leading-5 cursor-pointer font-bold"
                      onClick={() => dispatch(setFontSize(18))}
                    >
                      Aa
                      {fontSize === 18 && (
                        <Divider size="md" className="border-ct-primary-400" />
                      )}
                    </span>
                  </Tooltip>

                  <Divider
                    className="h-[18px] border-ct-neutral-700 mt-1"
                    orientation="vertical"
                  />
                  <Tooltip label={t('board_question.small')} withArrow>
                    <span
                      className="px-2 text-xs leading-5 cursor-pointer font-bold"
                      onClick={() => dispatch(setFontSize(16))}
                    >
                      Aa
                      {fontSize === 16 && (
                        <Divider size="md" className="border-ct-primary-400" />
                      )}
                    </span>
                  </Tooltip>
                </div>
              </div>
              {/* Highlight tool */}
              <div className="mt-4 mb-4 hidden lg:block">
                <p className="flex items-center font-medium gap-1">
                  <BrushSquare size="20" color="#000000" variant="Bold" />{' '}
                  {t('board_question.highlight_tool')}
                </p>
                <div className="flex mt-3">
                  <Tooltip label={t('board_question.no_highlight')} withArrow>
                    <p>
                      <img
                        className="mx-1 lg:mx-2 cursor-pointer min-w-[20px]"
                        src={NoHighlight}
                        alt=""
                        onClick={() => {
                          dispatch(setCursorCustom(CursorType.Default));
                          window.getSelection()?.removeAllRanges();
                        }}
                      />
                      {cursorCustom === CursorType.Default && (
                        <Divider
                          size="md"
                          className="border-ct-primary-400 mt-1 ml-1 w-6 lg:ml-[6px] lg:w-7"
                        />
                      )}
                    </p>
                  </Tooltip>

                  <Divider orientation="vertical" className="h-[18px] mt-1" />
                  <Tooltip label={t('board_question.eraser')} withArrow>
                    <p>
                      <Eraser
                        className="mx-1 lg:mx-2 cursor-pointer"
                        size="24"
                        color="#0067c5"
                        variant="Bold"
                        onClick={() => {
                          dispatch(setCursorCustom(CursorType.Eraser));
                          window.getSelection()?.removeAllRanges();
                        }}
                      />
                      {cursorCustom === CursorType.Eraser && (
                        <Divider
                          size="md"
                          className="border-ct-primary-400 mt-1 ml-1 w-6 lg:ml-[6px] lg:w-7"
                        />
                      )}
                    </p>
                  </Tooltip>

                  <Divider orientation="vertical" className="h-[18px] mt-1" />
                  <Tooltip label={t('board_question.use_this_color')} withArrow>
                    <p>
                      <Brush2
                        className="mx-1 lg:mx-2 cursor-pointer"
                        size="24"
                        color="#ffe248"
                        variant="Bold"
                        onClick={() => {
                          dispatch(setCursorCustom(CursorType.BrushYellow));
                          window.getSelection()?.removeAllRanges();
                        }}
                      />
                      {cursorCustom === CursorType.BrushYellow && (
                        <Divider
                          size="md"
                          className="border-ct-primary-400 mt-1 ml-1 w-6 lg:ml-[6px] lg:w-7"
                        />
                      )}
                    </p>
                  </Tooltip>

                  <Divider orientation="vertical" className="h-[18px] mt-1" />
                  <Tooltip label={t('board_question.use_this_color')} withArrow>
                    <p>
                      <Brush2
                        className="mx-1 lg:mx-2 cursor-pointer"
                        size="24"
                        color="#0D961B"
                        variant="Bold"
                        onClick={() => {
                          dispatch(setCursorCustom(CursorType.BrushGreen));
                          window.getSelection()?.removeAllRanges();
                        }}
                      />
                      {cursorCustom === CursorType.BrushGreen && (
                        <Divider
                          size="md"
                          className="border-ct-primary-400 mt-1 ml-1 w-6 lg:ml-[6px] lg:w-7"
                        />
                      )}
                    </p>
                  </Tooltip>

                  <Divider orientation="vertical" className="h-[18px] mt-1" />
                  <Tooltip label={t('board_question.use_this_color')} withArrow>
                    <p>
                      <Brush2
                        className="mx-1 lg:mx-2 cursor-pointer"
                        size="24"
                        color="#18A4D0"
                        variant="Bold"
                        onClick={() => {
                          dispatch(setCursorCustom(CursorType.BrushBlue));
                          window.getSelection()?.removeAllRanges();
                        }}
                      />
                      {cursorCustom === CursorType.BrushBlue && (
                        <Divider
                          size="md"
                          className="border-ct-primary-400 mt-1 ml-1 w-6 lg:ml-[6px] lg:w-7"
                        />
                      )}
                    </p>
                  </Tooltip>
                </div>
              </div>
              {/* Comment */}
              <div className="hidden lg:block">
                <p className="flex items-center font-medium gap-1">
                  <MessageAdd1 size="20" color="#000000" variant="Bold" />{' '}
                  {t('board_question.comment')}
                </p>
                <div className="mt-2 ml-2">
                  <Tooltip label={t('board_question.comment')} withArrow>
                    <span>
                      <MessageText
                        className="cursor-pointer inline-block"
                        size="24"
                        color="#0056a4"
                        variant="Bold"
                        onClick={() => {
                          dispatch(setCursorCustom(CursorType.Comment));
                          window.getSelection()?.removeAllRanges();
                        }}
                      />
                      {cursorCustom === CursorType.Comment && (
                        <Divider
                          size="md"
                          className="border-ct-primary-400 mt-1 ml-[0px] w-6"
                        />
                      )}
                    </span>
                  </Tooltip>
                </div>
              </div>
              <Divider
                my="sm"
                className="border-ct-neutral-600 hidden lg:block"
              />
            </>
          )}

          <Button
            className="text-sm font-medium"
            onClick={() => setIsOpenModalAnswer(true)}
          >
            <TaskSquare
              className="mr-1"
              size="20"
              color="#ffffff"
              variant="Bold"
            />{' '}
            {t('board_question.review')}
          </Button>
          <div className="mt-4">
            <p className="flex items-center font-medium">
              <Category
                className="mr-1"
                size="20"
                color="#000000"
                variant="Bold"
              />{' '}
              {t('board_question.question_palette')}
            </p>
            <div className="flex items-center gap-2 text-sm mt-2">
              <div className="w-3 h-3 bg-ct-neutral-200 rounded-full"></div>{' '}
              {t('board_question.unanswered')}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-ct-primary-400 rounded-full"></div>{' '}
              {t('board_question.answered')}
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
                  arrDataQuestion = [
                    ...arrDataQuestion,
                    ...i.listQuestionChildren,
                  ];
                }
              });

              return (
                <div className="mt-4" key={index}>
                  <p className="flex items-center font-medium gap-1">
                    {t('board_question.section')} {index + 1}
                  </p>
                  <div className="grid gap-x-1 gap-y-2 grid-cols-4 mt-3">
                    {arrDataQuestion.map((it: any) => {
                      let indexChild =
                        listDataQuestion.findIndex(
                          (i: any) => i.idChildQuestion === it.idChildQuestion,
                        ) + 1;
                      return (
                        <div
                          className="question-not-done cursor-pointer rounded-3xl py-2 text-center text-xs"
                          id={`question-${it.idChildQuestion}`}
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
        </div>
        {'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/Android/i) ? (
          <></>
        ) : (
          <div className="bg-[#E9F4FF] absolute bottom-0 w-full p-4 hidden lg:block">
            <p
              className="flex items-center font-medium gap-2 text-sm p-2 pb-0 cursor-pointer"
              onClick={() => setIsIntruction(true)}
            >
              <MessageQuestion size="18" color="#1294F2" variant="Bold" />{' '}
              {t('board_question.instruction')}
            </p>
            {/* <p className="flex items-center font-medium gap-2 text-sm p-2">
          <InfoCircle size="18" color="#0056a4" variant="Bold" /> Report mistake
        </p> */}
          </div>
        )}
      </div>
      <ModalAnswer
        isOpen={isOpenModalAnswer}
        onClose={() => setIsOpenModalAnswer(false)}
        listQuestion={listQuestion}
        listDataQuestion={listDataQuestion}
        listDataResult={listDataResult}
      />
      <ModalIntruction
        isIntruction={isIntruction}
        onClose={() => setIsIntruction(false)}
        pathName={pathname}
      />
    </>
  );
};

export default BoardQuestion;
