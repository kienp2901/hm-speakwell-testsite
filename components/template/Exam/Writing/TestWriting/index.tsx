/* eslint-disable prefer-const */
import { Drawer, Modal, Pagination } from '@mantine/core';
import ContentTestLayout from '@/components/Layouts/ContentTest';
import MySlpit from '@/components/Layouts/SplitLayout';
import Button from '@/components/sharedV2/Button';
import LoadingExam from '@/components/sharedV2/LoadingExam';
import ZoomIn from '@/components/sharedV2/ZoomIn';
import DialogBox from '@/hooks/BeforeUnload';
import { useCallbackPrompt } from '@/hooks/BeforeUnload/useCallbackPrompt';
import { Clock, DocumentText } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  postExamPartStartApi,
  postExamPartSave,
  postExamPartContinueApi,
  postExamPartSubmit,
} from '@/service/api/examConfig';
import {
  ExamInfo,
  IdHistoryContest,
  IdHistoryRound,
  UserData,
} from '@/store/selector';
import { getTimeCountdown, wordCount } from '@/utils';
import { notify } from '@/utils/notify';
import { v4 as uuid } from 'uuid';
// import { getMockcontestHistoryApi } from '@/service/api/packageApi';
import { getMockcontestHistoryApi } from '@/service/api/examConfig';
import { TestType } from '@/enum';
import { setIdHistoryRoundExam } from '@/store/slice/examInfo';
import { LocalStorageService } from '@/services';
import { useDebouncedValue } from '@mantine/hooks';

let answerSelect: any[] = [];

