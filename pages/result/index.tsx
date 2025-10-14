import React, { useEffect, useMemo, useState } from 'react';
import { Button, Progress, Modal } from '@mantine/core';
import BaseLayout from '@/components/layout/Base';
import Image from 'next/image';
import moment from 'moment';
import { examHistoryApi, sessionHistoryApi } from '@/service/api/contest';
import { IdHistoryContest, IdMockContest, StudentId } from '@/store/selector';
import { dataListening, dataRedingWriting, dataTotal } from '@/ultils/dataResult';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import BaseAuto from '@/components/layout/Base/BaseAuto';

interface AnswerFormat {
  listen: boolean[];
  readwrite: boolean[];
  totalTrue: number;
}

const ResultPage: React.FC = () => {
  const studentId = useAppSelector(StudentId, shallowEqual);
  const idMockContest = useAppSelector(IdMockContest, shallowEqual);
  const idHistoryContest = useAppSelector(IdHistoryContest, shallowEqual);

  const [score, setScore] = useState<any>({});
  const [timeSubmit, setTimeSubmit] = useState('');
  const [showModalInfo, setShowModal] = useState(true);
  const [dataInfo, setDataInfo] = useState<any>(null);
  const [dataListeningAnswer, setDataListenAnswer] = useState<any[]>([]);
  const [dataListeningExam, setDataListenExam] = useState<any[]>([]);
  const [dataReadWriteAnswer, setDataReadWriteAnswer] = useState<any[]>([]);
  const [dataReadWriteExam, setDataReadWriteExam] = useState<any[]>([]);

  const answerFormat: AnswerFormat = useMemo(() => {
    let dataAnswer: any = {};
    let dataListen: boolean[] = [];
    let dataReadWrite: boolean[] = [];
    
    dataListeningExam.map((itemQuest) => {
      if (itemQuest?.quiz_type == 6) {
        let dataFilter = dataListeningAnswer.find(
          (itemAnswer) => itemAnswer?.idQuestion == itemQuest?.idQuestion,
        );
        if (dataFilter) {
          itemQuest?.listQuestionChildren?.map((itemQuestChild: any) => {
            let dataChildFilter = dataFilter?.userAnswer?.find(
              (itemChildAnswer: any) =>
                itemChildAnswer?.idChildQuestion ==
                itemQuestChild?.idChildQuestion,
            );
            if (dataChildFilter) {
              dataListen = [...dataListen, dataChildFilter.isTrue];
            } else {
              dataListen = [...dataListen, false];
            }
          });
        } else {
          itemQuest?.listQuestionChildren.map((_: any) => {
            dataListen = [...dataListen, false];
          });
        }
      } else {
        let dataFilter = dataListeningAnswer.find(
          (itemAnswer) => itemAnswer?.idQuestion == itemQuest?.idQuestion,
        );
        if (dataFilter) {
          dataListen = [...dataListen, dataFilter?.isTrue];
        } else {
          dataListen = [...dataListen, false];
        }
      }
    });

    dataReadWriteExam.map((itemQuest) => {
      if (itemQuest?.quiz_type == 6) {
        let dataFilter = dataReadWriteAnswer.find(
          (itemAnswer) => itemAnswer?.idQuestion == itemQuest?.idQuestion,
        );
        if (dataFilter) {
          itemQuest?.listQuestionChildren?.map((itemQuestChild: any) => {
            let dataChildFilter = dataFilter?.userAnswer?.find(
              (itemChildAnswer: any) =>
                itemChildAnswer?.idChildQuestion ==
                itemQuestChild?.idChildQuestion,
            );
            if (dataChildFilter) {
              dataReadWrite = [...dataReadWrite, dataChildFilter?.isTrue];
            } else {
              dataReadWrite = [...dataReadWrite, false];
            }
          });
        } else {
          itemQuest?.listQuestionChildren.map((_: any) => {
            dataReadWrite = [...dataReadWrite, false];
          });
        }
      } else {
        let dataFilter = dataReadWriteAnswer.find(
          (itemAnswer) => itemAnswer?.idQuestion == itemQuest?.idQuestion,
        );
        if (dataFilter) {
          dataReadWrite = [...dataReadWrite, dataFilter?.isTrue];
        } else {
          dataReadWrite = [...dataReadWrite, false];
        }
      }
    });

    dataAnswer.listen = dataListen;
    dataAnswer.readwrite = dataReadWrite;
    dataAnswer.totalTrue =
      dataListen.filter((item) => item == true).length +
      dataReadWrite.filter((item) => item == true).length;
    return dataAnswer;
  }, [
    dataListeningExam,
    dataListeningAnswer,
    dataReadWriteExam,
    dataReadWriteAnswer,
  ]);

  const sessionHistory = async () => {
    const response = await sessionHistoryApi(
      studentId,
      idMockContest,
      idHistoryContest,
    );
    if (response.data.message === 'OK') {
      setScore({
        scoreListening: response.data?.metadata[0]?.rounds[0]?.mark,
        scoreRW: response.data?.metadata[0]?.rounds[1]?.mark,
      });
      setTimeSubmit(
        moment(response?.data?.metadata[0]?.timeFinsh).format('DD/MM/YYYY'),
      );
      examHistoryApi(
        studentId,
        response.data?.metadata[0]?.rounds[0]?.idHistory,
      ).then((res) => {
        if (res.status == 200) {
          setDataInfo(res.data?.metadata?.contact);
          setDataListenAnswer(res.data?.metadata?.exam?.listQuestionGraded);
          setDataListenExam(res.data?.metadata?.exam?.listQuestion);
        }
      });
      examHistoryApi(
        studentId,
        response.data?.metadata[0]?.rounds[1]?.idHistory,
      ).then((res) => {
        if (res.status == 200) {
          setDataReadWriteAnswer(res.data?.metadata?.exam?.listQuestionGraded);
          setDataReadWriteExam(res.data?.metadata?.exam?.listQuestion);
        }
      });
    }
    console.log(response.data);
  };

  useEffect(() => {
    sessionHistory();
  }, []);

  return (
    <BaseAuto>
      <div
        className="bg-white rounded-3xl py-6 z-10 w-full px-2 sm:px-8 lg:px-20 xl:px-40 overflow-y-auto no-scrollbar"
        style={{
          boxShadow: '0px 6px 6px 0px #0000001A',
        }}
      >
        <h2 className="font-bold text-2xl text-primary text-center">
          Kết quả bài kiểm tra
        </h2>
        <p className="font-bold text-2xl text-center mt-2">
          Năng lực sử dụng ngôn ngữ
        </p>
        <p className="text-center mt-2">{timeSubmit}</p>
        <div className="mt-6 flex items-center justify-between gap-2 sm:gap-6">
          <div className="h-[9rem] p-2 sm:py-4 sm:px-6 flex items-center gap-3 sm:gap-6 border-2 border-[#E9F5FC] rounded-3xl flex-1">
            <img
              className="w-16 h-16 sm:w-[6.5rem] sm:h-[6.5rem]"
              alt=""
              src="/images/img-score.png"
            />
            <div>
              <p className="text-lg font-bold">{dataInfo?.name}</p>
              <p className="mt-4">SDT: {dataInfo?.phone}</p>
              <p className="">Email: {dataInfo?.email}</p>
              <p>
                ID Bài làm:{' '}
                {idHistoryContest.substring(idHistoryContest.length - 7)}
              </p>
            </div>
          </div>
          <div className="bg-[#E9F5FC] rounded-3xl w-1/4 max-w-[20rem] min-w-[90px] h-[9rem] font-bold flex flex-col items-center justify-center">
            <p className="text-lg">Overscore</p>
            <p className="text-primary text-4xl sm:text-6xl">
              {answerFormat?.totalTrue}
            </p>
          </div>
        </div>
        <h3 className="mt-4 font-bold text-lg">
          Điểm kỹ năng và đánh giá nhận xét
        </h3>
        <div className="mt-2 flex flex-col sm:flex-row gap-6">
          <div className="rounded-3xl border-2 border-[#E9F5FC] px-4 py-6 flex-1">
            <div className="flex items-center justify-center gap-4 h-[4.5rem]">
              <img className="h-full" alt="" src="/images/img-listening.png" />
              <p className="text-lg font-bold">Bài nghe</p>
            </div>
            <div className="flex items-center justify-between gap-4 px-2 mt-2">
              <div className="rounded-full bg-[#E9F5FC] w-16 h-16 flex items-center justify-center text-primary text-lg">
                <span className="font-black">
                  {answerFormat?.listen.filter((item) => item == true).length ||
                    0}
                </span>{' '}
                / <span>10</span>
              </div>
              <Progress
                className="flex-1 [&_.mantine-Progress-root]:bg-[#B7DEF5]"
                color="#30A1E2"
                value={
                  ((answerFormat?.listen.filter((item) => item == true).length ||
                    0) /
                    10) *
                  100
                }
                radius="lg"
                size={'lg'}
              />
            </div>
            <div className="h-40 md:h-36">
              <div className="grid gap-2 grid-cols-4 md:grid-cols-6 py-2 mt-6">
                {answerFormat?.listen.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className=" rounded-full flex px-2 justify-between border-primary border-[1px]"
                    >
                      <p>{index + 1}</p>
                      <img
                        className="h-full"
                        alt=""
                        width={16}
                        height={16}
                        src={
                          item
                            ? '/images/icon_true_result.svg'
                            : '/images/icon_false_result.svg'
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <h6 className="text-secondary font-medium mt-6">Nhận xét</h6>
            {(Array.isArray(dataListening(
              answerFormat?.listen.filter((item) => item == true).length || 0,
            ).comment) ? dataListening(
              answerFormat?.listen.filter((item) => item == true).length || 0,
            ).comment as string[] : [dataListening(
              answerFormat?.listen.filter((item) => item == true).length || 0,
            ).comment as string]).map((item: string, index: number) => (
              <div className="flex items-start gap-2 mt-4" key={index}>
                <div className="mt-0.5">
                  <Image
                    src="/images/icon-tick.svg"
                    width={16}
                    height={16}
                    alt=""
                  />
                </div>
                <p className="flex-1">{item}</p>
              </div>
            ))}
            <h6 className="text-secondary font-medium mt-6">Cần cải thiện</h6>
            <div className="flex items-start gap-2 mt-4">
              <p className="flex-1">
                {
                  dataListening(
                    answerFormat?.listen.filter((item) => item == true).length ||
                      0,
                  ).improve
                }
              </p>
            </div>
          </div>
          <div className="rounded-3xl border-2 border-[#E9F5FC] px-4 py-6 flex-1">
            <div className="flex items-center justify-center gap-4 h-[4.5rem]">
              <img className="h-full" alt="" src="/images/img-reading.png" />
              <p className="text-lg font-bold">Bài đọc và viết</p>
            </div>
            <div className="flex items-center justify-between gap-4 px-2 mt-2">
              <div className="rounded-full bg-[#E9F5FC] w-16 h-16 flex items-center justify-center text-primary text-lg">
                <span className="font-black">
                  {answerFormat?.readwrite.filter((item) => item == true)
                    .length || 0}
                </span>{' '}
                / <span>20</span>
              </div>
              <Progress
                className="flex-1 [&_.mantine-Progress-root]:bg-[#B7DEF5]"
                color="#30A1E2"
                value={
                  ((answerFormat?.readwrite.filter((item) => item == true)
                    .length || 0) /
                    20) *
                  100
                }
                radius="xl"
                size={'xl'}
              />
            </div>
            <div className="h-40 md:h-36">
              <div className="grid gap-2 grid-cols-4 md:grid-cols-6 py-2 mt-6">
                {answerFormat?.readwrite.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className=" rounded-full flex px-2 justify-between border-primary border-[1px]"
                    >
                      <p>{index + 1}</p>
                      <img
                        className="h-full"
                        alt=""
                        width={16}
                        height={16}
                        src={
                          item
                            ? '/images/icon_true_result.svg'
                            : '/images/icon_false_result.svg'
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <h6 className="text-secondary font-medium mt-6">Nhận xét</h6>
            {(Array.isArray(dataRedingWriting(
              answerFormat?.readwrite.filter((item) => item == true).length || 0,
            ).comment) ? dataRedingWriting(
              answerFormat?.readwrite.filter((item) => item == true).length || 0,
            ).comment as string[] : [dataRedingWriting(
              answerFormat?.readwrite.filter((item) => item == true).length || 0,
            ).comment as string]).map((item: string, index: number) => (
              <div className="flex items-start gap-2 mt-4" key={index}>
                <div className="mt-0.5">
                  <Image
                    src="/images/icon-tick.svg"
                    width={16}
                    height={16}
                    alt=""
                  />
                </div>
                <p className="flex-1">{item}</p>
              </div>
            ))}
            <h6 className="text-secondary font-medium mt-6">Cần cải thiện</h6>
            <div className="flex items-start gap-2 mt-4">
              <p className="flex-1">
                {
                  dataRedingWriting(
                    answerFormat?.readwrite.filter((item) => item == true)
                      .length || 0,
                  ).improve
                }
              </p>
            </div>
          </div>
        </div>
        <h3 className="mt-4 font-bold text-lg">Kết luận</h3>
        <div className="mt-2 p-6 rounded-3xl border-2 border-support_Blue">
          <p>
            {
              dataTotal(
                (answerFormat?.listen.filter((item) => item == true).length ||
                  0) +
                  (answerFormat?.readwrite.filter((item) => item == true)
                    .length || 0),
              ).improve
            }
          </p>
          <p className="mt-2 text-center">
            {
              dataTotal(
                (answerFormat?.listen.filter((item) => item == true).length ||
                  0) +
                  (answerFormat?.readwrite.filter((item) => item == true)
                    .length || 0),
              ).comment
            }
          </p>
          <p className="mt-2 text-center font-bold">
            {
              dataTotal(
                (answerFormat?.listen.filter((item) => item == true).length ||
                  0) +
                  (answerFormat?.readwrite.filter((item) => item == true)
                    .length || 0),
              ).course
            }
          </p>
        </div>
        <div className="flex justify-center mt-4 mb-10">
          <Button
            className="bg-[#30A1E2] h-14 w-full md:w-[40%] mt-4 text-base font-bold text-[16px]"
            radius={'xl'}
            onClick={() => {
              window.open('https://speakwell.icanconnect.vn/');
            }}
          >
            Tìm hiểu về SpeakWell
          </Button>
        </div>
      </div>
      <Modal
        opened={showModalInfo}
        closeOnClickOutside={false}
        withCloseButton={false}
        radius={'xl'}
        centered
        className="[&_.mantine-Modal-content]:p-2 [&_.mantine-Modal-close]:text-primary [&_.mantine-Modal-close]:scale-150 [&_.mantine-Modal-header]:py-0 [&_.mantine-Modal-header]:pt-2"
        onClose={() => {}}
      >
        <p className=" font-bold text-xl text-primary text-center">
          Chúc mừng bạn đã hoàn thành bài kiểm tra!
        </p>
        <div className=" justify-center flex items-center my-4">
          <img className="" alt="" src="/images/icon_result.png" />
        </div>

        <p className=" font-medium text-center mt-6">
          Hãy xem kết quả của bạn tại đây. Chúng mình cũng đã gửi kết quả về
          email mà bạn đăng ký để bạn có thể xem lại kết quả sau
        </p>

        <div className=" justify-center items-center">
          <Button
            className="bg-[#30A1E2] h-14 w-full mt-4 text-base font-bold text-[16px]"
            radius={'xl'}
            onClick={() => setShowModal(false)}
          >
            Đóng
          </Button>
        </div>
      </Modal>
    </BaseAuto>
  );
};

export default ResultPage;
