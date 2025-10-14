/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Modal, Pagination } from '@mantine/core';
import ContentTestLayout from '@/components/Layouts/ContentTest';
import Audio from '@/components/organisms/Exam/Audio';
import DragDrop from '@/components/organisms/Exam/Question/DragDrop';
import Dropdown from '@/components/organisms/Exam/Question/DropDown';
import FillBlank from '@/components/organisms/Exam/Question/FillBlank';
import ModernMultiChoiceOneRight from '@/components/organisms/Exam/Question/ModernMultiChoiceOneRight';
import MultiChoiceMultiRight from '@/components/organisms/Exam/Question/MultiChoiceMultiRight';
import MultiChoiceOneRight from '@/components/organisms/Exam/Question/MultiChoiceOneRight';
import Button from '@/components/sharedV2/Button';
import LoadingExam from '@/components/sharedV2/LoadingExam';
import MathJaxRender from '@/components/sharedV2/MathJax';
import DialogBox from '@/hooks/BeforeUnload';
import { useCallbackPrompt } from '@/hooks/BeforeUnload/useCallbackPrompt';
import { TestType, questionEnumType } from '@/enum';
import { Clock } from 'iconsax-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { LocalStorageService } from '@/services';
import {
  postExamPartContinueApi,
  postExamPartStartApi,
  postExamPartSubmit,
} from '@/service/api/examConfig';
// import { getMockcontestHistoryApi } from '@/service/api/packageApi';
import { getMockcontestHistoryApi } from '@/service/api/examConfig';
import {
  CursorCustom,
  ExamInfo,
  FontSize,
  IdHistoryContest,
  IdHistoryRound,
  ListUserAnswer,
  UserData,
} from '@/store/selector';
import {
  setCursorCustom,
  setFontSize,
  setIdHistoryRoundExam,
} from '@/store/slice/examInfo';
import {
  captureClick,
  getCursorClass,
  getFontSize,
  getTimeCountdown,
  highlightRange,
  listIDException,
  removeEleComment,
} from '@/utils';

