/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
import { Divider, Loader, Modal, Pagination, Slider } from '@mantine/core';
import ContentTestLayout from '@/components/Layouts/ContentTest';
import MySlpit from '@/components/Layouts/SplitLayout';
import ModalVideoAI from '@/components/organisms/Exam/ModalVideoAI';
import TestAudio from '@/components/organisms/Exam/TestAudio';
import Button from '@/components/sharedV2/Button';
import LoadingExam from '@/components/sharedV2/LoadingExam';
import ZoomIn from '@/components/sharedV2/ZoomIn';
import DialogBox from '@/hooks/BeforeUnload';
import { useCallbackPrompt } from '@/hooks/BeforeUnload/useCallbackPrompt';
import {
  Clock,
  Maximize1,
  Maximize2,
  Microphone2,
  MicrophoneSlash,
  PlayCircle,
  VolumeCross,
  VolumeHigh,
  VolumeLow1,
} from 'iconsax-react';
const Person = '/images/Person.svg';
const recordBtn = '/images/recordBtn.svg';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AudioAnalyser from 'react-audio-analyser';
import { ReactMic } from 'react-mic';
import { useRouter } from 'next/router';
import {
  postExamPartContinueApi,
  postExamPartStartApi,
  postExamPartSubmit,
  uploadAudioFileApi,
} from '@/service/api/examConfig';
import styled, { keyframes } from 'styled-components';
import { getTimeCountdown } from '@/utils';
import { notify } from '@/utils/notify';
import { v4 as uuid } from 'uuid';

const IconBackward = '/images/backward.svg';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  ExamInfo,
  IdHistoryContest,
  IdHistoryRound,
  ListUserAudio,
} from '@/store/selector';
import { setIdHistoryRoundExam, setListUserAudio } from '@/store/slice/examInfo';
// import { getMockcontestHistoryApi } from '@/service/api/packageApi';
import { getMockcontestHistoryApi } from '@/service/api/examConfig';
import { TestType } from '@/enum';
import { LocalStorageService } from '@/services';

const timerPart = [30, 120, 60];
const timeToThinks = [5, 60, 5];

