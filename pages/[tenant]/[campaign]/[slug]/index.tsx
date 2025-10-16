'use client';

import { Button, Modal, Stepper } from '@mantine/core';
import Information from '@/components/Dashboard/Information';
import DynamicInformation from '@/components/Dashboard/DynamicInformation';
import Introduce from '@/components/Dashboard/Introduce';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  getBrowserSignatureApi,
  getMocktestApi,
  sessionHistoryApi,
  sessionStartApi,
  sessionStopApi,
} from '@/service/api/contest';
import { IdHistoryContest, IdMockContest, StudentId, ContestType } from '@/store/selector';
import { setDataSignature } from '@/store/slice/auth';
import {
  setIdBaikiemtraListening,
  setIdBaikiemtraRW,
  setIdHistory,
  setIdHistoryContest,
  setIdMockContest,
  setListUserAnswer,
  setListUserAnswerDraft,
  setFormConfig,
  setDataExam,
  setIdHistoryRoundExam,
} from '@/store/slice/examInfo';
import { getRuntimeTenantCode } from '@/service/tenantDomains';
import { getConfigExamApi, getMockcontestInfoApi, getMockcontestHistoryApi, startMockcontestApi } from '@/service/api/examConfig';
import { getTestFormat } from '@/ultils/testFormat';

interface MockContestInfo {
  rounds: Array<{
    test_format: number;
    name: string;
    id: number;
    round_id: number;
  }>;
  [key: string]: any;
}