const TestListening = () => {
  const examInfo = useSelector(ExamInfo, shallowEqual);
  const idHistoryContest = useSelector(IdHistoryContest, shallowEqual);
  const idHistoryRound = useSelector(IdHistoryRound, shallowEqual);
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual) || [];
  const userData = useSelector(UserData, shallowEqual);
  const cursorCustom = useSelector(CursorCustom, shallowEqual) || 0;
  const fontSize = useSelector(FontSize, shallowEqual) || 16;

  const router = useRouter();
  const params = router.query;
  const pathname = router.asPath;
  const dispatch = useDispatch();

  const [showDialog, setShowDialog] = useState<boolean>(true);

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog);

  const [page, setPage] = useState(() => {
    return localStorage.getItem('page')
      ? Number(localStorage.getItem('page'))
      : 1;
  });
  const [listQuestion, setListQuestion] = useState<any[]>([]);
  const [listGraded, setListGraded] = useState<any>([]);
  const [listAudio, setListAudio] = useState<any[]>([]);
  const [checkAudioEnd, setCheckAudioEnd] = useState(false);
  const [timer, setTimer] = useState<number>(120);
  const [showLoadingExam, setShowLoadingExam] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [srcAudio, setSrcAudio] = useState();
  const [isShowButtonSubmit, setIsShowButtonSubmit] = useState<boolean>(false);
  const [isPermission, setIsPermission] = useState<boolean>(false);
  const [isPauseAllow, setIsPauseAllow] = useState<boolean>(false);
  const [countComment, setCountComment] = useState<number>(1);
  const [timeRemaining, setTimeRemaining] = useState<number>(2399);
  const [isDisabledSubmit, setIsDisabledSubmit] = useState<boolean>(false);
  const [timeVisibility, setTimeVisibility] = useState('hidden');

  const testRef = useRef<any>();

  const onSubmit = async () => {
    setIsDisabledSubmit(true);
    setShowDialog(false);
    const dataParams = {
      idHistory: `${idHistoryRound}`,
      quiz_id: Number(examInfo?.quiz_id),
      idbaikiemtra: Number(params?.idRound),
      contest_type_id: examInfo?.contest_type || 0,
      skill: TestType.Listening,
      listUserAnswer: [...listUserAnswerState],
    };
    const response = await postExamPartSubmit(dataParams);
    if (response.status === 200) {
      removeEleComment();
      sessionStorage.removeItem('current-time');
      localStorage.removeItem('page');
      const ele = document.getElementsByTagName('audio');
      if (ele.length > 0) {
        ele[0].setAttribute('src', '');
      }
      if (pathname.includes('/practice/')) {
        router.push(
          `/practice/listening/${params?.idExam}/${response.data?.data?.history_id}/answer-key`,
        );
      } else {
        const idRound = examInfo?.rounds?.find(
          (item: any) => item.test_format === TestType.Reading,
        )?.id;
        router.replace(`/${params.tenant}/${params.campaign}/${params.slug}/exam/reading/${params.idExam}/${idRound}`);
        setIsSubmit(false);
      }
    } else {
      setIsDisabledSubmit(false);
    }
  };

  const submitAnswer = async () => {
    setIsSubmit(true);
  };
  const exitCurrentPage = () => {
    setShowDialog(false);
  };
  const stayCurrentPage = () => {
    setShowDialog(true);
  };

  const nextPage = () => {
    const index = listAudio?.findIndex((item: any) => item === srcAudio);
    setSrcAudio(listAudio[index + 1]);
    setPage(index + 2);
    localStorage.setItem('page', `${index + 2}`);
    sessionStorage.setItem('current-time', '0');
    // if (pathname.includes('/practice/listening')) {
    //   if (index === 2) {
    //     setIsShowButtonSubmit(true);
    //   }
    // }
  };

  const previousPart = () => {
    const index = listAudio?.findIndex((item: any) => item === srcAudio);
    setSrcAudio(listAudio[index - 1]);
    setPage(index);
    localStorage.setItem('page', `${index}`);
    sessionStorage.setItem('current-time', '0');
  };

  const getContentQuestion = (itemQues: any, numberPage: number) => {
    const listItemQuestion: any = [];
    const listTableQuestion: any = [];
    const listItemDesc: any = [];
    let indexRight = 0;
    itemQues?.listQuestionChildren?.map((item: any, index: any) => {
      let itemQuestion: any = <></>;
      switch (item.quiz_type) {
        case questionEnumType.ONE_RIGHT:
          itemQuestion = (
            // <MultiChoiceOneRight
            <ModernMultiChoiceOneRight
              question={item}
              indexQuestion={index}
              key={index}
              data={listQuestion}
              page={numberPage}
              idHistoryRound={idHistoryRound as string}
              contestType={examInfo?.contest_type as number}
            />
          );
          break;
        case questionEnumType.MULTIPLE_RIGHT:
          itemQuestion = (
            <MultiChoiceMultiRight
              question={item}
              indexQuestion={index}
              key={index}
              data={listQuestion}
              page={numberPage}
              idHistoryRound={idHistoryRound as string}
              contestType={examInfo?.contest_type}
            />
          );
          break;
        case questionEnumType.FILL_BLANK:
          itemQuestion = (
            <FillBlank
              key={index}
              indexQuestion={index}
              question={item}
              data={listQuestion}
              page={numberPage}
              idHistoryRound={idHistoryRound as string}
              contestType={examInfo?.contest_type}
            />
          );
          break;
        case questionEnumType.DROPDOWN:
          itemQuestion = (
            <Dropdown
              key={index}
              indexQuestion={index}
              question={item}
              data={listQuestion}
              page={numberPage}
              idHistoryRound={idHistoryRound as string}
              contestType={examInfo?.contest_type}
            />
          );
          break;
        case questionEnumType.DRAG_DROP:
          itemQuestion = (
            <DragDrop
              key={index}
              indexQuestion={index}
              question={item}
              data={listQuestion}
              page={numberPage}
              idHistoryRound={idHistoryRound as string}
              contestType={examInfo?.contest_type as number}
            />
          );
          break;
        default:
          break;
      }

      if (
        item.quiz_type === questionEnumType.FILL_BLANK &&
        itemQues?.listQuestionChildren?.length === 1
      ) {
        listTableQuestion.push(itemQuestion);
      } else {
        listItemQuestion.push(itemQuestion);
        if (index === 0) {
          listItemDesc.push(item);
        } else {
          if (item?.description?.length > 0) {
            listItemDesc.push(item);
          }
        }
      }
    });
    const indexDesc = Math.round(listItemDesc?.length / 2);
    indexRight = listItemQuestion.findIndex(
      (i: any) =>
        i?.props?.question?.idChildQuestion ===
        listItemDesc[indexDesc]?.idChildQuestion,
    );
    return {
      listItemQuestion,
      listTableQuestion,
      indexRight,
    };
  };

  const onMouseUp = (e: any) => {
    if (e.button == 0) {
      const selection = window.getSelection();
      const s = selection?.toString();
      if (s === '' || !selection || selection.rangeCount === 0) {
        return;
      }
      const userSelection = selection.getRangeAt(0);
      setCountComment((prev: number) => prev + 1);
      highlightRange(userSelection, cursorCustom, dispatch, countComment);
      document.addEventListener('click', captureClick, true);
    }
  };
  // const handleContinueExam = useCallback(async () => {
  //   try {
  //     if (pathname.includes('exam/writing')) {
  //       const responseContinue = await postExamPartContinueApi(
  //         `${idHistoryRound}`,
  //       );
  //       if (responseContinue.status === 200 && responseContinue.data.status) {
  //         setTimer(responseContinue?.data?.data?.timeAllow);
  //       } else {
  //         setIsPermission(true);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [idHistoryRound, pathname]);

  useEffect(() => {
    document.addEventListener('visibilitychange', function () {
      setTimeVisibility(document.visibilityState);
    });
    dispatch(setCursorCustom(0));
    dispatch(setFontSize(16));
    document.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.keyCode === 65 || //key a
          e.keyCode === 67 || //key c
          e.keyCode === 70 || //key f
          e.keyCode === 80 || //key p
          e.keyCode === 82 || //key r
          e.keyCode === 83 || //key s
          e.keyCode === 86 || //key v
          e.keyCode === 117) //key F6
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', event => {
        event.preventDefault();
      });
    };
  }, []);

  useEffect(() => {
    if (idHistoryContest && examInfo?.contest_type) {
      getMockcontestHistoryApi({
        contest_type: examInfo?.contest_type,
        idMockContest: Number(params?.idExam),
        idHistoryContest,
      }).then((response: any) => {
        if (response.status === 200) {
          const dataHistory = response?.data?.data;
          const index = dataHistory[0].rounds?.findIndex(
            (item: any) => item.testFormat === TestType.Listening,
          );
          if (dataHistory[0].rounds[index]?.idHistory) {
            dispatch(
              setIdHistoryRoundExam(dataHistory[0].rounds[index]?.idHistory),
            );
            //continue part exam
            postExamPartContinueApi(
              dataHistory[0].rounds[index]?.idHistory,
              examInfo?.contest_type as number,
            )
              .then(responseContinue => {
                if (
                  responseContinue.status === 200 &&
                  responseContinue.data.status
                ) {
                  setListQuestion(responseContinue?.data?.data?.listQuestion);
                  setListGraded(responseContinue?.data?.data?.listUserAnswer);
                  const listSrcAudio =
                    responseContinue?.data?.data?.listQuestion.map(
                      (item: any) => {
                        return item.audio;
                      },
                    );
                  setListAudio(listSrcAudio);
                  setSrcAudio(listSrcAudio[page - 1]);
                  setIsPauseAllow(
                    responseContinue?.data?.data?.baikiemtra?.isPauseAllow,
                  );
                  pathname.includes('/exam/listening') &&
                    setTimeRemaining(responseContinue?.data?.data?.timeAllow);
                } else {
                  setIsPermission(true);
                }
              })
              .catch(err => console.log(err))
              .finally(() => setShowLoadingExam(false));
          } else {
            // start new part exam
            postExamPartStartApi(
              Number(params?.idRound),
              idHistoryContest,
              examInfo?.contest_type || 0,
            )
              .then(responseStart => {
                if (responseStart.status === 200 && responseStart.data.status) {
                  dispatch(
                    setIdHistoryRoundExam(responseStart?.data?.data?.idHistory),
                  );
                  setListQuestion(responseStart?.data?.data?.listQuestion);
                  setListGraded([]);
                  const listSrcAudio =
                    responseStart?.data?.data?.listQuestion.map((item: any) => {
                      return item.audio;
                    });
                  setListAudio(listSrcAudio);
                  setSrcAudio(listSrcAudio[page - 1]);
                  setIsPauseAllow(
                    responseStart?.data?.data?.baikiemtra?.isPauseAllow,
                  );
                  pathname.includes('/exam/listening') &&
                    setTimeRemaining(responseStart?.data?.data?.timeAllow);
                } else {
                  setIsPermission(true);
                }
              })
              .catch(err => console.log(err))
              .finally(() => setShowLoadingExam(false));
          }
        }
      });
    }
  }, [idHistoryContest, examInfo?.contest_type]);

  useEffect(() => {
    if (listQuestion?.length > 0) {
      let timeRemainingInterval: any;
      if (pathname.includes('exam/listening')) {
        timeRemainingInterval = setInterval(() => {
          setTimeRemaining((prev: any) => prev - 1);
        }, 1000);
      } else {
        clearInterval(timeRemainingInterval);
      }
      return () => {
        clearInterval(timeRemainingInterval);
      };
    }
  }, [listQuestion]);

  useEffect(() => {
    if (pathname.includes('exam/listening')) {
      timeRemaining === 0 && onSubmit();
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (checkAudioEnd && pathname.includes('/exam/listening')) {
      const time = setInterval(() => {
        setTimer((prev: any) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(time);
      };
    }
  }, [checkAudioEnd]);

  useEffect(() => {
    if (timer === 0) {
      onSubmit();
    }
  }, [timer]);

  useEffect(() => {
    testRef.current.scrollTop = 0;
  }, [page]);

  useEffect(() => {
    const index = listAudio?.findIndex((item: any) => item === srcAudio);
    if (index === 3 && pathname.includes('/practice/listening')) {
      setIsShowButtonSubmit(true);
    } else {
      setIsShowButtonSubmit(false);
    }
  }, [srcAudio]);

  useEffect(() => {
    if (pathname.includes('/exam/listening') && timeVisibility === 'visible') {
      console.log('run here');

      postExamPartContinueApi(`${idHistoryRound}`, examInfo?.contest_type || 0)
        .then(resContinue => {
          if (resContinue.status === 200 && resContinue.data.status) {
            setTimeRemaining(resContinue?.data?.data.timeAllow);
          } else {
            setIsPermission(true);
          }
        })
        .catch(err => console.log(err))
        .finally(() => setShowLoadingExam(false));
    }
  }, [timeVisibility]);

  const headerContent = () => {
    return (
      <div className="flex items-center space-x-2 lg:space-x-4 text-ct-primary-500">
        {checkAudioEnd && pathname.includes('/exam/listening') && (
          <div className="hidden sm:flex items-center border border-ct-primary-500 rounded-2xl px-2 py-1 mr-2">
            <Clock className="mr-2" size="22" color="#0056a4" variant="Bold" />
            {timer > 0 ? (
              <span className="text-xl">{getTimeCountdown(timer)}</span>
            ) : (
              <span className="text-xl">{getTimeCountdown(0)}</span>
            )}
          </div>
        )}
        <span>{'Part'}</span>
        <Pagination
          page={page}
          total={listQuestion?.length}
          withControls={false}
          className="!gap-0 space-x-2"
          classNames={{
            item: 'bg-white min-w-[24px] h-6 w-6 lg:min-w-[32px] lg:h-8 lg:w-8',
          }}
          styles={() => ({
            item: {
              '&[data-active]': {
                backgroundColor: '#FF3BAF !important',
              },
            },
          })}
          onChange={(page: number) => {
            setPage(page);
          }}
        />
      </div>
    );
  };

  const testContent = () => {
    return (
      <div className="h-full w-full">
        <div className="flex h-full relative flex-col justify-between pt-[100px] sm:pt-[60px]">
          <div className="sticky top-16 sm:top-8 z-10 w-full">
            <div className="bg-[#F9F9F9] w-full">
              <div className="p-4 sm:p-6 w-[95%]">
                <Audio
                  listAudio={listAudio}
                  setPage={setPage}
                  setCheckAudioEnd={setCheckAudioEnd}
                  srcAudio={srcAudio}
                  setSrcAudio={setSrcAudio}
                  setIsShowButtonSubmit={setIsShowButtonSubmit}
                />
              </div>
            </div>
          </div>
          <div
            className={`h-full bg-[#F9F9F9] overflow-y-auto scroll-smooth ${getCursorClass(
              cursorCustom,
            )}`}
            ref={testRef}
            onMouseUp={onMouseUp}
          >
            <div className="px-4 sm:px-6 pb-24 lg:pb-[160px] mt-4">
              {listQuestion?.length > 0 &&
                listQuestion.map((item: any, index: number) => (
                  <div
                    className={`mt-4 text-xl font-roboto ${
                      page === index + 1 ? 'block' : 'hidden'
                    }`}
                    key={index}
                  >
                    <MathJaxRender math={`${item?.text}`} />
                  </div>
                ))}

              {listQuestion?.length > 0 &&
                listQuestion.map((item: any, index: number) => {
                  const { listItemQuestion, listTableQuestion, indexRight } =
                    getContentQuestion(item, index + 1);
                  if (listTableQuestion.length === 0) {
                    return (
                      <div
                        className={`mt-3 ${
                          page === index + 1 ? 'flex' : 'hidden'
                        } justify-between flex-wrap space-x-4 ${getFontSize(
                          fontSize,
                        )}`}
                        key={index}
                      >
                        <div className="flex-auto xl:flex-1">
                          {listItemQuestion.slice(0, indexRight)}
                        </div>
                        <div className="flex-auto xl:flex-1">
                          {listItemQuestion.slice(indexRight)}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className={`mt-3 question-full ${
                          page === index + 1 ? 'block' : 'hidden'
                        }`}
                      >
                        {listTableQuestion}
                      </div>
                    );
                  }
                })}
            </div>
          </div>
          {pathname.includes('/practice/listening') && (
            <div className="bg-white w-full py-3 px-4 sm:px-6 absolute bottom-0 flex items-center justify-between select-none">
              <Button
                className="bg-white"
                variant="outline"
                disabled={
                  listAudio?.findIndex((item: any) => item === srcAudio) === 0
                }
                onClick={previousPart}
              >
                Previous Part
              </Button>

              <Button
                disabled={
                  listAudio?.findIndex((item: any) => item === srcAudio) ===
                  listAudio?.length - 1
                }
                onClick={nextPage}
              >
                Next Part
              </Button>
            </div>
          )}
          {checkAudioEnd && pathname.includes('/exam/listening') && (
            <div className="w-full bg-white py-2 px-4 sm:px-6 sticky bottom-0 flex items-center justify-center select-none">
              <div className="flex sm:hidden items-center border border-ct-primary-500 rounded-2xl px-2 py-1 mr-2">
                <Clock
                  className="mr-2"
                  size="22"
                  color="#0056a4"
                  variant="Bold"
                />
                {timer > 0 ? (
                  <span className="text-xl">{getTimeCountdown(timer)}</span>
                ) : (
                  <span className="text-xl">{getTimeCountdown(0)}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <ContentTestLayout
        page={page}
        total={listQuestion?.length}
        type={'test'}
        childrenHeader={headerContent}
        childrenContent={testContent}
        showSubmitBtn={
          isShowButtonSubmit || listIDException?.includes(Number(userData?.id))
        }
        submitAnswer={submitAnswer}
        listGraded={listGraded}
        listQuestion={listQuestion}
        exitCurrentPage={exitCurrentPage}
        stayCurrentPage={stayCurrentPage}
        setPage={setPage}
        contentRef={testRef}
        isPauseAllow={isPauseAllow}
      />
      <DialogBox
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
        sideEffectLeave={() => { /* No side effects */ }}
      />
      <Modal
        opened={showLoadingExam}
        withCloseButton={false}
        closeOnClickOutside={false}
        className="z-[1201]"
        centered
        onClose={() => { /* Modal stays open */ }}
        styles={{
          body: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <LoadingExam />
      </Modal>
      <Modal
        opened={isSubmit}
        centered
        withCloseButton={false}
        onClose={() => setIsSubmit(false)}
        className="min-w-[360px] z-[1201]"
        size={360}
        radius={'lg'}
      >
        <div className="py-8">
          <p className="text-center">Do you want to finish the test?</p>
          <div className="flex justify-center space-x-4 mt-10">
            <Button
              variant="outline"
              className="py-[9px]"
              onClick={() => setIsSubmit(false)}
            >
              No, Take me back
            </Button>
            <Button
              disabled={isDisabledSubmit}
              className="py-[10px]"
              onClick={onSubmit}
            >
              Yes, I do
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={isPermission}
        centered
        withCloseButton={false}
        closeOnClickOutside={false}
        onClose={() => { /* Modal stays open */ }}
        className="min-w-[360px] z-[1202]"
        size={360}
        radius={'lg'}
      >
        <div className="py-4">
          <p className="text-center px-8">
            You don’t have permission to access this link.
          </p>
          <div className="mt-4">
            <Button
              className="mx-auto"
              onClick={() => {
                setShowDialog(false);
                setIsPermission(false);
                setTimeout(() => {
                  router.push(LocalStorageService.get('historyPath') ?? '/');
                }, 500);
              }}
            >
              Back to homepage
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TestListening;
