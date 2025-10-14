import { Button, Modal, Stepper } from '@mantine/core';
import Information from '@/components/Dashboard/Information';
import Introduce from '@/components/Dashboard/Introduce';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  getBrowserSignatureApi,
  getMocktestApi,
  sessionHistoryApi,
  sessionStartApi,
  sessionStopApi,
} from '@/service/api/contest';
import { IdHistoryContest, IdMockContest, StudentId } from '@/store/selector';
import { setDataSignature } from '@/store/slice/auth';
import {
  setIdBaikiemtraListening,
  setIdBaikiemtraRW,
  setIdHistory,
  setIdHistoryContest,
  setIdMockContest,
  setListUserAnswer,
  setListUserAnswerDraft,
} from '@/store/slice/examInfo';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // StudentId store
  const studentId = useAppSelector(StudentId, shallowEqual);
  const idMockContest = useAppSelector(IdMockContest, shallowEqual);
  const idHistoryContest = useAppSelector(IdHistoryContest, shallowEqual);

  const [active, setActive] = useState(studentId ? 2 : 0);
  const [isOpenModalContineu, setIsOpenModalContineu] = useState(false);
  const [indexExam, setIndexExam] = useState(0);
  const [isLoading, setLoading] = useState(false);

  // get Browser Signature
  const getBrowserSignature = async () => {
    const response = await getBrowserSignatureApi();
    if (response.data?.status === 200) {
      dispatch(setDataSignature(response.data?.metadata?.signature || ''));
    }
  };

  // get mocktest
  const getMocktest = async () => {
    router.push(indexExam == 0 ? '/listening' : '/reading-writing');
  };

  useEffect(() => {
    getBrowserSignature();
  }, []);

  useEffect(() => {
    if (active == 2) {
      setLoading(true);
      getMocktestApi(studentId).then(async (response) => {
        if (response.data.message === 'OK') {
          dispatch(setIdMockContest(response.data?.metadata?.idMockContest || null));

          const res = await sessionStartApi(
            studentId,
            response.data?.metadata?.idMockContest || null,
          );
          if (res.data.message === 'OK') {
            dispatch(setListUserAnswer([]));
            dispatch(setListUserAnswerDraft([]));
            dispatch(setIdHistoryContest(res.data?.metadata?.idHistoryContest));
            dispatch(
              setIdBaikiemtraListening(
                res.data?.metadata?.rounds[0]?.idBaikiemtra,
              ),
            );
            dispatch(
              setIdBaikiemtraRW(res.data?.metadata?.rounds[1]?.idBaikiemtra),
            );
            await sessionHistoryApi(
              studentId,
              response.data?.metadata?.idMockContest || null,
              res.data?.metadata?.idHistoryContest,
            )
              .then((res) => {
                if (res?.data?.status == 200) {
                  const dataHistory = res?.data?.metadata[0];
                  let index;
                  for (
                    index = 0;
                    index < dataHistory?.rounds?.length;
                    index++
                  ) {
                    const element = dataHistory?.rounds[index];
                    if (
                      !element?.timeFinish &&
                      element?.invalidAt &&
                      moment(element?.invalidAt) > moment()
                    ) {
                      setIndexExam(index);
                      dispatch(setIdHistory(element?.idHistory));
                      setIsOpenModalContineu(true);
                      break;
                    } else {
                      if (!element?.timeStart) {
                        dispatch(setIdHistory(''));
                        setIndexExam(index);
                        break;
                      }
                    }
                  }
                }
              })
              .catch((err) => { /* Error handled by finally block */ })
              .finally(() => {
                setLoading(false);
              });
          }
        }
      });
    }
  }, [active, studentId]);

  const stopSection = () => {
    sessionStopApi(studentId, idHistoryContest).then((res) => {
      if (res?.data?.status == 200) {
        setIsOpenModalContineu(false);
        setIndexExam(0);
        dispatch(setIdHistory(''));
        dispatch(setListUserAnswer([]));
        dispatch(setListUserAnswerDraft([]));
        sessionStartApi(studentId, idMockContest).then((res) => {
          if (res.data.message == 'OK') {
            dispatch(setIdHistoryContest(res.data?.metadata?.idHistoryContest));
            dispatch(
              setIdBaikiemtraListening(
                res.data?.metadata?.rounds[0]?.idBaikiemtra,
              ),
            );
            dispatch(
              setIdBaikiemtraRW(res.data?.metadata?.rounds[1]?.idBaikiemtra),
            );
          }
        });
      }
    });
  };

  return (
    <div className="bg_container w-screen h-auto min-h-screen">
      <div className="star-field w-screen h-auto min-h-screen flex flex-col items-center justify-center gap-12 px-4 sm:px-16 lg:px-0 md:py-4">
        <div className="layer"></div>
        <div className="layer"></div>
        <div className="layer"></div>
        <div className="flex-1 flex items-center justify-center pt-10">
          <div
            className="bg-white flex flex-col rounded-3xl py-6 z-10 w-full sm:w-auto"
            style={{
              boxShadow: '0px 6px 6px 0px #0000001A',
            }}
          >
            <div className=" w-full flex pb-8 pt-2 items-center justify-center">
              <img
                className="w-60 sm:w-[23rem]"
                src="/images/icanconnect_logo.png"
                alt=""
              />
            </div>

            <Stepper
              active={active}
              breakpoint="sm"
              className="[&_.mantine-Stepper-steps]:hidden [&_.mantine-Stepper-content]:p-0"
            >
              <Stepper.Step label="Introduce" description="introduce">
                <Introduce onNext={setActive} />
              </Stepper.Step>
              <Stepper.Step label="Info" description="info">
                <Information onNext={setActive} />
              </Stepper.Step>
              <Stepper.Step label="Start" description="start">
                <div className="sm:w-[575px] px-3 sm:px-6 font-medium">
                  <h2 className="font-bold text-2xl text-primary text-center">
                    Hướng dẫn làm bài
                  </h2>
                  <div className="mt-2 flex items-center justify-between sm:justify-around">
                    <div className="text-center">
                      <img src="/images/img-listening.png" alt="" />
                      <p className="text-lg font-bold mt-1">Bài nghe</p>
                      <p>10 phút</p>
                    </div>
                    <div className="text-center">
                      <img src="/images/img-reading.png" alt="" />
                      <p className="text-lg font-bold mt-1">Bài đọc và viết</p>
                      <p>15 phút</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Image
                      src="/images/icon-tick.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <p className="flex-1">
                      Bạn hãy sắp xếp thời gian ít nhất 30 phút để có thể hoàn
                      thành bài kiểm tra
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Image
                      src="/images/icon-tick.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <p className="flex-1">
                      Sau khi bắt đầu bạn không thể tạm dừng hoặc bắt đầu lại
                      bài thi. Bạn có thể nghỉ giải lao rất ngắn giữa các bài
                      thi nếu cần
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Image
                      src="/images/icon-tick.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <p className="flex-1">Mỗi câu trả lời đúng được 1 điểm</p>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Image
                      src="/images/icon-tick.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <p className="flex-1">
                      Bạn không bị trừ điểm nếu trả lời sai
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-[#30A1E2] h-14 w-60 mt-8 block mx-auto text-base font-bold"
                  radius={'xl'}
                  onClick={() => {
                    getMocktest();
                  }}
                >
                  Bắt đầu
                </Button>
              </Stepper.Step>
            </Stepper>
            <Modal
              opened={isOpenModalContineu}
              closeOnClickOutside={false}
              withCloseButton={false}
              radius={24}
              centered
              onClose={() => setIsOpenModalContineu(false)}
            >
              <div className=" ">
                <p className="py-8 text-center font-medium">
                  Bạn có bài test đang làm dở. <br />
                  Hãy tiếp tục hoàn thành bài test
                </p>
                <div className="flex justify-between items-center py-2">
                  <Button
                    className="bg-[#fff] h-12 w-[40%] block mx-auto text-[#000] font-mikado text-base font-bold"
                    radius={'xl'}
                    variant="outline"
                    onClick={stopSection}
                  >
                    Huỷ
                  </Button>
                  <Button
                    className="bg-[#30A1E2] h-12 w-[40%] block mx-auto text-base font-bold font-mikado"
                    radius={'xl'}
                    onClick={() => {
                      setIsOpenModalContineu(false);
                      router.push(
                        indexExam == 0
                          ? '/listening/test'
                          : '/reading-writing/test',
                      );
                    }}
                  >
                    Tiếp tục làm
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <p className=" text-center text-white">Copyright 2024 © GalaxyEdu.vn</p>
      </div>
    </div>
  );
}

