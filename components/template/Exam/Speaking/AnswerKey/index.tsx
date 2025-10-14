/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { HoverCard, Modal, Progress, RingProgress, Text } from '@mantine/core';
import Discussion from '@/components/organisms/Exam/AnswerDetail/Discussion';
import MoreInfo from '@/components/organisms/Exam/AnswerKey/MoreInfo';
import HeaderTest from '@/components/organisms/Exam/HeaderTest';
import AnswerSpeaking from '@/components/organisms/Exam/SampleSpeaking';
import Button from '@/components/sharedV2/Button';
import { TestType } from '@/enum';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getHistoryDetail, sendToExaminerApi } from '@/service/api/examConfig';
import notify from '@/utils/notify';

const AnswerKey = () => {
  const router = useRouter();
  const params = router.query;
  const { idHistory } = params;
  
  const pathname = router.asPath;
  const [metadataAnswer, setMetadataAnswer] = useState<any>();
  const [listQuestion, setListQuestion] = useState<any>([]);
  const [listUserAnswer, setListUserAnswer] = useState<any>([]);

  const getExamHistoryDetail = async () => {
    await getHistoryDetail(`${idHistory}`)
      .then(res => {
        const index = res?.data?.metadata?.rounds?.findIndex(
          (item: any) => item.test_format === TestType.Speaking,
        );
        setMetadataAnswer(res.data.data?.rounds[index]);
        const listQuestion = Object.values(
          res?.data?.data?.rounds[0]?.listQuestion?.reduce(
            (acc: any, item: any) => {
              const { part } = item.speakLCAT;
              acc[part] = acc[part] || [];
              acc[part].push(item);
              return acc;
            },
            {},
          ),
        );
        setListQuestion(listQuestion);
        const dataAnswers = res?.data?.data?.rounds[0]?.listQuestionGraded;
        fetchTotalDuration(dataAnswers).then(res => {
          const listAnswers = dataAnswers.map((answer: any, index: number) => {
            return { ...answer, duration: res[index] };
          });
          setListUserAnswer(listAnswers);
        });
      })
      .catch(err => {
        // router.replace('/');
        notify({
          type: 'error',
          message: 'Have error please try again',
          delay: 500,
        });
      });
  };

  const getExamHistoryPart = async () => {
    await getHistoryDetail(`${idHistory}`)
      .then(res => {
        setMetadataAnswer(res.data.data);
        const listQuestion = Object.values(
          res?.data?.data?.listQuestion?.reduce((acc: any, item: any) => {
            const { part } = item.speakLCAT;
            acc[part] = acc[part] || [];
            acc[part].push(item);
            return acc;
          }, {}),
        );
        setListQuestion(listQuestion);
        const dataAnswers = res?.data?.data?.listQuestionGraded;
        fetchTotalDuration(dataAnswers).then(res => {
          const listAnswers = dataAnswers.map((answer: any, index: number) => {
            return { ...answer, duration: res[index] };
          });
          setListUserAnswer(listAnswers);
        });
      })
      .catch(err => {
        // router.replace('/');
        notify({
          type: 'error',
          message: 'Have error please try again',
          delay: 500,
        });
      });
  };

  const fetchDuration = (path: any) => {
    return new Promise(resolve => {
      const audio = new Audio();
      audio.src = path;
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.ceil(audio.duration));
      });
    });
  };

  const fetchTotalDuration = async (listAnswers: any) => {
    return Promise.all(
      listAnswers.map((answer: any) => fetchDuration(answer?.filepath)),
    );
  };

  useEffect(() => {
    if (idHistory) {
      if (pathname.includes('/exam')) getExamHistoryPart();
      else getExamHistoryDetail();
    }
  }, [idHistory]);

  return (
    <div className="bg-[#EFF1F4] pt-[64px] fixed top-0 left-0 right-0 bottom-0">
      <HeaderTest
        type="answer-key"
        childrenHeader={() => {
          return <></>;
        }}
        showDrawer={false}
        showOpenDraw={false}
      />
      <div className="h-full overflow-y-auto scroll-smooth py-10">
        <div className="h-auto bg-white mx-4 sm:mx-6 lg:mx-20 xl:mx-28 rounded-2xl sm:px-6 lg:px-16 xl:pl-20 xl:pr-28 py-6 sm:py-8 lg:py-12 flex items-center flex-col sm:flex-row sm:space-x-6 lg:space-x-28">
          <div className="flex flex-col items-center">
            <p className="text-[22px] mb-6">Overall Score</p>
            <RingProgress
              size={220}
              thickness={16}
              roundCaps
              label={
                <Text
                  size="xs"
                  align="center"
                  className={`font-black ${
                    metadataAnswer?.lms_score != -1 ? 'text-6xl' : 'text-xl'
                  } text-black `}
                >
                  {metadataAnswer?.lms_score != -1
                    ? metadataAnswer?.lms_score
                    : 'Waiting'}
                </Text>
              }
              sections={[
                {
                  value:
                    ((metadataAnswer?.lms_score != -1
                      ? metadataAnswer?.lms_score
                      : 0) *
                      100) /
                    (metadataAnswer?.scale ?? 9),
                  color: '#0067C5',
                },
              ]}
              rootColor="#E2EBF3"
            />
          </div>
          <div className="flex-1">
            <p className="text-[22px]">
              Speaking skills{' '}
              {metadataAnswer?.bot_review && (
                <span className="text-ct-secondary-500">(Scored by AI)</span>
              )}
            </p>
            {metadataAnswer?.speaking?.map((itemSkill: any, index: number) => {
              return (
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: itemSkill?.title,
                      }}
                    ></p>
                    <p className="font-bold">{itemSkill?.lms_score}</p>
                  </div>
                  <Progress
                    className="w-full bg-ct-neutral-200"
                    classNames={{
                      bar: 'bg-ct-primary-400',
                    }}
                    radius="lg"
                    size="xl"
                    value={(itemSkill?.lms_score * 100) / itemSkill?.max_score}
                  />
                </div>
              );
            })}
            {metadataAnswer?.lms_score != -1 ? (
              ''
            ) : (
              <p className="text-xl text-ct-primary-400">Waiting</p>
            )}
          </div>
        </div>
        <MoreInfo
          className="sm:mx-6 lg:mx-20 xl:mx-28 px-4 sm:px-6 lg:px-14"
          testFormat={TestType.Speaking}
          metadataAnswer={metadataAnswer}
        />

        {/* Explain */}
        <AnswerSpeaking
          listQuestion={listQuestion}
          listAnswer={listUserAnswer}
          isTeacherReview={metadataAnswer?.teacher_review?.length > 0}
        />

        {metadataAnswer?.teacher_review?.length > 0 ? (
          <div className="mx-6 mt-4">
            <Discussion
              score_ielts={metadataAnswer?.lms_score}
              teacher_review={metadataAnswer?.teacher_review[0]}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AnswerKey;