export default function DynamicTestPage() {
  const router = useRouter();
  const { tenant, campaign, slug } = router.query;
  const dispatch = useDispatch();
  
  // StudentId store
  const studentId = useSelector(StudentId, shallowEqual) as string;
  const idMockContest = useSelector(IdMockContest, shallowEqual) as string | null;
  const idHistoryContest = useSelector(IdHistoryContest, shallowEqual) as string;
  const contestType = useSelector(ContestType, shallowEqual) as number | undefined;

  const [active, setActive] = useState(0); // Always start from step 0 for dynamic routes
  const [isOpenModalContineu, setIsOpenModalContineu] = useState(false);
  const [indexExam, setIndexExam] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [mockContestInfo, setMockContestInfo] = useState<MockContestInfo | null>(null); // Store mockcontest info for new flow

  // Debug info
  useEffect(() => {
    if (router.isReady) {
      // console.log('Dynamic Route Debug:');
      // console.log('Tenant:', tenant);
      // console.log('Campaign:', campaign);
      // console.log('Slug:', slug);
      // console.log('Pathname:', router.pathname);
      // console.log('AsPath:', router.asPath);
      // console.log('StudentId:', studentId);
      // console.log('Active state:', active);
      // console.log('Runtime Tenant Code:', getRuntimeTenantCode());
    }
  }, [router.isReady, tenant, campaign, slug, router.pathname, router.asPath, studentId, active]);

  // get Browser Signature
  const getBrowserSignature = async () => {
    // console.log('getBrowserSignature called...');
    try {
      const response = await getBrowserSignatureApi();
      // console.log('getBrowserSignature response:', response);
      if (response.data?.status === 200) {
        // console.log('Setting data signature...');
        dispatch(setDataSignature(response.data?.metadata?.signature as string));
      }
    } catch (error) {
      console.error('getBrowserSignature error:', error);
    }
  };

  // get mocktest - Updated to handle both old and new flows
  const getMocktest = async () => {
    // console.log('getMocktest called - contestType:', contestType, 'idMockContest:', idMockContest);
    
    if (contestType === 14) {
      // OLD FLOW: Redirect to old listening/reading-writing pages
      // console.log('Contest type 14 - Using OLD route');
      const targetRoute = indexExam == 0 ? '/listening' : '/reading-writing';
      // console.log('Redirecting to:', targetRoute);
      router.push(targetRoute);
    } else {
      // NEW FLOW: Call startMockcontestApi and redirect to new test page
      // console.log('Contest type', contestType, '- Using NEW route');
      
      if (!mockContestInfo) {
        // console.error('MockContest info not loaded yet');
        alert('Đang tải thông tin bài test. Vui lòng thử lại!');
        return;
      }
      
      try {
        const payload = {
          contest_type: contestType!,
          idMockContest: Number(idMockContest),
        };
        
        // console.log('Calling startMockcontestApi with:', payload);
        const response = await startMockcontestApi(payload);
        
        // console.log('startMockcontestApi response:', response);
        
        if (response.data && response.data.data) {
          const { idHistoryContest, mockcontests } = response.data.data;
          
          // console.log('idHistoryContest:', idHistoryContest);
          // console.log('mockcontests:', mockcontests);
          
          // Save to Redux (similar to lms-ican-hocmai-main)
          dispatch(setListUserAnswer([]));
          dispatch(setIdHistoryContest(String(idHistoryContest)));
          dispatch(setIdHistoryRoundExam(null));
          
          // Save exam data
          dispatch(setDataExam({
            ...mockContestInfo,
            contest_type: contestType,
            submitType: mockcontests.submit_type || 1, // Default submit type
          }));
          
          if (mockcontests.contest_type != 29) {
            // Regular exam flow - redirect to listening/reading/writing/speaking
            if (!mockContestInfo.rounds || mockContestInfo.rounds.length === 0) {
              alert('Không tìm thấy thông tin bài thi. Vui lòng thử lại!');
              return;
            }
            
            const firstRound = mockContestInfo.rounds[0];
            
            const testFormat = getTestFormat(firstRound.test_format);
            const roundId = firstRound.id;
            
            // Redirect to exam page with test format
            const newTestRoute = `/${tenant}/${campaign}/${slug}/exam/${testFormat}/${idMockContest}/${roundId}`;
            router.push(newTestRoute);
          } else {
            // Exercise testing flow (type 29)
            if (!mockContestInfo.rounds || mockContestInfo.rounds.length === 0) {
              alert('Không tìm thấy thông tin bài thi. Vui lòng thử lại!');
              return;
            }
            
            const roundId = mockContestInfo.rounds[0]?.id;
            const exerciseRoute = `/${tenant}/${campaign}/${slug}/exercise/testing/${idMockContest}/${roundId}`;
            router.push(exerciseRoute);
          }
        }
      } catch (error) {
        console.error('Error starting new mockcontest:', error);
        alert('Có lỗi xảy ra khi bắt đầu bài test. Vui lòng thử lại!');
      }
    }
  };

  useEffect(() => {
    // console.log('Calling getBrowserSignature...');
    getBrowserSignature();
  }, []);

  // Fetch form config and mockcontest info when route params are available
  useEffect(() => {
    const fetchInitialData = async () => {
      if (router.isReady && tenant && campaign && slug) {
        try {
          // Fetch form config
          const configResponse = await getConfigExamApi(campaign as string, slug as string);
          
          if (configResponse.data) {
            if (configResponse.data.length > 0) {
              // Filter out deleted items (deleted_at is not null)
              const validFields = configResponse.data.filter(field => !field.deleted_at);
              dispatch(setFormConfig(validFields));
            } else {
              dispatch(setFormConfig([]));
            }
          }
        } catch (error) {
          console.error('Error fetching initial data:', error);
          // Use empty array if API fails
          dispatch(setFormConfig([]));
        }
      }
    };

    fetchInitialData();
  }, [router.isReady, tenant, campaign, slug]);

  // Fetch mockcontest info when idMockContest and contestType are available (after createUser)
  useEffect(() => {
    const fetchMockContestInfo = async () => {
      if (idMockContest && contestType && contestType !== 14) {
        try {
          const infoResponse = await getMockcontestInfoApi(Number(idMockContest), contestType);
          
          if (infoResponse.data && infoResponse.data.data) {
            const mockContestData = infoResponse.data.data;
            
            // Transform rounds data (similar to lms-ican-hocmai-main)
            const transformedData = mockContestData.rounds.map((itemRound: any) => ({
              test_format: itemRound.type,
              name: itemRound.name,
              id: itemRound.listBaikiemtra[0]?.idBaikiemtra,
              round_id: itemRound.listBaikiemtra[0]?.idBaikiemtra, // Add round_id for compatibility
            }));
            
            const transformedMockContest = {
              ...mockContestData,
              rounds: transformedData,
            };
            
            setMockContestInfo(transformedMockContest);
          }
        } catch (error) {
          console.error('Error fetching mockcontest info:', error);
        }
      }
    };

    fetchMockContestInfo();
  }, [idMockContest, contestType]);

  useEffect(() => {
    if (active == 2 && studentId) {
      setLoading(true);
      
      // Check contest_type to determine which flow to use
      if (contestType === 14) {
        // OLD FLOW: contest_type = 14
        
        getMocktestApi(studentId).then(async (response: any) => {
          if (response.data.message === 'OK') {
            dispatch(setIdMockContest(response.data?.metadata?.idMockContest));

            const res = await sessionStartApi(
              studentId,
              response.data?.metadata?.idMockContest,
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
                response.data?.metadata?.idMockContest,
                res.data?.metadata?.idHistoryContest,
              )
                .then((res: any) => {
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
                          dispatch(setIdHistory(null));
                          setIndexExam(index);
                          break;
                        }
                      }
                    }
                  }
                })
                .catch(() => { /* Error handled by finally block */ })
                .finally(() => {
                  setLoading(false);
                });
            }
          }
        });
      } else {
        // NEW FLOW: contest_type != 14
        getMockcontestInfoApi(Number(idMockContest), contestType as number).then(async (infoResponse: any) => {
          
          if (infoResponse.data) {
            // Get history
            const historyParams = {
              contest_type: contestType as number,
              idMockContest: Number(idMockContest),
            };
            
            const historyResponse = await getMockcontestHistoryApi(historyParams);
            
            if (historyResponse.data) {
              // Process history data similar to old flow
              const historyData = historyResponse.data;
              
              setLoading(false);
            }
          }
        }).catch((err: any) => {
          console.error('New flow error:', err);
          setLoading(false);
        });
      }
    }
  }, [active, studentId, contestType, idMockContest]);

  const stopSection = () => {
    sessionStopApi(studentId, idHistoryContest).then((res: any) => {
      if (res?.data?.status == 200) {
        setIsOpenModalContineu(false);
        setIndexExam(0);
        dispatch(setIdHistory(null));
        dispatch(setListUserAnswer([]));
        dispatch(setListUserAnswerDraft([]));
        sessionStartApi(studentId, idMockContest!).then((res: any) => {
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
              classNames={{
                steps: 'hidden',
                content: 'p-0',
              }}
            >
              <Stepper.Step label="Introduce" description="introduce">
                <Introduce onNext={setActive} />
              </Stepper.Step>
              <Stepper.Step label="Info" description="info">
                <DynamicInformation onNext={setActive} />
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
                  className="bg-[#30A1E2] h-14 w-60 mt-8 block mx-auto"
                  radius={'xl'}
                  classNames={{
                    label: 'text-base font-bold',
                  }}
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
                    className="bg-[#fff] h-12 w-[40%] block mx-auto"
                    radius={'xl'}
                    variant="outline"
                    classNames={{
                      label: 'text-[#000] font-mikado text-base font-bold',
                    }}
                    onClick={stopSection}
                  >
                    Huỷ
                  </Button>
                  <Button
                    className="bg-[#30A1E2] h-12 w-[40%] block mx-auto"
                    radius={'xl'}
                    classNames={{
                      label: 'text-base font-bold font-mikado',
                    }}
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

