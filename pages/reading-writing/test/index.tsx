import { Button, Progress, Modal } from '@mantine/core';
import ReadingAnswer from '@/components/Question/ReadingAnswer';
import BaseLayout from '@/components/layout/Base';
import { ArrowCircleRight } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Countdown from 'react-countdown';
import React, {
  memo,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  examContinueApi,
  examSaveApi,
  examStartApi,
  examSubmitApi,
  sendEmailResultApi,
} from '@/service/api/contest';
import {
  StudentId,
  IdHistoryContest,
  IdBaikiemtraRW,
  IdHistory,
  ListUserAnswer,
  ListUserAnswerDraft,
  IsModalInfo,
  IdMockContest,
} from '@/store/selector';
import FillBlank from '@/components/Question/FillBlank';
import {
  setIdHistory,
  setIsModalInfo,
  setListUserAnswer,
  setListUserAnswerDraft,
} from '@/store/slice/examInfo';
import YesNoAnswer from '@/components/Question/YesNoAnswer';
import DragDrop from '@/components/Question/DragDrop';
import { toast } from 'react-toastify';
import { Notify } from '@/ultils/notify';

const ReadingWritingTest: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const clockRef = useRef<Countdown>(null);
  const studentId = useAppSelector(StudentId, shallowEqual);
  const idMockContest = useAppSelector(IdMockContest, shallowEqual);
  const historyContestId = useAppSelector(IdHistoryContest, shallowEqual);
  const idHistory = useAppSelector(IdHistory, shallowEqual);
  const idExamRW = useAppSelector(IdBaikiemtraRW, shallowEqual);
  const listUserAnswerDraft = useAppSelector(ListUserAnswerDraft, shallowEqual);
  const listUserAnswer = useAppSelector(ListUserAnswer, shallowEqual);
  const isModalInfo = useAppSelector(IsModalInfo, shallowEqual);

  const [contentQuestion, setContentQuestion] = useState<React.ReactNode>();
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [listQuestionExam, setListQuestion] = useState<any[]>([]);
  const [isAnswerQuestion, setIsAnswerQuestion] = useState(false);
  const [numberDone, setNumberDone] = useState(0);
  const [timeAllow, setTimeAllow] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showModalTimeout, setShowModalTimeout] = useState(false);
  const [showModalNext, setShowModalNext] = useState(false);
  const [showModalOverTime, setShowModalOverTime] = useState(false);

  const renderTime = useMemo(() => {
    return Date.now() + timeAllow * 1000;
  }, [timeAllow]);

  useEffect(() => {
    if (idHistory) {
      examContinueApi(studentId, idHistory)
        .then((res) => {
          if (res.status == 200) {
            if (res?.data.status == 200) {
              var dataExam = res?.data?.metadata;
              setListQuestion(dataExam?.listQuestion);
              setTimeAllow(dataExam?.timeAllow);

              let convertData = dataExam?.listUserAnswer?.map((itemAnswer: any) => ({
                idQuestion: itemAnswer?.idQuestion,
                answer: itemAnswer?.userAnswer,
              }));
              dispatch(setListUserAnswerDraft([]));
              dispatch(setListUserAnswer([...convertData]));
              if (dataExam?.listUserAnswer?.length > 0) {
                let indexCurrent = dataExam?.listQuestion.findIndex(
                  (item: any) =>
                    item?.idQuestion == dataExam?.listUserAnswer[0].idQuestion,
                );
                setIndexQuestion(indexCurrent);
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (idExamRW) {
      examStartApi(studentId, historyContestId, idExamRW)
        .then((res) => {
          if (res.status == 200) {
            if (res?.data.status == 200) {
              var dataExam = res?.data?.metadata;
              setListQuestion(dataExam?.listQuestion);
              setTimeAllow(dataExam?.timeAllow);
              dispatch(setIdHistory(dataExam?.idHistory));
              dispatch(setListUserAnswer([]));
              dispatch(setListUserAnswerDraft([]));
            }
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [historyContestId, idHistory, studentId, idExamRW, dispatch]);

  const handleVisibilityChange = useCallback(() => {
    if (idHistory && document.visibilityState === 'visible') {
      examContinueApi(studentId, idHistory)
        .then((res) => {
          if (res.status == 200) {
            if (res?.data.status == 200) {
              var dataExam = res?.data?.metadata;
              setTimeAllow(dataExam?.timeAllow);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [idHistory, studentId]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  const renderTimeRemaining = (props: any) => {
    return (
      <p className="text-[16px] font-mikakoBold">
        {props.hours * 60 + props.minutes} phút {props.seconds} giây
      </p>
    );
  };

  const renderCountdown = () => {
    if (timeAllow) {
      return (
        <Countdown
          ref={clockRef}
          intervalDelay={800}
          date={renderTime}
          renderer={renderTimeRemaining}
          onComplete={overTime}
          onTick={onTicktac}
        />
      );
    }
  };

  const onTicktac = (dataTime: any) => {
    if (dataTime?.total != 0 && dataTime.seconds % 10 == 0) {
      if (listUserAnswerDraft?.length > 0) {
        examSaveApi(studentId, {
          idHistory: idHistory,
          listUserAnswer: [...listUserAnswerDraft],
        }).then((res) => {
          if (res?.status == 200) {
            dispatch(setListUserAnswerDraft([]));
          }
        });
      }
    }
  };

  const onClickNext = () => {
    if (indexQuestion < listQuestionExam.length - 1) {
      setIndexQuestion((prev) => prev + 1);
      setIsAnswerQuestion(false);
      setShowModalNext(false);
    } else {
      onSubmit();
    }
  };

  const onSubmit = async () => {
    const response = await examSubmitApi(studentId, {
      idHistory: idHistory,
      listUserAnswer: listUserAnswer,
    });
    if (response.data.message === 'OK') {
      router.replace('/result');
      sendEmailResultApi(studentId, idHistory, idMockContest, historyContestId);
      setTimeout(() => {
        dispatch(setListUserAnswer([]));
        dispatch(setListUserAnswerDraft([]));
        dispatch(setIdHistory(''));
      }, 1000);
    } else {
      Notify({
        type: 'error',
        message: 'Không nộp được bài do quá giờ hoặc có lỗi xảy ra',
      });
    }
  };

  const overTime = async () => {
    setShowModalOverTime(true);
    const response = await examSubmitApi(studentId, {
      idHistory: idHistory,
      listUserAnswer: listUserAnswer,
    });
    if (response.data.message === 'OK') {
      sendEmailResultApi(studentId, idHistory, idMockContest, historyContestId);
    } else {
      Notify({
        type: 'error',
        message: 'Không nộp được bài do quá giờ hoặc có lỗi xảy ra',
      });
    }
  };

  useEffect(() => {
    if (listQuestionExam.length > 0 && listUserAnswer.length > 0) {
      let numberDoneTemp = 0;
      listUserAnswer.map((item) => {
        let typeQuest = listQuestionExam?.find(
          (itemQuest) => itemQuest?.idQuestion == item?.idQuestion,
        )?.quiz_type;
        if (typeQuest == 6) {
          numberDoneTemp = numberDoneTemp + item.answer.length;
        } else {
          numberDoneTemp = numberDoneTemp + 1;
        }
      });
      setNumberDone(numberDoneTemp);
      let indexAnswer = listUserAnswer.findIndex(
        (itemAnswer) =>
          itemAnswer?.idQuestion == listQuestionExam[indexQuestion]?.idQuestion,
      );
      console.log(indexAnswer, listQuestionExam[indexQuestion]);
      if (indexAnswer != -1) {
        if (listQuestionExam[indexQuestion]?.quiz_type == 6) {
          if (
            listUserAnswer[indexAnswer].answer.length ==
            listQuestionExam[indexQuestion]?.listQuestionChildren.length
          ) {
            setIsAnswerQuestion(true);
          }
        } else {
          setIsAnswerQuestion(true);
        }
      }
    }
  }, [listUserAnswer, listQuestionExam, indexQuestion]);

  useEffect(() => {
    if (listQuestionExam?.length > 0) {
      let itemQuestion: React.ReactNode = <></>;
      switch (true) {
        case indexQuestion < 2:
          itemQuestion = (
            <DragDrop
              key={'drag_drop_' + listQuestionExam[indexQuestion].idQuestion}
              question={listQuestionExam[indexQuestion]}
            />
          );
          break;
        case indexQuestion < 5:
          itemQuestion = (
            <FillBlank
              key={'fill_blank_' + listQuestionExam[indexQuestion].idQuestion}
              dataQuestion={listQuestionExam[indexQuestion]}
              idQuestion={listQuestionExam[indexQuestion]?.idQuestion}
              isCustom={true}
            />
          );
          break;
        case indexQuestion < 7:
          itemQuestion = (
            <YesNoAnswer question={listQuestionExam[indexQuestion]} />
          );
          break;
        case indexQuestion < 9:
          itemQuestion = (
            <ReadingAnswer
              dataQuestion={listQuestionExam[indexQuestion]}
              idQuestion={listQuestionExam[indexQuestion]?.idQuestion}
            />
          );
          break;
        default:
          itemQuestion = (
            <ReadingAnswer
              dataQuestion={listQuestionExam[indexQuestion]}
              idQuestion={listQuestionExam[indexQuestion]?.idQuestion}
              part={2}
            />
          );
          break;
      }
      setContentQuestion(itemQuestion);
    }
  }, [listQuestionExam, indexQuestion]);

  const renderSection = (index: number) => {
    if (index < 2) {
      return {
        section:
          'Section 1: Look at the pictures. Look at the letters. Drag and drop the letters into the boxes to form a word that matches the picture.',
        instruction:
          'Bạn hãy nhìn ảnh và kéo thả các chữ cái để ghép thành từ đúng. Sau đó ấn "Tiếp tục" sang câu tiếp theo.',
      };
    } else if (index < 5) {
      return {
        section: 'Section 2: Look and read. Fill in the blanks.',
        instruction:
          'Với mỗi câu hỏi, bạn hãy hình hình ảnh và điền các chữ cái vào chỗ trống để tạo thành từ đúng.',
      };
    } else if (index < 7) {
      return {
        section:
          'Section 3: Look and read. Put a tick (✔) or a cross (X) in the box.',
        instruction:
          'Nhìn và đọc, lựa chọn đáp án Yes hoặc No. Sau đó ấn "Tiếp tục" sang câu tiếp theo.',
      };
    } else if (index < 8) {
      return {
        section: 'Section 4: Read a dialogue, select the correct response',
        instruction:
          'Bạn hãy đọc đoạn hội thoại và lựa chọn đáp án đúng cho mỗi câu hỏi. Sau đó ấn "Tiếp tục" sang câu tiếp theo.',
      };
    } else if (index < 9) {
      return {
        section:
          'Section 5: Look at the picture and read the story. Write words to complete the sentences. Use 1, 2, 3 or 4 words.',
        instruction:
          'Bạn hãy đọc đoạn văn và điền đáp án đúng cho mỗi câu hỏi.',
      };
    } else {
      return {
        section: 'Section 6: Complete these sentences with the words given:',
        instruction:
          'Bạn hãy viết câu đầy đủ dựa vào các từ gợi ý. Sau đó ấn "Nộp bài" để kết thúc bài kiểm tra.',
      };
    }
  };

  const rightComponent = () => {
    return (
      <div className="hidden md:flex bg-[#FFF8E5] mx-auto rounded-3xl items-center pl-2 gap-2 w-[212px]">
        <Image src="/images/icon-clock.svg" width={48} height={48} alt="" />
        <div>
          <p>Thời gian còn lại</p>
          <p className="font-medium mt-[2px]">{renderCountdown()}</p>
        </div>
      </div>
    );
  };

  return (
    <BaseLayout rightComponent={rightComponent}>
      <div className="content-question mt-4 rounded-[32px] bg-white px-6 relative pb-24">
        <div className="h-[100%] pb-8">
          <p className="hidden md:flex text-lg font-bold mt-[6px]">
            {renderSection(indexQuestion).section}
          </p>
          <div className="hidden md:flex gap-2">
            <img className="w-6 h-6" src="/images/icon-info.svg" alt="" />
            <p className="font-medium mb-4">
              {renderSection(indexQuestion).instruction}
            </p>
          </div>
          {contentQuestion}
        </div>

        <div
          className="z-50 bg-white h-20 w-full absolute bottom-0 rounded-b-[32px] left-0 px-6 flex items-center justify-between"
          style={{
            boxShadow: '0px -4px 8px 0px #0F7BAA14',
          }}
        >
          <div className="w-7/12 max-w-[35rem]">
            <p className="font-medium mb-[6px]">
              Bạn đã hoàn thành: {numberDone}/20
            </p>
            <Progress
              className="w-full [&_.mantine-Progress-root]:bg-[#B7DEF5]"
              color="#30A1E2"
              value={(numberDone / 20) * 100}
              radius="lg"
              size={'lg'}
            />
          </div>
          <Button
            className="bg-[#30A1E2] h-14 px-6 text-base font-bold"
            radius={'xl'}
            rightIcon={<ArrowCircleRight color="#ffffff" variant="Bold" />}
            onClick={() => {
              if (isAnswerQuestion) {
                onClickNext();
              } else {
                setShowModalNext(true);
              }
            }}
          >
            {indexQuestion < listQuestionExam?.length - 1
              ? 'Tiếp tục'
              : 'Nộp bài'}
          </Button>
        </div>
      </div>
      <Modal
        opened={showModalTimeout}
        closeOnClickOutside={false}
        withCloseButton={false}
        radius={24}
        centered
        onClose={() => {}}
      >
        <div className=" ">
          <p className=" text-center text-primary font-mikakoBold">
            Bạn đã hết thời gian làm bài
          </p>

          <p className=" text-center font-mikako">
            Thời gian làm bài cho bạn đã hết, nộp bài để xem kết quả
          </p>

          <div className="flex justify-center items-center">
            <Button
              className="bg-[#30A1E2] h-14 w-full mt-4 text-base font-bold font-mikado"
              radius={'xl'}
              onClick={() => {
                setShowModalTimeout(false);
                router.replace('/result');
              }}
            >
              Nộp bài ngay
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={showModalNext}
        closeOnClickOutside={false}
        withCloseButton={false}
        radius={'xl'}
        centered
        className="[&_.mantine-Modal-content]:p-2 [&_.mantine-Modal-close]:text-primary [&_.mantine-Modal-close]:scale-150 [&_.mantine-Modal-header]:py-0 [&_.mantine-Modal-header]:pt-2"
        onClose={() => {}}
      >
        <p className=" font-bold text-xl text-primary text-center">
          {indexQuestion < listQuestionExam.length - 1
            ? `Bạn có muốn chuyển sang câu tiếp theo?`
            : 'Bạn có muốn nộp bài'}
        </p>

        <p className=" font-medium text-center mt-6">
          Có một số câu hỏi bạn chưa trả lời. Lựa chọn Quay lại để tiếp tục trả
          lời câu hỏi hoặc ấn{' '}
          {indexQuestion < listQuestionExam.length - 1
            ? 'Tiếp tục để chuyển sang câu tiếp theo'
            : 'Nộp bài để nộp bài kiểm tra'}
        </p>

        <div className=" justify-center items-center">
          <Button
            className="bg-[#30A1E2] h-14 w-full mt-4 hover:text-white text-base font-bold"
            radius={'xl'}
            onClick={() => setShowModalNext(false)}
          >
            Quay lại
          </Button>
          <Button
            className="h-14 w-full mt-4 text-base font-bold"
            radius={'xl'}
            variant="outline"
            onClick={onClickNext}
          >
            {indexQuestion < listQuestionExam.length - 1
              ? 'Tiếp tục'
              : 'Nộp bài'}
          </Button>
        </div>
      </Modal>
      <Modal
        opened={showModalOverTime}
        closeOnClickOutside={false}
        withCloseButton={false}
        radius={'xl'}
        centered
        className="[&_.mantine-Modal-content]:p-2 [&_.mantine-Modal-close]:text-primary [&_.mantine-Modal-close]:scale-150 [&_.mantine-Modal-header]:py-0 [&_.mantine-Modal-header]:pt-2"
        onClose={() => {}}
      >
        <p className="font-bold text-xl text-primary text-center">
          Bạn đã hết thời gian làm bài
        </p>

        <p className="font-medium text-center mt-6">
          Thời gian làm bài cho bạn đã hết, nộp bài để xem kết quả
        </p>

        <div className=" justify-center items-center">
          <Button
            className="bg-[#30A1E2] h-14 w-full mt-4 text-base font-bold text-[16px] font-mikado"
            radius={'xl'}
            onClick={() => {
              setShowModalOverTime(false);
              router.replace('/result');
              setTimeout(() => {
                dispatch(setListUserAnswer([]));
                dispatch(setListUserAnswerDraft([]));
                dispatch(setIdHistory(''));
              }, 1000);
            }}
          >
            Nộp bài ngay
          </Button>
        </div>
      </Modal>
      <Modal
        opened={isModalInfo}
        closeOnClickOutside={false}
        withCloseButton={false}
        centered
        radius={'xl'}
        className="[&_.mantine-Modal-content]:p-2"
        onClose={() => {}}
      >
        <div className="bg-[#FFF8E5] mx-auto rounded-3xl flex items-center p-4 gap-2 w-[212px]">
          <Image src="/images/icon-clock.svg" width={48} height={48} alt="" />
          <div>
            <p>Thời gian còn lại</p>
            <p className="font-medium mt-[2px]">{renderCountdown()}</p>
          </div>
        </div>
        <div className="mt-6 mb-3">
          <h2 className="text-2xl font-bold">Reading & Writing</h2>
          <p className="text-lg font-bold mt-[6px]">
            {renderSection(indexQuestion).section}
          </p>
          <p className="font-medium mb-4">
            {renderSection(indexQuestion).instruction}
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/img-reading.png"
            width={150}
            height={112}
            alt=""
          />
        </div>
        <Button
          className="bg-[#30A1E2] h-[40px] w-60 mt-6 block mx-auto text-base font-bold"
          radius={'xl'}
          onClick={() => dispatch(setIsModalInfo(false))}
        >
          Đóng
        </Button>
      </Modal>
    </BaseLayout>
  );
};

export default ReadingWritingTest;