const TestWriting = () => {
  const id = uuid();

  const router = useRouter();
  const pathname = router.asPath;
  const params = router.query;
  const { idExam, idRound } = params;
  const dispatch = useDispatch();

  const userInfo = useSelector(UserData, shallowEqual);
  const examInfo = useSelector(ExamInfo, shallowEqual);
  const idHistoryContest = useSelector(IdHistoryContest, shallowEqual);
  const idHistoryRound = useSelector(IdHistoryRound, shallowEqual);

  const [showDialog, setShowDialog] = useState<boolean>(true);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog);

  const [page, setPage] = useState(1);
  const [valueInput, setValueInput] = useState('');
  const [debouncedValueInput] = useDebouncedValue(valueInput, 500);

  const [listQuestion, setListQuestion] = useState<any>([]);
  const [timer, setTimer] = useState<number>(3599);
  const [showModalExpired, setShowModalExpired] = useState(false);
  const [showLoadingExam, setShowLoadingExam] = useState(false);
  const [showModalSubmitExam, setShowModalSubmitExam] = useState(false);
  const [timeVisibility, setTimeVisibility] = useState<string>('hidden');
  const [isPermission, setIsPermission] = useState<boolean>(false);
  const [isUnlimited, setIsUnlimited] = useState<string>('');
  const [timerUnlimited, setTimerUnlimited] = useState(0);
  const [isPauseAllow, setIsPauseAllow] = useState<boolean>(false);
  const [isDrawerRead, setIsDrawerRead] = useState<boolean>(false);
  const [isDisabledSubmit, setIsDisabledSubmit] = useState<boolean>(false);
  const [isWorkBlank, setIsWorkBlank] = useState<boolean>(false);
  const [isWorkLimit, setIsWorkLimit] = useState<boolean>(false);

  const onClickPrevQuestion = () => {
    if (window.innerWidth < 1024) {
      setIsDrawerRead(true);
    }
    if (answerSelect.length == 0) {
      setPage(page - 1);
      setValueInput('');
    } else {
      let prevQuesIndex = answerSelect.findIndex(
        item => item?.idQuestion === listQuestion[page - 2]?.idQuestion,
      );
      setPage(page - 1);
      setValueInput(answerSelect[prevQuesIndex]?.answer || '');
    }
  };

  const onClickNextQuestion = () => {
    if (window.innerWidth < 1024) {
      setIsDrawerRead(true);
    }
    if (answerSelect.length == 0) {
      setPage(page + 1);
      setValueInput('');
    } else {
      let nextQuesIndex = answerSelect.findIndex(
        item => item?.idQuestion === listQuestion[page]?.idQuestion,
      );
      setPage(page + 1);
      setValueInput(answerSelect[nextQuesIndex].answer);
    }
  };

  const onClickSelectPart = (pageNum: number) => {
    if (window.innerWidth < 1024) {
      setIsDrawerRead(true);
    }
    if (answerSelect.length == 0) {
      setPage(pageNum);
      setValueInput('');
    } else {
      let nextQuesIndex = answerSelect.findIndex(
        item => item?.idQuestion === listQuestion[pageNum - 1]?.idQuestion,
      );
      setPage(pageNum);
      setValueInput(answerSelect[nextQuesIndex].answer);
    }
  };

  const saveAnswerUser = async () => {
    if(!idHistoryRound) return
    const params = JSON.stringify({
      contest_type: examInfo?.contest_type,
      listUserAnswer: [...answerSelect],
      idHistory: idHistoryRound,
    });

    await postExamPartSave(params);
  };

  const submitAnswer = async () => {
    setIsDisabledSubmit(true);
    setShowDialog(false);
    if (valueInput) {
      if (answerSelect.length == 0) {
        const item = {
          answer: valueInput,
          idQuestion: listQuestion[page - 1]?.idQuestion,
          task_number: listQuestion[page - 1]?.writingTask,
        };
        answerSelect.push(item);
      } else {
        let currentIndex = answerSelect.findIndex(
          item => item?.idQuestion === listQuestion[page - 1]?.idQuestion,
        );
        if (currentIndex != -1) answerSelect[currentIndex].answer = valueInput;
        else {
          const item = {
            answer: valueInput,
            idQuestion: listQuestion[page - 1]?.idQuestion,
            task_number: listQuestion[page - 1]?.writingTask,
          };
          answerSelect.push(item);
        }
      }
    }

    const payload = {
      idHistory: `${idHistoryRound}`,
      quiz_id: Number(examInfo?.quiz_id),
      idbaikiemtra: Number(params?.idRound),
      contest_type_id: examInfo?.contest_type as number,
      skill: TestType.Writing,
      listUserAnswer: answerSelect,
    };

    await postExamPartSubmit(payload)
      .then(res => {
        if (pathname.includes('/practice/writing')) {
          router.push(
            `/practice/writing/${idExam}/${res.data?.metadata?.history_id}/answer-key`,
          );
        } else {
          const idRound = examInfo?.rounds?.find(
            (item: any) => item.test_format === 16,
          )?.id;
          router.replace(`/${params.tenant}/${params.campaign}/${params.slug}/exam/speaking/${idExam}/${idRound}`);
        }
      })
      .catch(err => {
        setIsDisabledSubmit(false);
        notify({
          type: 'error',
          message: 'Has error. Please try again',
          delay: 1000,
        });
        router.replace('/');
      });
  };

  const exitCurrentPage = () => {
    setShowDialog(false);
  };

  const stayCurrentPage = () => {
    setShowDialog(true);
  };

  useEffect(() => {
    if (userInfo?.email.includes('@hocmai.vn')) return;

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
    };
  }, [userInfo]);

  useEffect(() => {
    document.addEventListener('visibilitychange', function () {
      setTimeVisibility(document.visibilityState);
    });
    document.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    return () => {
      document.removeEventListener('visibilitychange', function () {
        setTimeVisibility(document.visibilityState);
      });
      window.removeEventListener('contextmenu', event => {
        event.preventDefault();
      });
    };
  }, []);

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
            (item: any) => item.testFormat === TestType.Writing,
          );
          if (dataHistory[0].rounds[index]?.idHistory) {
            //continue part exam
            dispatch(
              setIdHistoryRoundExam(dataHistory[0].rounds[index]?.idHistory),
            );
            postExamPartContinueApi(
              dataHistory[0].rounds[index]?.idHistory,
              examInfo?.contest_type as number,
            )
              .then(resContinue => {
                if (resContinue.status === 200 && resContinue.data.status) {
                  if (pathname.includes('practice/writing')) {
                    setIsUnlimited('unlimit');
                    setTimerUnlimited(1);
                  } else {
                    setIsUnlimited('limit');
                    setTimer(resContinue?.data?.data?.timeAllow);
                  }
                  setIsPauseAllow(
                    resContinue?.data?.data?.baikiemtra?.isPauseAllow,
                  );

                  setListQuestion(resContinue?.data?.data?.listQuestion);
                  if (resContinue?.data?.data?.listUserAnswer?.length > 0) {
                    answerSelect = [];
                    resContinue?.data?.data?.listUserAnswer?.map(
                      (itemAnswer: any) => {
                        answerSelect.push({
                          answer: itemAnswer?.userAnswer,
                          idQuestion: itemAnswer?.idQuestion,
                          task_number:
                            resContinue?.data?.data?.listQuestion.find(
                              (item: any) =>
                                item.idQuestion == itemAnswer?.idQuestion,
                            ).writingTask,
                        });
                      },
                    );
                    // answerSelect = [...new Set(answerSelect)];
                    const firstQuesIndex = answerSelect.findIndex(
                      (item: any) =>
                        item?.idQuestion ===
                        resContinue?.data?.data?.listQuestion[0]?.idQuestion,
                    );
                    firstQuesIndex !== -1
                      ? setValueInput(answerSelect[firstQuesIndex]?.answer)
                      : setValueInput('');
                  } else {
                    answerSelect = [];
                    resContinue?.data?.data?.listQuestion?.length > 0 &&
                      resContinue?.data?.data?.listQuestion?.map(
                        (item: any) => {
                          answerSelect.push({
                            answer: '',
                            idQuestion: item?.idQuestion,
                            task_number: item?.writingTask,
                          });
                        },
                      );
                  }
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
                  if (pathname.includes('practice/writing')) {
                    setIsUnlimited('unlimit');
                    setTimerUnlimited(1);
                  } else {
                    setIsUnlimited('limit');
                    setTimer(responseStart?.data?.data?.timeAllow);
                  }
                  setIsPauseAllow(
                    responseStart?.data?.data?.baikiemtra?.isPauseAllow,
                  );

                  setListQuestion(responseStart?.data?.data?.listQuestion);
                  if (responseStart?.data?.data?.listUserAnswer?.length > 0) {
                    answerSelect = [];
                    responseStart?.data?.data?.listUserAnswer?.map(
                      (itemAnswer: any) => {
                        answerSelect.push({
                          answer: itemAnswer?.userAnswer,
                          idQuestion: itemAnswer?.idQuestion,
                          task_number: itemAnswer?.writingTask,
                        });
                      },
                    );
                    // answerSelect = [...new Set(answerSelect)];
                    const firstQuesIndex = answerSelect.findIndex(
                      (item: any) =>
                        item?.idQuestion ===
                        responseStart?.data?.data?.listQuestion[0]?.idQuestion,
                    );
                    firstQuesIndex !== -1
                      ? setValueInput(answerSelect[firstQuesIndex]?.answer)
                      : setValueInput('');
                  } else {
                    answerSelect = [];
                    responseStart?.data?.data?.listQuestion?.length > 0 &&
                      responseStart?.data?.data?.listQuestion?.map(
                        (item: any) => {
                          answerSelect.push({
                            answer: '',
                            idQuestion: item?.idQuestion,
                            task_number: item?.writingTask,
                          });
                        },
                      );
                  }
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
      let time = setInterval(() => {
        if (timer > 0) {
          setTimer((prev: any) => prev - 1);
        } else {
          clearInterval(time);
        }
      }, 1000);
      return () => {
        clearInterval(time);
      };
    }
  }, [isUnlimited]);

  useEffect(() => {
    if (isUnlimited === 'limit') {
      if (
        Math.floor(Date.now() / 1000) -
          Number(localStorage.getItem('time_start')) ===
          3596 ||
        timer === 0
      ) {
        submitAnswer();
      } else if (
        Math.floor(Date.now() / 1000) -
          Number(localStorage.getItem('time_start')) >
        3596
      ) {
        setShowModalExpired(true);
      }
    }
  }, [timer]);

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
    if (answerSelect.length == 0) {
      if (debouncedValueInput) {
        const item = {
          answer: debouncedValueInput,
          idQuestion: listQuestion[page - 1]?.idQuestion,
          task_number: listQuestion[page - 1]?.writingTask,
        };
        answerSelect.push(item);
      }
      saveAnswerUser();
    } else {
      let currentIndex = answerSelect.findIndex(
        item => item?.idQuestion === listQuestion[page - 1]?.idQuestion,
      );
      if (currentIndex != -1)
        answerSelect[currentIndex].answer = debouncedValueInput;
      else {
        const item = {
          answer: debouncedValueInput,
          idQuestion: listQuestion[page - 1]?.idQuestion,
          task_number: listQuestion[page - 1]?.writingTask,
        };
        answerSelect.push(item);
      }
      saveAnswerUser();
    }
  }, [debouncedValueInput]);

  const headerContent = () => {
    return (
      <div className="flex items-center space-x-2 sm:space-x-4 text-ct-primary-500">
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
        <span>{'Task'}</span>
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
          onChange={page => onClickSelectPart(page)}
        />
      </div>
    );
  };

  const leftContainer = () => {
    return (
      <div className="h-full pt-[64px] relative flex flex-col justify-between">
        <div className="h-full p-6 overflow-y-auto scroll-smooth">
          <div className="flex items-center mb-[10px]">
            <h3 className="text-2xl">Task {page}</h3>
          </div>
          {listQuestion && listQuestion[page - 1] && (
            <div
              id={id}
              className="question-writing p-3 rounded-md text-[22px]"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: listQuestion[page - 1].text,
                }}
              ></div>
              {listQuestion[page - 1]?.image ? (
                <div className="flex items-center">
                  <ZoomIn
                    src={listQuestion[page - 1]?.image}
                    className="h-[500px] my-4 rounded-2xl"
                    alt="IMG"
                  />
                </div>
              ) : (
                ''
              )}
              {listQuestion[page - 1]?.audio ? (
                <audio src={listQuestion[page - 1]?.audio} controls></audio>
              ) : (
                ''
              )}
              {listQuestion[page - 1]?.video ? (
                <video
                  src={listQuestion[page - 1]?.video}
                  controls
                  className="w-[560px] h-[315px] rounded-xl"
                ></video>
              ) : (
                ''
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 w-full px-4 py-3 flex items-center justify-between bg-white">
          <Button
            className="bg-white"
            variant="outline"
            disabled={page === 1}
            onClick={onClickPrevQuestion}
          >
            Previous Task
          </Button>
          <Button
            disabled={page === listQuestion?.length}
            onClick={onClickNextQuestion}
          >
            Next Task
          </Button>
        </div>
      </div>
    );
  };

  const rightContainer = () => {
    return (
      <div className="h-full bg-ct-neutral-200 pt-[64px] pb-[62px] sm:pb-[64px] lg:pb-0 relative">
        <div className="h-full overflow-y-auto scroll-smooth p-4 sm:p-6 relative">
          <div
            className="fixed top-20 right-4 sm:right-6 cursor-pointer px-2 min-w-10 h-10 bg-ct-tertiary-600 rounded-full inline-flex items-center justify-center lg:hidden"
            onClick={() => setIsDrawerRead(true)}
          >
            <DocumentText color="#ffffff" variant="Bold" />
            <span className="read-here text-white font-medium text-sm">
              &nbsp;&nbsp;See question
            </span>
          </div>
          <h3 className="text-2xl">Task {page}</h3>
          <p className="text-[16px]">
            You have entered {valueInput ? wordCount(valueInput) : 0} word(s)
          </p>
          <textarea
            className="rounded-2xl border-2 border-[black] focus:border-[black] p-2"
            value={valueInput}
            onChange={event => {
              if (wordCount(event.target.value) > 500) {
                notify({
                  type: 'error',
                  message: 'You did not meet the required 500 words limit.',
                  delay: 500,
                });
              } else {
                setValueInput(event.target.value);
              }
            }}
            style={{ width: '100%', height: '88%', resize: 'none' }}
            spellCheck={false}
            placeholder="Min 21 words; max 500 words"
          />
        </div>
        <div className="bg-white absolute bottom-0 w-full px-4 py-3 flex lg:hidden items-center justify-between">
          <Button
            className="bg-white"
            variant="outline"
            disabled={page === 1}
            onClick={onClickPrevQuestion}
          >
            Previous Task
          </Button>
          <div className="flex lg:hidden items-center border border-ct-primary-500 rounded-2xl px-2 py-1">
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
            onClick={onClickNextQuestion}
          >
            Next Task
          </Button>
        </div>
      </div>
    );
  };

  const testContent = () => {
    return (
      <div className="flex h-full w-full">
        <div className="h-full overflow-hidden w-full">
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
            <div className="px-2 pt-4 sm:p-4 pb-8">
              <div className="flex items-center mb-1 sm:mb-2">
                <h3 className="text-2xl">Task {page}</h3>
              </div>
              {listQuestion && listQuestion[page - 1] && (
                <div
                  id={id}
                  className="question-writing p-2 rounded-md text-[22px]"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: listQuestion[page - 1].text,
                    }}
                  ></div>
                  {listQuestion[page - 1]?.image ? (
                    <div className="flex items-center">
                      <ZoomIn
                        src={listQuestion[page - 1]?.image}
                        className="h-[500px] my-4 rounded-2xl"
                        alt="IMG"
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  {listQuestion[page - 1]?.audio ? (
                    <audio src={listQuestion[page - 1]?.audio} controls></audio>
                  ) : (
                    ''
                  )}
                  {listQuestion[page - 1]?.video ? (
                    <video
                      src={listQuestion[page - 1]?.video}
                      controls
                      className="w-[560px] h-[315px] rounded-xl"
                    ></video>
                  ) : (
                    ''
                  )}
                </div>
              )}
            </div>
            <div className="sticky bottom-0 w-full bg-white py-2">
              <Button
                className="mx-auto "
                variant="solid"
                onClick={() => setIsDrawerRead(false)}
              >
                Type answer
              </Button>
            </div>
          </Drawer>
        </div>
      </div>
    );
  };

  return (
    <div className="flex select-none">
      <ContentTestLayout
        submitAnswer={() => {
          if (answerSelect[0]?.answer === '' && valueInput === '') {
            setIsWorkBlank(true);
          } else if (
            (answerSelect.length > 1 &&
              wordCount(answerSelect[0]?.answer) < 21) ||
            wordCount(valueInput) < 21
          ) {
            setIsWorkLimit(true);
          } else if (
            wordCount(answerSelect[0]?.answer) > 500 ||
            wordCount(valueInput) > 500
          ) {
            notify({
              type: 'error',
              message: 'You did not meet the required 500 words limit.',
              delay: 500,
            });
          } else {
            setShowModalSubmitExam(true);
          }
        }}
        page={page}
        total={listQuestion?.length}
        type={'test'}
        showOpenDraw={false}
        childrenHeader={headerContent}
        childrenContent={testContent}
        exitCurrentPage={exitCurrentPage}
        stayCurrentPage={stayCurrentPage}
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
        opened={showModalSubmitExam as boolean}
        withCloseButton={false}
        centered
        size={360}
        radius={'lg'}
        onClose={() => {}}
      >
        <div className="py-8">
          <p className="text-center">
            You still have time to finish the test. Do you want to move on?
          </p>
          <div className="flex justify-center space-x-4 mt-10">
            <Button
              variant="outline"
              className="py-[9px]"
              onClick={() => setShowModalSubmitExam(false)}
            >
              No, Take me back
            </Button>
            <Button
              disabled={isDisabledSubmit}
              className="py-[10px]"
              onClick={submitAnswer}
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
        opened={showLoadingExam}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
        onClose={() => {}}
        zIndex={1201}
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
      {/* Modal work blank */}
      <Modal
        opened={isWorkBlank}
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
            Make sure not to leave your work blank before you submit.
          </p>
          <div className="mt-8">
            <Button className="mx-auto" onClick={() => setIsWorkBlank(false)}>
              Go back
            </Button>
          </div>
        </div>
      </Modal>
      {/* Modal word limit */}
      <Modal
        opened={isWorkLimit}
        centered
        withCloseButton={true}
        closeOnClickOutside={false}
        onClose={() => setIsWorkLimit(false)}
        className="min-w-[360px] z-[1202]"
        size={360}
        radius={'lg'}
        classNames={{
          header: 'mb-0',
          close:
            'bg-ct-neutral-200 rounded-full text-ct-primary-400 min-w-[24px] min-h-[24px] w-6 h-6 hover:bg-ct-neutral-300',
        }}
      >
        <div className="py-4">
          <p className="text-center px-8">
            You did not meet the required word limit. Please check your work.
          </p>
          <div className="mt-6">
            <Button className="mx-auto" onClick={() => setIsWorkLimit(false)}>
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TestWriting;
