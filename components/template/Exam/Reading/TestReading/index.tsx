/* eslint-disable prefer-const */
import { Drawer, Modal, Pagination } from '@mantine/core';
import ContentTestLayout from '@/components/Layouts/ContentTest';
import MySlpit from '@/components/Layouts/SplitLayout';
import DragDrop from '@/components/organisms/Exam/Question/DragDrop';
import DropDown from '@/components/organisms/Exam/Question/DropDown';
import FillBlank from '@/components/organisms/Exam/Question/FillBlank';
import ModernMultiChoiceOneRight from '@/components/organisms/Exam/Question/ModernMultiChoiceOneRight';
import MultiChoiceMultiRight from '@/components/organisms/Exam/Question/MultiChoiceMultiRight';
import MultiYesNoOneRight from '@/components/organisms/Exam/Question/MultiYesNoOneRight';
import Button from '@/components/sharedV2/Button';
import LoadingExam from '@/components/sharedV2/LoadingExam';
import DialogBox from '@/hooks/BeforeUnload';
import { useCallbackPrompt } from '@/hooks/BeforeUnload/useCallbackPrompt';
import { TestType, questionEnumType } from '@/enum';
import { Clock, DocumentText } from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';
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
  removeEleComment,
} from '@/utils';

const TestReading = () => {
  const examInfo = useSelector(ExamInfo, shallowEqual) || {};
  const idHistoryContest = useSelector(IdHistoryContest, shallowEqual);
  const idHistoryRound = useSelector(IdHistoryRound, shallowEqual);
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual) || [];
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
    if (
      localStorage.getItem('page') &&
      Number(localStorage.getItem('page')) > 3
    ) {
      return Number(localStorage.getItem('page'));
    } else {
      return 1;
    }
  });
  const [timer, setTimer] = useState<number>(3599);
  const [listQuestion, setListQuestion] = useState<any[]>([]);
  const [listGraded, setListGraded] = useState<any>([]);
  const [showLoadingExam, setShowLoadingExam] = useState<boolean>(false);
  const [showModalExpired, setShowModalExpired] = useState<boolean>(false);
  const [timeVisibility, setTimeVisibility] = useState<string>('hidden');
  const [isPermission, setIsPermission] = useState<boolean>(false);
  const [isUnlimited, setIsUnlimited] = useState<string>('');
  const [timerUnlimited, setTimerUnlimited] = useState(0);
  const [isPauseAllow, setIsPauseAllow] = useState<boolean>(false);
  const [countComment, setCountComment] = useState<number>(1);
  const [isDrawerRead, setIsDrawerRead] = useState<boolean>(false);
  const [isDisabledSubmit, setIsDisabledSubmit] = useState<boolean>(false);
  const [isScrollMobile, setIsScrollMobile] = useState<boolean>(false);
  const [isReadHere, setIsReadHere] = useState<boolean>(true);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const leftRef = useRef<any>();
  const rightRef = useRef<any>();

  const getContentQuestion = (itemQues: any, numberPage: number) => {
    let listItemQuestion: any = [];
    itemQues?.listQuestionChildren?.map((item: any, index: any) => {
      let itemQuestion: any = <></>;
      switch (item.quiz_type) {
        case questionEnumType.ONE_RIGHT:
          itemQuestion = (
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
              contestType={examInfo?.contest_type as number}
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
              contestType={examInfo?.contest_type as number}
            />
          );
          break;
        case questionEnumType.DROPDOWN:
          itemQuestion = (
            <DropDown
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
        case questionEnumType.MULTIPLE_YES_NO_ONE_RIGHT:
          itemQuestion = (
            <MultiYesNoOneRight
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

      listItemQuestion.push(itemQuestion);
    });
    return listItemQuestion;
  };

  const submitAnswer = async () => {
    setIsSubmit(true);
  };

  const onSubmit = async () => {
    setIsDisabledSubmit(true);
    setShowDialog(false);
    localStorage.removeItem('page');
    const dataParams = {
      idHistory: `${idHistoryRound}`,
      idMockContest: Number(params?.idExam),
      idbaikiemtra: Number(params?.idRound),
      contest_type_id: examInfo?.contest_type as number,
      skill: TestType.Reading,
      listUserAnswer: [...listUserAnswerState],
    };
    const response = await postExamPartSubmit(dataParams);
    if (response.status === 200) {
      removeEleComment();
      if (pathname.includes('/practice/')) {
        router.push(
          `/practice/reading/${params?.idExam}/${response.data?.metadata?.history_id}/answer-key`,
        );
      } else {
        const idRound = examInfo?.rounds?.find(
          (item: any) => item.test_format === TestType.Writing,
        )?.id;
        router.replace(`/${params.tenant}/${params.campaign}/${params.slug}/exam/writing/${params.idExam}/${idRound}`);
        setIsSubmit(false);
      }
    } else {
      setIsDisabledSubmit(false);
    }
  };

  const exitCurrentPage = () => {
    setShowDialog(false);
  };
  const stayCurrentPage = () => {
    setShowDialog(true);
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

  const onScroll = (e: any) => {
    setIsReadHere(true);
    if (e?.target?.scrollTop > 0) {
      setIsScrollMobile(true);
    } else {
      setIsScrollMobile(false);
    }
  };

  useEffect(() => {
    let timerScroll: any;
    if (isScrollMobile) {
      clearTimeout(timerScroll);
      timerScroll = setTimeout(() => {
        setIsScrollMobile(false);
        setIsReadHere(false);
      }, 3600);
    } else {
      clearTimeout(timerScroll);
    }
    return () => {
      clearTimeout(timerScroll);
    };
  }, [isScrollMobile]);

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
    if (isUnlimited === 'unlimit') {
      let timeUnlimited: any = setInterval(() => {
        setTimerUnlimited(
          Math.floor(Date.now() / 1000) -
            Number(localStorage.getItem('time_start')),
        );
      }, 1000);

      return () => {
        clearInterval(timeUnlimited);
      };
    } else if (isUnlimited === 'limit') {
      let time: any = setInterval(() => {
        if (timer > 0) {
          setTimer((prev: any) => prev - 1);
        } else {
          clearInterval(time);
        }
      }, 1000);

      return () => {
        clearInterval(time);
      };
    } else {
      return;
    }
  }, [isUnlimited]);

  useEffect(() => {
    if (idHistoryContest && examInfo?.contest_type) {
      getMockcontestHistoryApi({
        contest_type: examInfo?.contest_type as number,
        idMockContest: Number(params?.idExam),
        idHistoryContest,
      }).then((response: any) => {
        if (response.status === 200) {
          const dataHistory = response?.data?.data;
          const index = dataHistory[0].rounds?.findIndex(
            (item: any) => item.testFormat === TestType.Reading,
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
              .then(resContinue => {
                if (resContinue.status === 200 && resContinue.data.status) {
                  if (pathname.includes('practice/reading')) {
                    setIsUnlimited('unlimit');
                    setTimerUnlimited(1);
                  } else {
                    setIsUnlimited('limit');
                    setTimer(resContinue?.data?.data.timeAllow);
                  }
                  setIsPauseAllow(
                    resContinue?.data?.data?.baikiemtra?.isPauseAllow,
                  );
                  setListQuestion(resContinue?.data?.data?.listQuestion);
                  setListGraded(resContinue?.data?.data?.listUserAnswer);
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
              examInfo?.contest_type as number,
            )
              .then(responseStart => {
                if (responseStart.status === 200 && responseStart.data.status) {
                  dispatch(
                    setIdHistoryRoundExam(responseStart?.data?.data?.idHistory),
                  );
                  setListQuestion(responseStart?.data?.data?.listQuestion);
                  setListGraded([]);
                  if (pathname.includes('practice/reading')) {
                    setIsUnlimited('unlimit');
                    setTimerUnlimited(1);
                  } else {
                    setIsUnlimited('limit');
                    setTimer(responseStart?.data?.data.timeAllow);
                  }
                  setIsPauseAllow(
                    responseStart?.data?.data?.baikiemtra?.isPauseAllow,
                  );
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
    if (isUnlimited === 'limit' && timeVisibility === 'visible') {
      postExamPartContinueApi(`${idHistoryRound}`, examInfo?.contest_type as number)
        .then(resContinue => {
          if (resContinue.status === 200 && resContinue.data.status) {
            setTimer(resContinue?.data?.data.timeAllow);
          } else {
            setIsPermission(true);
          }
        })
        .catch(err => console.log(err))
        .finally(() => setShowLoadingExam(false));
    }
  }, [timeVisibility]);

  useEffect(() => {
    if (isUnlimited === 'limit') {
      if (
        timer === 0 ||
        Math.floor(Date.now() / 1000) -
          Number(localStorage.getItem('time_start')) ===
          3596
      ) {
        onSubmit();
      } else if (
        Math.floor(Date.now() / 1000) -
          Number(localStorage.getItem('time_start')) >
        3596
      ) {
        setShowModalExpired(true);
      }
    }
  }, [timer]);

  const headerContent = () => {
    return (
      <div className="flex items-center space-x-4 text-ct-primary-500">
        <div className="hidden lg:flex items-center border border-ct-primary-500 rounded-2xl px-2 py-1 mr-2">
          <Clock className="mr-2" size="22" color="#0056a4" variant="Bold" />
          {isUnlimited === 'unlimit' ? (
            <span className="text-xl">{getTimeCountdown(timerUnlimited)}</span>
          ) : isUnlimited === 'limit' && timer > 0 ? (
            <span className="text-xl">{getTimeCountdown(timer)}</span>
          ) : (
            <span className="text-xl">{getTimeCountdown(0)}</span>
          )}
        </div>
        <span>{'Passage'}</span>
        <Pagination
          key={`pagination-${page}`}
          defaultValue={page}
          onChange={(newPage: number) => {
            setPage(newPage);
            localStorage.setItem('page', `${newPage}`);
            if (leftRef.current) leftRef.current.scrollTop = 0;
            if (rightRef.current) rightRef.current.scrollTop = 0;
          }}
          total={listQuestion?.length}
          withControls={false}
          className="!gap-0 space-x-2"
          sx={{
            '& button[data-active]': {
              backgroundColor: '#FF3BAF !important',
            },
            '& button': {
              backgroundColor: 'white',
              minWidth: '24px',
              height: '24px',
              width: '24px',
              '@media (min-width: 1024px)': {
                minWidth: '32px',
                height: '32px',
                width: '32px',
              },
            },
          }}
        />
      </div>
    );
  };

  const leftContainer = () => {
    return (
      <div className="h-full pt-[63px]">
        <div
          className="h-full overflow-y-auto pt-5 relative flex flex-col justify-between"
          ref={leftRef}
        >
          {listQuestion?.length > 0 &&
            listQuestion.map((item: any, index: number) => (
              <div
                className={`pb-[160px] px-6 ${
                  page === index + 1 ? 'block' : 'hidden'
                }`}
                key={index}
              >
                <h3 className="text-2xl">Reading passage {page}</h3>
                <p
                  className={`mt-3 ${getFontSize(fontSize)}`}
                  dangerouslySetInnerHTML={{
                    __html: item?.text,
                  }}
                ></p>
              </div>
            ))}

          <div className="sticky bottom-0 w-full py-3 flex items-center justify-between bg-white select-none">
            <Button
              className="bg-white"
              variant="outline"
              disabled={page === 1}
              onClick={() => {
                const newPage = page - 1;
                setPage(newPage);
                localStorage.setItem('page', `${newPage}`);
                if (leftRef.current) leftRef.current.scrollTop = 0;
                if (rightRef.current) rightRef.current.scrollTop = 0;
              }}
            >
              Previous Passage
            </Button>
            <Button
              disabled={page === listQuestion?.length}
              onClick={() => {
                const newPage = page + 1;
                setPage(newPage);
                localStorage.setItem('page', `${newPage}`);
                if (leftRef.current) leftRef.current.scrollTop = 0;
                if (rightRef.current) rightRef.current.scrollTop = 0;
              }}
            >
              Next Passage
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const rightContainer = () => {
    return (
      <div className="h-full bg-[#F9F9F9] pb-[62px] sm:pb-[64px] pt-[100px] sm:pt-[63px] lg:pb-0">
        <div
          className="h-full overflow-y-auto scroll-smooth px-4"
          ref={rightRef}
          onScroll={onScroll}
        >
          <div className="pb-5 lg:pb-[160px]">
            {listQuestion?.length > 0 &&
              listQuestion.map((item: any, index: any) => (
                <div
                  key={index}
                  className={`flex-col space-y-6 ${getFontSize(fontSize)} ${
                    page === index + 1 ? 'flex' : 'hidden'
                  }`}
                >
                  {getContentQuestion(item, index + 1)}
                </div>
              ))}
          </div>
          <div
            className={`cursor-pointer transition-all duration-500 ease-linear ${
              isReadHere ? 'w-[126px] sm:w-[134px]' : 'w-[40px] sm:w-[48px]'
            } h-[40px] sm:h-[48px] px-2 sm:px-3 bg-ct-tertiary-600 rounded-full inline-flex flex-nowrap items-center justify-center sticky bottom-8 float-right lg:hidden`}
            onClick={() => setIsDrawerRead(true)}
          >
            <span className="flex items-center justify-center">
              <DocumentText color="#ffffff" variant="Bold" />
            </span>
            <span className="read-here text-white font-medium text-sm">
              &nbsp;See passage
            </span>
          </div>
        </div>
        <div className="bg-white absolute bottom-0 w-full px-4 py-3 flex lg:hidden items-center justify-between select-none">
          <Button
            className="bg-white"
            variant="outline"
            disabled={page === 1}
            onClick={() => {
              const newPage = page - 1;
              setPage(newPage);
              localStorage.setItem('page', `${newPage}`);
              if (leftRef.current) leftRef.current.scrollTop = 0;
              if (rightRef.current) rightRef.current.scrollTop = 0;
            }}
          >
            Previous
          </Button>
          <div className="flex lg:hidden items-center border border-ct-primary-500 rounded-2xl px-2 py-1 mr-2">
            <Clock className="mr-2" size="22" color="#0056a4" variant="Bold" />
            {isUnlimited === 'unlimit' ? (
              <span className="text-xl">
                {getTimeCountdown(timerUnlimited)}
              </span>
            ) : isUnlimited === 'limit' && timer > 0 ? (
              <span className="text-xl">{getTimeCountdown(timer)}</span>
            ) : (
              <span className="text-xl">{getTimeCountdown(0)}</span>
            )}
          </div>
          <Button
            disabled={page === listQuestion?.length}
            onClick={() => {
              const newPage = page + 1;
              setPage(newPage);
              localStorage.setItem('page', `${newPage}`);
              if (leftRef.current) leftRef.current.scrollTop = 0;
              if (rightRef.current) rightRef.current.scrollTop = 0;
            }}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const testContent = () => {
    return (
      <div className="flex h-full w-full">
        <div
          className={`h-full w-full overflow-hidden ${getCursorClass(
            cursorCustom,
          )}`}
          onMouseUp={onMouseUp}
        >
          <MySlpit leftContent={leftContainer} rightContent={rightContainer} />
          <Drawer
            opened={isDrawerRead}
            className="lg:hidden"
            onClose={() => setIsDrawerRead(false)}
            zIndex={1201}
            withCloseButton={false}
            size={'100%'}
            classNames={{
              drawer: 'overflow-y-auto',
            }}
          >
            <div className="p-4 pb-8">
              {listQuestion?.length > 0 &&
                listQuestion.map((item: any, index: number) => (
                  <div
                    className={`${page === index + 1 ? 'block' : 'hidden'}`}
                    key={index}
                  >
                    <h3 className="text-2xl">Reading passage {page}</h3>
                    <p
                      className={`mt-3 ${getFontSize(fontSize)}`}
                      dangerouslySetInnerHTML={{
                        __html: item?.text,
                      }}
                    ></p>
                  </div>
                ))}
            </div>
            <div className="sticky bottom-0 w-full bg-white py-2">
              <Button
                className="mx-auto "
                variant="solid"
                onClick={() => setIsDrawerRead(false)}
              >
                See questions
              </Button>
            </div>
          </Drawer>
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
        submitAnswer={submitAnswer}
        listGraded={listGraded}
        listQuestion={listQuestion}
        exitCurrentPage={exitCurrentPage}
        stayCurrentPage={stayCurrentPage}
        setPage={setPage}
        contentRef={rightRef}
        isPauseAllow={isPauseAllow}
        isDisabledSubmit={isDisabledSubmit}
      />
      <DialogBox
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
        sideEffectLeave={() => {}}
      />
      <Modal
        opened={showLoadingExam}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
        onClose={() => {}}
        className="z-[1201]"
        styles={{
          modal: {
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
        opened={showModalExpired as boolean}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
        className="z-[1201]"
        radius={15}
        size={500}
        onClose={() => {}}
      >
        <div className="py-8">
          <p className="text-center">Expiration time! Back to homepage</p>
          <div className="flex justify-center mt-10">
            <Button
              className="py-[10px]"
              onClick={() => {
                router.replace('/');
              }}
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={isPermission}
        centered
        withCloseButton={false}
        closeOnClickOutside={false}
        onClose={() => {}}
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

export default TestReading;
