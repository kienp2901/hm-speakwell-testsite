import { Button, Modal, Progress } from '@mantine/core';
import MultiChoiceOneRight from '@/components/Question/MultiChoiceOneRight';
import ReadingAnswer from '@/components/Question/ReadingAnswer';
import BaseLayout from '@/components/layout/Base';
import { ArrowCircleRight } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  examContinueApi,
  examSaveApi,
  examSubmitApi,
} from '@/service/api/contest';
import {
  IdHistory,
  IsModalInfo,
  ListUserAnswer,
  ListUserAnswerDraft,
  StudentId,
} from '@/store/selector';
import {
  setIdHistory,
  setIsModalInfo,
  setListUserAnswer,
  setListUserAnswerDraft,
  setNumberListen,
} from '@/store/slice/examInfo';
import { questionEnumType } from '@/ultils/typeQuestion';
import { QuestionData } from '@/types/question';

const ListeningTest: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isModalInfo = useAppSelector(IsModalInfo, shallowEqual);
  const studentId = useAppSelector(StudentId, shallowEqual);
  const idHistory = useAppSelector(IdHistory, shallowEqual);
  const listUserAnswer = useAppSelector(ListUserAnswer, shallowEqual);
  const listUserAnswerDraft = useAppSelector(ListUserAnswerDraft, shallowEqual);

  const [listQuestion, setListQuestion] = useState<QuestionData[]>([]);
  const [indexQuestion, setIndexQuestion] = useState(
    Number(localStorage.getItem('page')) || 0,
  );
  const [contentQuestion, setContentQuestion] = useState<React.ReactNode>();
  const [timer, setTimer] = useState(600);
  const [numberDone, setNumberDone] = useState(0);
  const [isModalNextQuestion, setIsModalNextQuestion] = useState(false);
  const [isModalTimeEnd, setIsModalTimeEnd] = useState(false);

  const timeRemainingInterval = useRef<NodeJS.Timeout>();
  const [timeRemaining, setTimeRemaining] = useState(15);

  const renderTimer = useMemo(() => {
    if (timer > 0) {
      const minute = Math.floor(timer / 60);
      const second = timer % 60;
      return `${minute > 9 ? minute : `0${minute}`} phút ${
        second > 9 ? second : `0${second}`
      } giây`;
    } else {
      return '00 phút 00 giây';
    }
  }, [timer]);

  const examContinue = async (studentId: string, idHistory: string) => {
    const response = await examContinueApi(studentId, idHistory);
    if (response.data.message === 'OK') {
      setListQuestion(response.data?.metadata?.listQuestion);
      setTimer(response.data?.metadata?.timeAllow);
      const listUserAnswerTemp = response.data?.metadata?.listUserAnswer?.map(
        (item: any) => {
          return {
            idQuestion: item.idQuestion,
            answer: item.userAnswer,
          };
        },
      );
      dispatch(setListUserAnswer(listUserAnswerTemp));
    }
  };

  const renderSection = (index: number) => {
    if (index < 3) {
      return {
        section: 'Section 1: Listen and choose the correct picture',
        instruction:
          'Nghe và lựa chọn đáp án có hình đúng. Sau đó ấn "Tiếp tục" sang câu tiếp theo',
      };
    } else if (index === 3) {
      return {
        section: 'Section 2: Listen and write a name or a number.',
        instruction:
          'Bạn hãy nghe và viết tên hoặc số cho mỗi câu hỏi. Sau đó ấn "Tiếp tục" sang câu tiếp theo',
      };
    } else {
      return {
        section: 'Section 3: Listen and Write',
        instruction:
          'Bạn hãy nghe và viết đáp án cho mỗi câu hỏi. Sau đó ấn "Tiếp tục" sang câu tiếp theo',
      };
    }
  };

  const onNextQuestion = () => {
    if (indexQuestion < 3) {
      const indexAnswer = listUserAnswer.findIndex(
        (item) => item?.idQuestion === listQuestion[indexQuestion]?.idQuestion,
      );
      if (indexAnswer === -1) {
        setIsModalNextQuestion(true);
      } else {
        dispatch(setNumberListen(2));
        setIndexQuestion((prev) => prev + 1);
        if (typeof window !== 'undefined') {
          localStorage.setItem('page', String(indexQuestion + 1));
        }
      }
    } else if (indexQuestion === 3) {
      const indexAnswer = listUserAnswer.findIndex(
        (item) => item?.idQuestion === listQuestion[indexQuestion]?.idQuestion,
      );
      if (
        indexAnswer !== -1 &&
        listUserAnswer[indexAnswer]?.answer?.length === 3
      ) {
        dispatch(setNumberListen(2));
        setIndexQuestion((prev) => prev + 1);
        if (typeof window !== 'undefined') {
          localStorage.setItem('page', String(indexQuestion + 1));
        }
      } else {
        setIsModalNextQuestion(true);
      }
    } else {
      const indexAnswer = listUserAnswer.findIndex(
        (item) => item?.idQuestion === listQuestion[indexQuestion]?.idQuestion,
      );
      if (
        indexAnswer !== -1 &&
        listUserAnswer[indexAnswer]?.answer?.length === 4
      ) {
        onSubmit();
      } else {
        setIsModalNextQuestion(true);
      }
    }
  };

  const onSubmit = async () => {
    const response = await examSubmitApi(studentId, {
      idHistory: idHistory as string,
      listUserAnswer: listUserAnswer,
    });
    if (response.data.message === 'OK') {
      dispatch(setListUserAnswer([]));
      dispatch(setListUserAnswerDraft([]));
      dispatch(setIdHistory(''));
      if (timer > 0) {
        router.replace('/reading-writing');
      }
    }
  };

  useEffect(() => {
    examContinue(studentId, idHistory as string);
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (idHistory && document.visibilityState === 'visible') {
      examContinueApi(studentId, idHistory as string)
        .then((res) => {
          if (res.status == 200) {
            if (res?.data.status == 200) {
              const dataExam = res?.data?.metadata;
              setTimer(dataExam?.timeAllow);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          return;
        });
    }
  }, [idHistory, studentId]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    if (listQuestion.length > 0) {
      let itemQuestion: React.ReactNode = <></>;
      switch (listQuestion[indexQuestion]?.quiz_type) {
        case questionEnumType.ONE_RIGHT:
          itemQuestion = (
            <MultiChoiceOneRight
              isCustom={true}
              dataQuestion={listQuestion[indexQuestion]}
              idQuestion={listQuestion[indexQuestion]?.idQuestion}
            />
          );
          break;
        case questionEnumType.READING:
          itemQuestion = (
            <ReadingAnswer
              dataQuestion={listQuestion[indexQuestion]}
              idQuestion={listQuestion[indexQuestion]?.idQuestion}
            />
          );
          break;
        default:
          break;
      }
      setContentQuestion(itemQuestion);
    }
  }, [listQuestion, indexQuestion]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 850);
    } else {
      setTimer(0);
    }
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      dispatch(setIsModalInfo(false));
      onSubmit();
      setIsModalTimeEnd(true);
    } else if (timer % 10 == 0) {
      if (listUserAnswerDraft?.length > 0) {
        examSaveApi(studentId, {
          idHistory: idHistory as string,
          listUserAnswer: [...listUserAnswerDraft],
        }).then((res) => {
          if (res?.status == 200) {
            dispatch(setListUserAnswerDraft([]));
          }
        });
      }
    }
  }, [timer, studentId, idHistory, listUserAnswerDraft, dispatch]);

  useEffect(() => {
    if (listUserAnswer.length > 0) {
      let numberDoneTemp = 0;
      listUserAnswer.map((item) => {
        numberDoneTemp = numberDoneTemp + item.answer.length;
      });
      setNumberDone(numberDoneTemp);
    }
  }, [listUserAnswer]);

  useEffect(() => {
    if (isModalTimeEnd) {
      timeRemainingInterval.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
  }, [isModalTimeEnd]);

  useEffect(() => {
    if (timeRemaining === 0) {
      if (timeRemainingInterval.current) {
        clearInterval(timeRemainingInterval.current);
      }
      router.push('/reading-writing');
    }
  }, [timeRemaining, router]);

  const countdownComponent = () => {
    return (
      <div className="rounded-[32px] bg-white hidden md:flex items-center">
        <div className="bg-[#FFF8E5] rounded-3xl flex items-center pl-2 gap-1 w-[212px]">
          <Image src="/images/icon-clock.svg" width={48} height={48} alt="" />
          <div>
            <p>Thời gian còn lại</p>
            <p className="font-medium mt-[2px]">{renderTimer}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseLayout rightComponent={countdownComponent}>
      <div className="content-question mt-4 rounded-[32px] bg-white px-6 relative pb-24">
        <div className="h-[100%]">
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
              Bạn đã hoàn thành: {numberDone}/10
            </p>
            <Progress
              className="w-full [&_.mantine-Progress-root]:bg-[#B7DEF5]"
              color="#30A1E2"
              value={(numberDone / 10) * 100}
              radius="lg"
              size={'lg'}
            />
          </div>
          <Button
            className="bg-[#30A1E2] h-14 px-6 text-base font-bold"
            radius={'xl'}
            rightIcon={<ArrowCircleRight color="#ffffff" variant="Bold" />}
            onClick={onNextQuestion}
          >
            Tiếp tục
          </Button>
        </div>
      </div>

      <Modal
        opened={isModalInfo}
        closeOnClickOutside={false}
        withCloseButton={false}
        centered
        radius={'xl'}
        className="[&_.mantine-Modal-content]:p-2"
        onClose={() => {
          return;
        }}
      >
        <div className="bg-[#FFF8E5] mx-auto rounded-3xl flex items-center p-4 gap-2 w-[212px]">
          <Image src="/images/icon-clock.svg" width={48} height={48} alt="" />
          <div>
            <p>Thời gian còn lại</p>
            <p className="font-medium mt-[2px]">{renderTimer}</p>
          </div>
        </div>
        <div className="mt-6 mb-3">
          <h2 className="text-2xl font-bold">Listening</h2>
          <p className="text-lg font-bold mt-[6px]">
            {renderSection(indexQuestion).section}
          </p>
          <p className="font-medium mb-4">
            {renderSection(indexQuestion).instruction}
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/img-listening.png"
            width={200}
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

      <Modal
        opened={isModalNextQuestion}
        closeOnClickOutside={false}
        onClose={() => setIsModalNextQuestion(false)}
        centered
        radius={'xl'}
        className="[&_.mantine-Modal-content]:p-2 [&_.mantine-Modal-close]:text-primary [&_.mantine-Modal-close]:scale-150 [&_.mantine-Modal-header]:py-0 [&_.mantine-Modal-header]:pt-2"
      >
        <h2 className="font-bold text-xl text-primary text-center">
          Bạn có muốn chuyển sang câu tiếp theo?
        </h2>
        <p className="font-medium text-center mt-6">
          Có một số câu hỏi bạn chưa trả lời. Lựa chọn Quay lại để tiếp tục trả
          lời câu hỏi hoặc ấn Tiếp tục để chuyển sang câu tiếp theo
        </p>
        <Button
          className="bg-[#30A1E2] h-14 w-full mt-6 text-base font-bold"
          radius={'xl'}
          onClick={() => setIsModalNextQuestion(false)}
        >
          Quay lại
        </Button>
        <Button
          className="h-14 w-full mt-4 text-base font-bold"
          radius={'xl'}
          variant="outline"
          onClick={() => {
            if (indexQuestion < listQuestion.length - 1) {
              dispatch(setNumberListen(2));
              setIndexQuestion((prev) => prev + 1);
              if (typeof window !== 'undefined') {
                localStorage.setItem('page', String(indexQuestion + 1));
              }
            } else {
              onSubmit();
            }
            setIsModalNextQuestion(false);
          }}
        >
          Tiếp tục
        </Button>
      </Modal>

      <Modal
        opened={isModalTimeEnd}
        closeOnClickOutside={false}
        withCloseButton={false}
        centered
        radius={'xl'}
        className="[&_.mantine-Modal-content]:p-2"
        onClose={() => {
          return;
        }}
      >
        <h2 className="font-bold text-xl text-primary text-center">
          Hết thời gian làm bài Nghe
        </h2>
        <p className="font-medium text-center pt-6">
          Thời gian làm bài Nghe cho bạn đã hết, chuyển sang bài Đọc và Viết
        </p>
        <div className="flex items-center justify-center py-8">
          <div className=" w-32 h-32 rounded-full bg-[#FFFDD3] border-2  border-[#FF9B27] flex items-center justify-center text-center">
            <p className=" font-mikakoBold font-bold text-[40px] text-[#FF9B27]">
              {timeRemaining}s
            </p>
          </div>
        </div>
        <Button
          className="bg-[#30A1E2] h-14 w-full text-base font-bold"
          radius={'xl'}
          onClick={() => {
            router.replace('/reading-writing');
          }}
        >
          Tiếp tục phần Đọc và Viết
        </Button>
      </Modal>
    </BaseLayout>
  );
};

export default ListeningTest;