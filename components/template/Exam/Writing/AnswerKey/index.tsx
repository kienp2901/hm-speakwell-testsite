/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
import { HoverCard, Modal, RingProgress, Text } from '@mantine/core';
import MoreInfo from '@/components/organisms/Exam/AnswerKey/MoreInfo';
import HeaderTest from '@/components/organisms/Exam/HeaderTest';
import SampleWriting from '@/components/organisms/Exam/SampleWriting';
import Button from '@/components/sharedV2/Button';
import LoadingExam from '@/components/shared/LoadingExam';
import { TestType } from '@/enum';
import { InfoCircle } from 'iconsax-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { LocalStorageService } from '@/services';
import { getHistoryDetail, sendToExaminerApi } from '@/service/api/examConfig';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { getTimeCountdown, removeEleComment } from '@/utils';
import { notify } from '@/utils/notify';

const AnswerKey = () => {
  const router = useRouter();
  const params = router.query;
  const { idExam, idHistory } = params;
  const dispatch = useDispatch();
  
  const pathname = router.asPath;

  const [metadataAnswer, setMetadataAnswer] = useState<any>();
  const [showLoadingExam, setShowLoadingExam] = useState<boolean>(false);
  const [redoStatus, setRedoStatus] = useState<boolean>(true);
  const [isScore, setIsScore] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(240);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [isWait, setIsWait] = useState<boolean>(false);
  const [isAIGrading, setIsAIGrading] = useState<boolean>(false);
  const [timeFinish, setTimeFinish] = useState<string>('');
  const checkNoScore = useMemo(() => {
    if (metadataAnswer && isScore && metadataAnswer?.lms_score) {
      return (
        metadataAnswer?.lms_score === -1 ||
        metadataAnswer?.writing[0]?.lms_score === -1 ||
        metadataAnswer?.writing[1]?.lms_score === -1
      );
    }
    return false;
  }, [metadataAnswer, isScore]);

  const clickReviewTask = (itemTask: any) => {
    navigate(
      `${pathname.replace('/answer-key', '/answer-task-detail')}/${
        itemTask?.idQuestion
      }`,
    );
  };

  const handleRedo = () => {
    if (
      !(LocalStorageService.get('historyPath') as string).includes(
        'exams-library',
      )
    ) {
      LocalStorageService.set('historyPath', `/exams-library`);
    }
    router.push(`/practice/writing/${idExam}/${metadataAnswer?.round_id}`);
  };

  const checkTimeout = (time_finish: string) => {
    if (
      new Date().getTime() / 1000 - new Date(time_finish).getTime() / 1000 >
      480
    ) {
      setIsTimeout(true);
    } else {
      setIsTimeout(false);
    }
  };

  const getExamHistoryDetail = async () => {
    await getHistoryDetail(`${idHistory}`)
      .then(res => {
        setMetadataAnswer(res.data.data?.rounds[0]);
        setRedoStatus(res.data?.data?.redo_status);
        setIsScore(res.data.data?.lms_score);
        // setTimer(240);
        !res?.data?.data?.lms_score && checkTimeout(res?.data.data?.timeFinish);
      })
      .catch(err => {
        setIsTimeout(true);
        notify({
          type: 'error',
          message: 'Have error please try again',
          delay: 500,
        });
        router.push('/history');
      })
      .finally(() => {});
  };

  const getExamHistoryPart = async () => {
    setShowLoadingExam(true);
    await getHistoryDetail(`${idHistory}`)
      .then(res => {
        setMetadataAnswer(res.data.data);
        setIsScore(res.data.data?.lms_score);
        // setTimer(240);
        !res?.data?.data?.lms_score &&
          checkTimeout(res?.data?.data?.timeFinish);
      })
      .catch(err => {
        setIsTimeout(true);
        notify({
          type: 'error',
          message: 'Have error please try again',
          delay: 500,
        });
        router.push('/history');
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (idHistory) {
      if (pathname.includes('/exam')) {
        setShowLoadingExam(true);
        getHistoryDetail(`${idHistory}`)
          .then(res => {
            if (res?.status === 200) {
              setMetadataAnswer(res.data.data);
              setIsScore(res.data.data?.lms_score || false);
              setTimeFinish(res?.data?.data?.timeFinish);
              !res?.data?.data?.lms_score &&
                checkTimeout(res?.data?.data?.timeFinish);
              const timeoutFinish =
                Math.floor(
                  new Date(res?.data?.data?.timeFinish).getTime() / 1000,
                ) + 2;
              const timeoutNow = Math.floor(new Date().getTime() / 1000);
              if (timeoutNow >= timeoutFinish) {
                setTimer(240 - ((timeoutNow - timeoutFinish) % 240));
              }
              setShowLoadingExam(false);
            } else {
              notify({
                type: 'error',
                message: res?.data?.message,
                delay: 500,
              });
              router.push('/history');
            }
          })
          .catch(err => {
            setIsTimeout(true);
            notify({
              type: 'error',
              message: 'Have error please try again',
              delay: 500,
            });
            router.push('/history');
          });
      } else {
        setShowLoadingExam(true);
        getHistoryDetail(`${idHistory}`)
          .then(res => {
            if (res?.data?.status === 200) {
              setMetadataAnswer(res.data.data?.rounds[0]);
              setRedoStatus(res.data?.data?.redo_status);
              setIsScore(res.data.data?.rounds[0].reviewed);
              setTimeFinish(res?.data.data?.time_finish);
              !res?.data?.data?.rounds[0]?.reviewed &&
                checkTimeout(res?.data.data?.time_finish);
              const timeoutFinish =
                Math.floor(
                  new Date(res?.data.data?.time_finish).getTime() / 1000,
                ) + 2;
              const timeoutNow = Math.floor(new Date().getTime() / 1000);
              if (timeoutNow >= timeoutFinish) {
                setTimer(240 - ((timeoutNow - timeoutFinish) % 240));
              }
              setShowLoadingExam(false);
            } else {
              notify({
                type: 'error',
                message: res?.data?.message,
                delay: 500,
              });
              router.push('/history');
            }
          })
          .catch(err => {
            setIsTimeout(true);
            notify({
              type: 'error',
              message: 'Have error please try again',
              delay: 500,
            });
            router.push('/history');
          });
      }
    }
  }, [idHistory]);

  useEffect(() => {
    let timerScoreAI: any;
    if (!showLoadingExam && !isScore && !isTimeout) {
      setIsWait(true);
      timerScoreAI = setInterval(() => {
        setTimer((prev: any) => prev - 1);
      }, 1000);
    } else if (!showLoadingExam && !isScore && isTimeout) {
      setIsAIGrading(true);
    } else {
      clearInterval(timerScoreAI);
      setTimer(240);
    }

    return () => {
      clearInterval(timerScoreAI);
    };
  }, [showLoadingExam, isTimeout, isScore]);

  useEffect(() => {
    if (timer < 240 && timer % 10 === 0) {
      if (pathname.includes('/exam')) getExamHistoryPart();
      else getExamHistoryDetail();
    }
    if (timer === 0) {
      setTimer(240);
      if (
        new Date().getTime() / 1000 - new Date(timeFinish).getTime() / 1000 <
        250
      ) {
        setIsWait(true);
      } else {
        setIsAIGrading(true);
      }
    }
  }, [timer]);

  // useEffect(() => {
  //   if (metadataAnswer) {
  //     setInterval(() => {
  //       setTimer((prev: any) => prev - 1);
  //     }, 1000);
  //   }
  // }, [metadataAnswer]);

  return (
    <div className="bg-[#EFF1F4] pt-[62px] sm:pt-16 fixed top-0 left-0 right-0 bottom-0">
      <HeaderTest
        type="answer-key"
        childrenHeader={() => {
          return <></>;
        }}
        showDrawer={false}
        showOpenDraw={false}
        isScore={isScore}
        isTimeout={isTimeout}
      />
      <div className="h-full overflow-y-auto scroll-smooth pt-8 pb-10">
        <div className="h-auto bg-white mx-4 sm:mx-6 lg:mx-28 rounded-2xl p-4 sm:p-6 lg:pl-20 lg:pr-28 lg:py-12">
          <div
            className={`flex items-center flex-col sm:flex-row sm:space-x-6 lg:space-x-28 ${
              (!isScore || checkNoScore) && 'justify-center'
            }`}
          >
            <div className="flex flex-col items-center py-6">
              <p className="text-[22px] mb-6">
                {isScore ? (
                  <>
                    Overall Score{' '}
                    <span className="text-ct-secondary-500">
                      (Scored by AI)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-ct-secondary-500">AI</span> is
                    Grading. Please wait...
                  </>
                )}
              </p>
              <RingProgress
                thickness={16}
                size={200}
                classNames={{
                  root: 'responsive-writing',
                }}
                roundCaps
                label={
                  <Text size="xs" align="center" className="font-black">
                    {isScore ? (
                      <p
                        className={`${
                          checkNoScore
                            ? 'text-2xl text-ct-neutral-700'
                            : 'text-5xl'
                        }`}
                      >
                        {checkNoScore ? 'No score' : metadataAnswer?.lms_score}
                      </p>
                    ) : (
                      <span className="text-2xl">
                        {getTimeCountdown(timer)}
                      </span>
                    )}
                  </Text>
                }
                sections={[
                  {
                    value: isScore
                      ? ((checkNoScore ? -1 : metadataAnswer?.lms_score) *
                          100) /
                        (metadataAnswer?.scale || 9)
                      : ((240 - timer) * 100) / 240,
                    color: checkNoScore ? '#E2EBF3' : '#0067C5',
                  },
                ]}
                rootColor="#E2EBF3"
              />
            </div>
            <div className={`flex-1 ${(!isScore || checkNoScore) && 'hidden'}`}>
              <MoreInfo
                testFormat={
                  metadataAnswer?.reviewed ? TestType.Reading : TestType.Writing
                }
                // state={state}
                metadataAnswer={metadataAnswer}
              />
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            {!pathname.includes('/exam/writing') && redoStatus && (
              <Button
                variant="outline"
                disabled={!isScore}
                onClick={handleRedo}
              >
                Redo
              </Button>
            )}
          </div>
        </div>
        {metadataAnswer?.listQuestion?.length > 0 && (
          <div className="h-auto mx-4 sm:mx-6 lg:mx-28 mt-6 flex sm:items-center flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-6">
            {metadataAnswer?.listQuestion?.map(
              (itemQuest: any, index: number) => {
                return (
                  <div key={index} className="flex-1 p-4 rounded-2xl bg-white">
                    <p className="text-2xl">Task {index + 1}</p>
                    <div
                      className={`${
                        checkNoScore ? 'hidden' : 'flex'
                      }  items-center justify-center space-x-4 lg:space-x-6`}
                    >
                      <p className="text-xl">
                        {isScore ? 'Band Score' : 'Waiting....'}
                      </p>
                      <RingProgress
                        size={85}
                        thickness={9}
                        roundCaps
                        label={
                          <Text
                            align="center"
                            className="font-black text-[24px] text-[#0067C5]"
                          >
                            {isScore && metadataAnswer?.writing.length > 0
                              ? metadataAnswer?.writing[
                                  itemQuest?.writingTask - 1
                                ].score || 0
                              : '...'}
                          </Text>
                        }
                        sections={[
                          {
                            value:
                              isScore && metadataAnswer?.writing.length > 0
                                ? ((metadataAnswer?.writing[
                                    itemQuest?.writingTask - 1
                                  ].score || 0) *
                                    100) /
                                  (metadataAnswer?.scale || 9)
                                : 0,
                            color: '#0067C5',
                          },
                        ]}
                        rootColor="#E2EBF3"
                      />
                    </div>
                    <div className="flex items-center mt-6 justify-center">
                      <Button
                        disabled={!isScore}
                        onClick={() =>
                          clickReviewTask(itemQuest)
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
        {/* note */}
        {isScore && !checkNoScore && (
          <div className="bg-white mx-4 sm:mx-6 lg:mx-28 mt-6 p-2 rounded-lg flex items-center">
            <InfoCircle size="32" color="#ff2323" variant="Bold" />
            <p className="text-sm italic break-words ml-2 flex-1">
              *The score given by the AI examiner is just for reference and may
              not match the official score. For an accurate assessment, it's
              best to consult qualified IELTS teachers.
            </p>
          </div>
        )}

        {/* Explain */}
        {/* <SampleWriting listQuestion={metadataAnswer?.questions} /> */}
        {/* Modal loading */}
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

        {/* Modal back writing */}
        <Modal
          opened={isWait}
          centered
          onClose={() => setIsWait(false)}
          closeOnClickOutside={false}
          className="min-w-[360px] z-[1201]"
          size={360}
          radius={'lg'}
          classNames={{
            header: 'mb-0',
            modal: 'p-3',
            close:
              'bg-ct-neutral-200 rounded-full text-ct-primary-400 min-w-[24px] min-h-[24px] w-6 h-6 hover:bg-ct-neutral-300 mr-2',
          }}
        >
          <div className="pb-6 pt-5">
            <p className="text-center px-4">
              The AI system is currently in the grading process; the test
              results will be sent shortly. Do you want to proceed?
            </p>
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                className="!px-4"
                variant="outline"
                onClick={async () => {
                  const ele = document.getElementsByTagName('audio');
                  if (ele.length > 0) {
                    ele[0].setAttribute('src', '');
                  }
                  dispatch(setListUserAnswer([]));
                  removeEleComment();
                  router.replace('/');
                }}
              >
                Back to homepage
              </Button>
              <Button className="!px-4" onClick={() => setIsWait(false)}>
                Continue waiting
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal over count */}
        <Modal
          opened={isAIGrading}
          centered
          onClose={() => setIsAIGrading(false)}
          withCloseButton={true}
          closeOnClickOutside={false}
          className="min-w-[360px] z-[1201]"
          size={360}
          radius={'lg'}
          classNames={{
            header: 'mb-0',
            modal: 'p-3',
            close:
              'bg-ct-neutral-200 rounded-full text-ct-primary-400 min-w-[24px] min-h-[24px] w-6 h-6 hover:bg-ct-neutral-300 mr-2',
          }}
        >
          <div className="pb-6 pt-5">
            <p className="text-center px-3">
              It might take a bit longer to grade your test, the results will be
              sent shortly. We appreciate your patience!
            </p>
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                className="!px-4"
                variant="outline"
                onClick={async () => {
                  const ele = document.getElementsByTagName('audio');
                  if (ele.length > 0) {
                    ele[0].setAttribute('src', '');
                  }
                  dispatch(setListUserAnswer([]));
                  removeEleComment();
                  router.replace('/');
                }}
              >
                Back to homepage
              </Button>
              <Button
                className="!px-4"
                onClick={async () => {
                  const ele = document.getElementsByTagName('audio');
                  if (ele.length > 0) {
                    ele[0].setAttribute('src', '');
                  }
                  dispatch(setListUserAnswer([]));
                  removeEleComment();
                  navigate(`/exams-library`, {
                    replace: true,
                  });
                }}
              >
                Take another test
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AnswerKey;