const TestSpeaking = () => {
  const id = uuid();
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = router.asPath;
  const params = router.query;
  const { idExam, idRound } = params;

  const examInfo = useSelector(ExamInfo, shallowEqual);
  const idHistoryContest = useSelector(IdHistoryContest, shallowEqual);
  const idHistoryRound = useSelector(IdHistoryRound, shallowEqual);
  const listUserAudioState = useSelector(ListUserAudio, shallowEqual) || [];
  const [showDialog, setShowDialog] = useState<boolean>(true);

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog);

  const [page, setPage] = useState(() => {
    return localStorage.getItem('page')
      ? Number(localStorage.getItem('page'))
      : 1;
  });
  const [timer, setTimer] = useState(timerPart[page - 1]);
  const [timeToThink, setTimeToThink] = useState(timeToThinks[page - 1]);
  const [startToThink, setStartToThink] = useState(false);
  const [listQuestion, setListQuestion] = useState<any>([]);
  const [indexCurrent, setIndexCurrent] = useState(() => {
    return localStorage.getItem('index-current')
      ? Number(localStorage.getItem('index-current'))
      : 0;
  });

  const [timeClickRefresh, setTimeRefresh] = useState<any>(null);
  const [showModalExpired, setShowModalExpired] = useState(false);
  const [recordAudio, setRecordAudio] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | Blob>('');
  const [actionQuestion, setActionQuestion] = useState<string>('');
  const [openModalWaitingSubmit, setOpenWaiting] = useState(false);
  const [showLoadingExam, setShowLoadingExam] = useState(true);
  const [isPermission, setIsPermission] = useState<boolean>(false);
  const [isVideoAI, setIsVideoAI] = useState<boolean>(false);
  const [videoAI, setVideoAI] = useState('');
  const [isPauseAllow, setIsPauseAllow] = useState<boolean>(false);
  const [listVideoAI, setListVideoAI] = useState<any>([]);

  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(1799);
  const [isVideoQuestion, setIsVideoQuestion] = useState<boolean>(false);
  const [isPlayIcon, setIsPlayIcon] = useState<boolean>(false);
  const [stateWidth, setStateWidth] = useState(window.innerWidth);
  // disable button record
  const [isDisabledRecord, setIsDisabledRecord] = useState<boolean>(false);

  const videoRef = useRef<any>();

  const durationTime = useMemo(() => {
    const minute = Math.floor(duration / 60);
    const second = duration % 60;
    if (minute < 1) {
      return `00:${second > 9 ? second : `0${second}`}`;
    } else {
      return `${minute > 9 ? minute : `0${minute}`}:${
        second > 9 ? second : `0${second}`
      }`;
    }
  }, [duration]);

  const current = useMemo(() => {
    const minute = Math.floor(currentTime / 60);
    const second = currentTime % 60;
    if (minute < 1) {
      return `00:${second > 9 ? second : `0${second}`}`;
    } else {
      return `${minute > 9 ? minute : `0${minute}`}:${
        second > 9 ? second : `0${second}`
      }`;
    }
  }, [currentTime]);

  const handleLoadedData = () => {
    setStartToThink(false);
    setDuration(Math.floor(videoRef.current.duration));
    videoRef.current.volume = volume;
    videoRef.current.muted = false;
    const playPromise = videoRef?.current.play();
    playPromise
      .then(() => {
        setIsPlayIcon(false);
      })
      .catch(() => {
        setIsPlayIcon(true);
      });
  };

  const handleVolumeSliderChange = (value: any) => {
    const volume = Number(value);
    videoRef.current.volume = volume;
    setVolume(volume);
  };

  const enterFullScreen = (element: any) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen(); // Firefox
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Safari
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE/Edge
    }
  };
  const exitFullScreen = (element: any) => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (element.mozCancelFullScreen) {
      element.mozCancelFullScreen(); // Firefox
    } else if (element.webkitExitFullscreen) {
      element.webkitExitFullscreen(); // Safari
    } else if (element.msExitFullscreen) {
      element.msExitFullscreen(); // IE/Edge
    }
  };

  const audioProps = {
    status: recordAudio ? 'recording' : 'inactive',
    audioType: 'audio/mp3',
    audioSrc: audioURL,
    timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
    startCallback: (e: any) => {},
    pauseCallback: (e: any) => {},
    stopCallback: (e: any) => {
      setAudioURL(window.URL.createObjectURL(e));
      if (actionQuestion == 'next')
        handleNextQuestion(window.URL.createObjectURL(e));
      else if (actionQuestion == 'submit')
        handleSubmit(window.URL.createObjectURL(e));
      else if (actionQuestion == 'prev')
        handlePrevQuestion(window.URL.createObjectURL(e));
    },
    onRecordCallback: (e: any) => {
      if (timeClickRefresh) {
        let duration = moment.duration(
          moment(new Date()).diff(moment(timeClickRefresh)),
        );
        let durationSeconds = duration.asSeconds();
        if (timer - Math.round(durationSeconds) >= 0) {
          setTimer(timer - Math.round(durationSeconds));
          setTimeRefresh(null);
        } else {
          postExamPartStartApi(Number(idExam), `${idHistoryContest}`, examInfo?.contest_type as number)
            .then(res => {
              if (res.data.data?.timeAllow > 0) {
                onClickNextQuestion();
              } else {
                setShowModalExpired(true);
              }
            })
            .catch(err => {
              setShowDialog(false);
              setShowModalExpired(true);
            });
        }
      }
    },
    errorCallback: (err: any) => {},
    width: 0,
    height: 0,
    backgroundColor: 'white',
  };

  const blinkAnimation = keyframes`
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `;

  const FlashingText: any = styled.span`
    animation: ${blinkAnimation} 1s linear infinite;
  `;

  const record = () => {
    setIsDisabledRecord(true);
    if (!recordAudio && audioURL) {
      setTimer(timerPart[page - 1]);
      setAudioURL('');
    } else if (!recordAudio && audioURL === '') {
      setTimeout(() => {
        setIsDisabledRecord(false);
      }, 300);
    }
    // setRecordAudio(prv => !prv);
    setTimeout(() => {
      setRecordAudio(prv => !prv);
    }, 200);
  };

  const handleRefresh = useCallback((e: any) => {
    setTimeRefresh(new Date());
  }, []);

  const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const uploadVoice = async (status: string, voidUrl: string) => {
    if (status == 'next') {
      setAudioURL('');
      setActionQuestion('');
      if (indexCurrent == listQuestion[page - 1].length - 1) {
        if (listQuestion[page][0]?.video) {
          setStartToThink(false);
        }
        setIndexCurrent(0);
        localStorage.setItem('index-current', '0');
        setPage(page + 1);
        localStorage.setItem('page', `${page + 1}`);
        setTimer(timerPart[page]);
        if (pathname.includes('/exam/')) {
          setTimeToThink(timeToThinks[page]);
        }
      } else {
        if (listQuestion[page - 1][indexCurrent + 1]?.video) {
          setStartToThink(false);
        }
        setIndexCurrent(indexCurrent + 1);
        localStorage.setItem('index-current', `${indexCurrent + 1}`);
        setTimer(timerPart[page - 1]);
        if (pathname.includes('/exam/')) {
          setTimeToThink(timeToThinks[page - 1]);
        }
      }
    } else if (status == 'prev') {
      setAudioURL('');
      setActionQuestion('');
      if (indexCurrent == 0) {
        if (listQuestion[page - 2][listQuestion[page - 2].length - 1]?.video) {
          setStartToThink(false);
        }
        setIndexCurrent(listQuestion[page - 2].length - 1);
        localStorage.setItem(
          'index-current',
          `${listQuestion[page - 2].length - 1}`,
        );
        setPage(page - 1);
        localStorage.setItem('page', `${page - 1}`);
        setTimer(timerPart[page - 2]);
      } else {
        if (listQuestion[page - 1][indexCurrent - 1]?.video) {
          setStartToThink(false);
        }
        setIndexCurrent(indexCurrent - 1);
        localStorage.setItem('index-current', `${indexCurrent - 1}`);
        setTimer(timerPart[page - 1]);
      }
    } else {
      setOpenWaiting(true);
    }
    if (status == 'next' && !voidUrl) return;
    if (status == 'prev' && !voidUrl) return;
    const audioBlob = await fetch(voidUrl).then(r => r.blob());
    blobToBase64(audioBlob).then(blob => {
      // const payload = {
      //   audio_base64: String(blob).replace('data:audio/wav;base64,', ''),
      //   audio_format: 'wav',
      // };
      // apiUploadFileLcat(payload)
      //   .then(res => {
      //     console.log('====================================');
      //     console.log('up load file', res);
      //     console.log('====================================');
      //   })
      //   .catch(err => {
      //     console.log('====================================');
      //     console.log('err upload file', err);
      //     console.log('====================================');
      //   });

      const payload = {
        idHistory: idHistoryRound,
        idQuestion: listQuestion[page - 1][indexCurrent].idQuestion,
        audio_base64_full: blob,
        contest_type: examInfo?.contest_type,
      };
      if (pathname.includes('/practice/')) {
        let arrListUserAudio = [...listUserAudioState];
        const userAudio = {
          idQuestion: listQuestion[page - 1][indexCurrent].idQuestion,
          audio: blob,
        };
        arrListUserAudio.push(userAudio);
        dispatch(setListUserAudio(arrListUserAudio));
      }
      uploadAudioFileApi(payload)
        .catch(er => {
          return;
        })
        .finally(() => {
          if (status == 'submit') {
            const payload = {
              idHistory: `${idHistoryRound}`,
              idMockContest: Number(idExam),
              idbaikiemtra: Number(params?.idRound),
              contest_type_id: examInfo?.contest_type as number,
              skill: TestType.Speaking,
              listUserAnswer: [],
            };
            postExamPartSubmit(payload)
              .then(res => {
                localStorage.removeItem('page');
                localStorage.removeItem('index-current');
                if (pathname.includes('/practice/')) {
                  router.push(
                    `/practice/speaking/${idExam}/${idHistoryContest}/answer-key`,
                  );
                  dispatch(setListUserAudio([]));
                } else {
                  if (res.data?.metadata?.allowed_mark_request) {
                    router.replace(`${pathname.replace('/test', '/wait-grading')}`);
                  } else {
                    router.replace(
                      `/${params.tenant}/${params.campaign}/${params.slug}/exam/result/${idExam}/${idHistoryContest}`,
                    );
                  }
                }
              })
              .catch(err => {
                router.replace('/');
                notify({
                  type: 'error',
                  message: 'Error! Please try again',
                  delay: 500,
                });
              });
          }
        });
    });
  };

  const handleNextQuestion = async (voidUrl: string) => {
    await uploadVoice('next', voidUrl);
  };

  const onClickNextQuestion = async () => {
    setIsVideoQuestion(false);
    setActionQuestion('next');
    if (recordAudio) {
      setRecordAudio(false);
    } else handleNextQuestion(String(audioURL));
  };

  const handlePrevQuestion = async (voidUrl: string) => {
    await uploadVoice('prev', voidUrl);
  };

  const onClickPrevQuestion = () => {
    setActionQuestion('prev');
    setIsVideoAI(false);
    if (recordAudio) {
      setRecordAudio(false);
    } else handlePrevQuestion(String(audioURL));
  };

  const handleSubmit = async (voidUrl: string) => {
    await uploadVoice('submit', voidUrl);
  };

  const onClickSubmitRound = async () => {
    setShowDialog(false);
    setActionQuestion('submit');
    // setRecordAudio(false);
    if (recordAudio) {
      setRecordAudio(false);
    } else handleSubmit(String(audioURL));
  };

  const exitCurrentPage = useCallback(() => {
    setShowDialog(false);
  }, [showDialog]);

  const confirmOutPage = useCallback(() => {
    setRecordAudio(false);
  }, [recordAudio]);

  useEffect(() => {
    videoRef?.current?.load();
    document.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
    window.addEventListener('resize', () => {
      setStateWidth(window.innerWidth);
    });
    let timerRotate: any;

    window.screen?.orientation?.addEventListener('change', (e: any) => {
      timerRotate = setTimeout(() => {
        setStateWidth(window.innerWidth);
      }, 100);
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
      window.screen?.orientation?.removeEventListener('change', () => {
        timerRotate = setTimeout(() => {
          setStateWidth(window.innerWidth);
        }, 100);
      });
      clearTimeout(timerRotate);
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
            (item: any) => item.testFormat === TestType.Speaking,
          );
          if (dataHistory[0].rounds[index]?.idHistory) {
            dispatch(
              setIdHistoryRoundExam(dataHistory[0].rounds[index].idHistory),
            );
            //continue part exam
            postExamPartContinueApi(dataHistory[0].rounds[index]?.idHistory, examInfo?.contest_type as number)
              .then(resContinue => {
                if (resContinue.status === 200 && resContinue.data.status) {
                  const listQuestion = Object.values(
                    resContinue?.data?.data?.listQuestion?.reduce(
                      (acc: any, item: any) => {
                        const { part } = item.speakLCAT;
                        acc[part] = acc[part] || [];
                        acc[part].push(item);
                        return acc;
                      },
                      {},
                    ),
                  );
                  setIsPauseAllow(
                    resContinue?.data?.data?.baikiemtra?.isPauseAllow,
                  );
                  setListQuestion(listQuestion);
                  pathname.includes('/exam/speaking') &&
                    setTimeRemaining(resContinue?.data?.data?.timeAllow);
                } else {
                  setIsPermission(true);
                }
              })
              .catch(err => console.log(err))
              .finally(() => setShowLoadingExam(false));
          } else {
            // start new part exam
            postExamPartStartApi(Number(params?.idRound), idHistoryContest, examInfo?.contest_type as number)
              .then(responseStart => {
                if (responseStart.status === 200 && responseStart.data.status) {
                  dispatch(
                    setIdHistoryRoundExam(responseStart?.data?.data?.idHistory),
                  );
                  const listQuestion = Object.values(
                    responseStart?.data?.data?.listQuestion?.reduce(
                      (acc: any, item: any) => {
                        const { part } = item.speakLCAT;
                        acc[part] = acc[part] || [];
                        acc[part].push(item);
                        return acc;
                      },
                      {},
                    ),
                  );
                  setIsPauseAllow(
                    responseStart?.data?.data?.baikiemtra?.isPauseAllow,
                  );
                  setListQuestion(listQuestion);
                  pathname.includes('/exam/speaking') &&
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
    if (listQuestion.length > 0) {
      let timeRemainingInterval: any;
      if (pathname.includes('exam/speaking')) {
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
    if (pathname.includes('exam/speaking')) {
      timeRemaining === 0 && onClickSubmitRound();
    }
  }, [timeRemaining]);

  //start record after countdown with exam
  useEffect(() => {
    if (startToThink) {
      const timeThink = setInterval(() => {
        if (timeToThink > 0) {
          setTimeToThink((prev: any) => prev - 1);
        } else {
          setRecordAudio(true);
          clearInterval(timeThink);
        }
      }, 1000);
      return () => {
        clearInterval(timeThink);
      };
    }
  }, [startToThink, timeToThink]);

  //stop record after countdown
  useEffect(() => {
    if (recordAudio) {
      const time = setInterval(() => {
        if (timer > 0) {
          setTimer((prev: any) => prev - 1);
        } else {
          setTimer(0);
          // if (pathname.includes('/practice/')) {
          //   setRecordAudio(false);
          // } else {
          //   if (
          //     page == listQuestion.length &&
          //     indexCurrent == listQuestion[page - 1].length - 1
          //   ) {
          //     onClickSubmitRound();
          //   } else {
          //     onClickNextQuestion();
          //   }
          // }
          clearInterval(time);
        }
      }, 1000);
      return () => {
        clearInterval(time);
      };
    }
  }, [recordAudio]);

  useEffect(() => {
    if (timer === 0) {
      if (pathname.includes('/practice/')) {
        setRecordAudio(false);
      } else {
        if (
          page == listQuestion.length &&
          indexCurrent == listQuestion[page - 1].length - 1
        ) {
          onClickSubmitRound();
        } else {
          onClickNextQuestion();
        }
      }
    }
  }, [timer]);

  useEffect(() => {
    if (listQuestion.length > 0) {
      if (pathname.includes('/exam/')) {
        if (listQuestion[page - 1][indexCurrent]?.description_video) {
          setIsVideoQuestion(false);
          setStartToThink(false);
          setIsVideoAI(true);
          setVideoAI(listQuestion[page - 1][indexCurrent]?.description_video);
        } else if (
          listQuestion[page - 1][indexCurrent]?.video ||
          listQuestion[page - 1][indexCurrent]?.audio
        ) {
          setStartToThink(false);
          setIsVideoQuestion(true);
          setIsVideoAI(false);
          setVideoAI('');
        } else {
          setIsVideoQuestion(false);
          setStartToThink(true);
          setIsVideoAI(false);
          setVideoAI('');
        }
      } else {
        setIsVideoQuestion(false);
        listUserAudioState?.map((item: any) => {
          if (
            item?.idQuestion ===
            listQuestion[page - 1][indexCurrent]?.idQuestion
          ) {
            setAudioURL(item?.audio);
          }
        });
        if (
          listQuestion[page - 1][indexCurrent]?.description_video &&
          !listVideoAI?.includes(
            listQuestion[page - 1][indexCurrent]?.description_video,
          )
        ) {
          setStartToThink(false);
          setIsVideoAI(true);
          setListVideoAI((prev: any) => {
            return [
              ...prev,
              listQuestion[page - 1][indexCurrent]?.description_video,
            ];
          });
          setVideoAI(listQuestion[page - 1][indexCurrent]?.description_video);
        }
      }
    }
    // if (pathname.includes('/exam/') && listQuestion.length > 0) {
    //   if (
    //     listQuestion[page - 1][indexCurrent]?.video ||
    //     listQuestion[page - 1][indexCurrent]?.audio
    //   ) {
    //     setStartToThink(false);
    //     // videoRef.current.play();
    //   } else setStartToThink(true);
    // }
    // if (
    //   listQuestion.length > 0 &&
    //   listQuestion[page - 1].length > 0 &&
    //   listQuestion[page - 1][indexCurrent]?.description_video
    // ) {
    //   setStartToThink(false);
    //   setIsVideoAI(true);
    //   setVideoAI(listQuestion[page - 1][indexCurrent]?.description_video);

    //   // pathname.includes('/exam/') &&
    //   //   listQuestion[page - 1][indexCurrent].video &&
    //   //   videoRef.current.pause();
    // } else {
    //   setIsVideoAI(false);
    //   setVideoAI('');
    // }
  }, [page, indexCurrent, listQuestion]);

  useEffect(() => {
    setTimeout(() => {
      setIsDisabledRecord(false);
    }, 200);
  }, [audioURL]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleRefresh);
    return () => {
      setRecordAudio(false);
      window.removeEventListener('beforeunload', handleRefresh);
    };
  }, []);

  const headerContent = () => {
    return (
      <div className="flex items-center space-x-2 sm:space-x-4 text-ct-primary-500">
        <span>{'Part'}</span>
        <Pagination
          key={`pagination-${page}`}
          defaultValue={page}
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

  const templateLeftContainer = () => {
    return (
      <div className="h-full overflow-y-auto px-4 lg:px-6 pb-6">
        <div className="flex items-center mb-[10px] mt-4">
          <img
            src={Person}
            alt=""
            width={25}
            height={25}
            className="mr-[16px]"
          />
          <h3 className="text-2xl">
            Part {page} -{' '}
            {page == 1
              ? 'Introduction and interview'
              : page == 2
              ? 'Individual long turn'
              : 'Two-way discussion'}
          </h3>
        </div>
        {pathname.includes('/practice/') ? (
          <div>Click on the recording button to start.</div>
        ) : (
          <div>
            You have {page === 2 ? '1 minute' : '5 seconds'} to prepare for your
            answer, after that the system will automatically record.
          </div>
        )}
        <div>
          You have a maximum of {timerPart[page - 1]} seconds to answer this
          question.
        </div>
        {pathname.includes('/practice/') ? (
          <div>
            If you wish to stop before {timerPart[page - 1]} seconds end, click
            on the recording button again.
          </div>
        ) : (
          <div>
            If you wish to stop before {timerPart[page - 1]} seconds end, click
            on to the next {page == 2 ? 'part' : 'question'}.
          </div>
        )}
        {pathname.includes('/practice/') && (
          <div>You can listen your recording and record again.</div>
        )}
        {page != 2 && (
          <div className="mt-[34px] mb-[16px] text-[22px]">
            Question {indexCurrent + 1}
          </div>
        )}
        {listQuestion && listQuestion[page - 1] && (
          <div id={id} className="mt-2 bg-white p-3 rounded-md text-[22px]">
            {listQuestion[page - 1][indexCurrent]?.video ? (
              ''
            ) : (
              <div
                className="select-none"
                dangerouslySetInnerHTML={{
                  __html: listQuestion[page - 1][indexCurrent]?.text,
                }}
              ></div>
            )}

            {listQuestion[page - 1][indexCurrent]?.image ? (
              <ZoomIn
                src={listQuestion[page - 1][indexCurrent]?.image}
                className="h-[200px] my-4 rounded-2xl"
                alt="IMG"
              />
            ) : (
              ''
            )}
            {listQuestion[page - 1][indexCurrent]?.audio ? (
              <audio
                src={listQuestion[page - 1][indexCurrent]?.audio}
                controls
                onEnded={() => setStartToThink(true)}
              ></audio>
            ) : (
              ''
            )}
            {listQuestion[page - 1][indexCurrent]?.video ? (
              pathname.includes('/practice') ? (
                <video
                  controls
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  src={listQuestion[page - 1][indexCurrent]?.video}
                  onLoadedData={() => setStartToThink(false)}
                  className="w-full rounded-xl"
                ></video>
              ) : (
                <>
                  <div
                    id="video-container"
                    className="relative video-container"
                  >
                    {isVideoQuestion && (
                      <>
                        <video
                          ref={videoRef}
                          src={listQuestion[page - 1][indexCurrent]?.video}
                          disablePictureInPicture
                          onEnded={() => setStartToThink(true)}
                          autoPlay
                          muted
                          playsInline
                          preload="metadata"
                          onLoadedMetadata={handleLoadedData}
                          onTimeUpdate={() => {
                            setCurrentTime(
                              Math.floor(videoRef.current.currentTime),
                            );
                          }}
                          className="w-full h-full rounded-xl"
                        ></video>
                        <div className="box-control w-full rounded-b-xl py-3 px-4 flex justify-between gap-4 items-center absolute bg-gradient-to-t from-black bottom-0 pt-6  transition duration-300 ease-linear opacity-0 invisible">
                          <p className="text-white text-sm">
                            {current} / {durationTime}
                          </p>
                          <div className="hidden lg:flex items-center flex-1 justify-end">
                            {volume > 0.5 ? (
                              <VolumeHigh
                                size="20"
                                color="#fff"
                                variant="Bold"
                              />
                            ) : volume > 0 ? (
                              <VolumeLow1
                                size="20"
                                color="#fff"
                                variant="Bold"
                              />
                            ) : (
                              <VolumeCross
                                size="20"
                                color="#fff"
                                variant="Bold"
                              />
                            )}
                            <Slider
                              className="w-24"
                              value={volume}
                              label={null}
                              min={0}
                              max={1}
                              step={0.1}
                              onChange={handleVolumeSliderChange}
                              classNames={{
                                track: 'h-1 rounded-full bg-white',
                                thumb: 'h-2 w-2 text-white border-white',
                                bar: '-left-1 bg-white',
                              }}
                              styles={() => ({
                                track: {
                                  ':before': {
                                    backgroundColor: '#bbb',
                                    right: '-4px',
                                    left: '-4px',
                                  },
                                },
                              })}
                            />
                          </div>
                          <div className="icon-size hidden lg:block">
                            <Maximize2
                              className="cursor-pointer icon-fullsize"
                              size="20"
                              color="#ffffff"
                              onClick={() =>
                                enterFullScreen(
                                  document.getElementById('video-container'),
                                )
                              }
                            />
                            <Maximize1
                              className="cursor-pointer icon-minisize hidden"
                              size="20"
                              color="#ffffff"
                              onClick={() =>
                                exitFullScreen(
                                  document.getElementById('video-container'),
                                )
                              }
                            />
                          </div>
                        </div>
                        {isPlayIcon && (
                          <PlayCircle
                            className="absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            size="48"
                            color="#111"
                            variant="Bulk"
                            onClick={() => {
                              setIsPlayIcon(false);
                              videoRef?.current?.play();
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </>
              )
            ) : (
              ''
            )}
          </div>
        )}

        {page === 2 &&
          listQuestion.length > 0 &&
          listQuestion[1][indexCurrent]?.video && (
            <div id={id} className="mt-3 bg-white p-3 rounded-md text-[22px]">
              <div
                className="select-none"
                dangerouslySetInnerHTML={{
                  __html: listQuestion[page - 1][indexCurrent]?.text,
                }}
              ></div>
            </div>
          )}
      </div>
    );
  };

  const leftContainer = () => {
    return <>{stateWidth > 1023 && templateLeftContainer()}</>;
  };

  const rightContainer = () => {
    return (
      <div className="h-full overflow-y-auto sm:px-4 bg-ct-neutral-200 lg:bg-white pb-16 lg:pb-6">
        {stateWidth < 1024 && (
          <div className="block lg:hidden">{templateLeftContainer()}</div>
        )}
        <div className="bg-white lg:bg-transparent sm:rounded-2xl lg:mt-10 lg:rounded-none px-1 py-4 pb-8 sm:p-4 sm:pb-10">
          <div className="hidden lg:flex items-center justify-center">
            <Button
              className="bg-white  hover:bg-ct-primary-500/[.001]"
              onClick={() => {}}
            >
              <img src={recordBtn} alt="" width={200} />
            </Button>
          </div>
          <div className="flex w-full mt-6 items-center justify-center">
            <div className="flex w-full sm:w-4/5 lg:w-5/6 xl:w-[75%] items-center justify-center px-2 py-[6px] rounded-full border-[1px] border-[#7893B0]">
              <Clock
                size="28"
                className="min-w-[28px]"
                color="#0056a4"
                variant="Bold"
              />
              <span className="text-[#0056a4] ml-1 text-xl sm:text-[22px]">
                {getTimeCountdown(timer)}
              </span>
              <Divider className="mx-3" orientation="vertical" />
              {!!audioURL ? (
                <div className="flex-1 text-[12px] text-[#7893B0]">
                  <TestAudio
                    srcAudio={audioURL.toString()}
                    showVolumeControl={false}
                    isStart={false}
                    durationAudio={timerPart[page - 1] - timer}
                    type="speaking-test"
                  />
                </div>
              ) : (
                <div className="flex flex-1 px-2 py-3 text-[12px] h-[32px] text-[#7893B0] items-center ">
                  <div className="flex-1 bg-white items-center">
                    <ReactMic
                      record={recordAudio}
                      visualSetting="frequencyBars"
                      className="sound-wave flex-1 h-[32px] w-full"
                      // onStop={onStop}
                      // onData={onData}
                      strokeColor="#0056a4"
                      backgroundColor="#fff"
                      mimeType="audio/wav"
                    />
                  </div>
                  <AudioAnalyser {...audioProps} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center h-[30px] mt-6">
            {recordAudio && (
              <FlashingText className="flex text-[#7893B0] items-center ">
                <div className=" rounded-full bg-[red] w-2 h-2 mr-1"></div>
                Recording ...
              </FlashingText>
            )}
          </div>

          {pathname.includes('/practice/') ? (
            <div className="flex flex-wrap items-center justify-center mt-6">
              {(page !== 1 || indexCurrent !== 0) && (
                <Button className="py-[10px]" onClick={onClickPrevQuestion}>
                  {listQuestion.length > 0 && indexCurrent == 0
                    ? 'Previous Part'
                    : 'Previous Question'}
                </Button>
              )}
              <div
                className={`order-first sm:order-none ${
                  page !== 1 || indexCurrent !== 0 ? 'w-full mb-2' : 'w-auto'
                } sm:w-auto sm:ml-2 sm:mb-0`}
              >
                <Button
                  className="!bg-[#FF2323] flex mx-auto !py-2"
                  onClick={record}
                  disabled={isDisabledRecord}
                >
                  {recordAudio ? (
                    <>
                      <MicrophoneSlash
                        className="cursor-pointer mr-2"
                        size="24"
                        color="#fff"
                        variant="Bold"
                      />{' '}
                      Stop
                    </>
                  ) : audioURL ? (
                    <>
                      <img
                        className="mr-1 w-[24px]"
                        src={IconBackward}
                        alt=""
                      />{' '}
                      Re-recording
                    </>
                  ) : (
                    <>
                      <Microphone2
                        className="cursor-pointer mr-2"
                        size="24"
                        color="#fff"
                        variant="Bold"
                      />{' '}
                      Record
                    </>
                  )}
                </Button>
              </div>
              <Button
                className="ml-2 py-[10px]"
                onClick={
                  page == listQuestion.length &&
                  indexCurrent == listQuestion[page - 1].length - 1
                    ? onClickSubmitRound
                    : onClickNextQuestion
                }
              >
                {page == listQuestion.length &&
                indexCurrent == listQuestion[page - 1].length - 1
                  ? 'Submit'
                  : listQuestion.length > 0 &&
                    indexCurrent == listQuestion[page - 1].length - 1
                  ? 'Next Part'
                  : 'Next question'}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center mt-6">
              {timeToThink > 0 ? (
                <Button className="flex mr-3 " onClick={() => {}}>
                  <span className="">
                    Time to think {getTimeCountdown(timeToThink)}
                  </span>
                </Button>
              ) : (
                <Button
                  className="p-0"
                  onClick={
                    page == listQuestion.length &&
                    indexCurrent == listQuestion[page - 1].length - 1
                      ? onClickSubmitRound
                      : onClickNextQuestion
                  }
                >
                  {page == listQuestion.length &&
                  indexCurrent == listQuestion[page - 1].length - 1
                    ? 'Submit'
                    : listQuestion.length > 0 &&
                      indexCurrent == listQuestion[page - 1].length - 1
                    ? 'Next Part'
                    : 'Next question'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const testContent = () => {
    return (
      <div className="flex h-full w-full">
        <div className="h-full overflow-hidden w-full pt-[62px] sm:pt-[64px]">
          <MySlpit leftContent={leftContainer} rightContent={rightContainer} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex select-none">
      <ContentTestLayout
        page={page}
        total={listQuestion?.length}
        type={'test'}
        showOpenDraw={false}
        childrenHeader={headerContent}
        childrenContent={testContent}
        showSubmitBtn={false}
        exitCurrentPage={exitCurrentPage}
        isPauseAllow={isPauseAllow}
      />
      <DialogBox
        showDialog={showPrompt}
        removeRecord={confirmNavigation}
        confirmNavigation={confirmOutPage}
        cancelNavigation={cancelNavigation}
        sideEffectLeave={() => {}}
      />
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
        opened={openModalWaitingSubmit as boolean}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
        radius={15}
        size={500}
        onClose={() => {}}
      >
        <div className="py-8 flex items-center justify-center">
          <Loader size="md" />
          <p className="text-center ml-3 text-xl ">Waiting to submit answer!</p>
        </div>
      </Modal>
      <Modal
        opened={showLoadingExam}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
        onClose={() => {}}
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
      <ModalVideoAI
        isOpen={isVideoAI}
        onClose={() => {
          setIsVideoAI(false);
          if (pathname.includes('/exam/') && listQuestion.length > 0) {
            if (listQuestion[page - 1][indexCurrent].video) {
              // videoRef.current.play();
              setIsVideoQuestion(true);
            } else setStartToThink(true);
          }
        }}
        videoAI={videoAI}
        page={page}
      />
    </div>
  );
};

export default TestSpeaking;
