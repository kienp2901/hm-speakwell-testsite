/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import { Skeleton } from '@mantine/core';
import HeaderTest from '@/components/organisms/Exam/HeaderTest';
import Button from '@/components/sharedV2/Button';
import { Book1, Edit2 } from 'iconsax-react';
const ListeningIcon = '/images/listening_icon2.svg';
const SpeakingIcon = '/images/speaking_icon2.svg';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { getMockcontestHistoryApi } from '@/service/api/packageApi';
import { getMockcontestHistoryApi } from '@/service/api/examConfig';
import { getTestFormat } from '@/utils';
import { notify } from '@/utils/notify';
import { t } from 'i18next';

const FullResult = () => {
  const router = useRouter();
  const params = router.query;
  const { idExam, idHistory } = params;

  const [loadingData, setLoadingData] = useState(true);
  const [metadata, setMetadata] = useState<any>();

  useEffect(() => {
    const getExamHistoryDetail = () => {
      getMockcontestHistoryApi({
        idMockContest: Number(idExam),
        idHistoryContest: `${idHistory}`,
      })
        .then(res => {
          setLoadingData(false);
          setMetadata(res.data.data[0]);
        })
        .catch(err => {
          const redirectPath = params.tenant && params.campaign && params.slug 
            ? `/${params.tenant}/${params.campaign}/${params.slug}/`
            : '/';
          router.replace(redirectPath);
          notify({
            type: 'error',
            message: err?.response?.data?.message,
            delay: 500,
          });
        });
    };
    if (idHistory) {
      getExamHistoryDetail();
    }
  }, [idHistory]);

  const onClickViewDetailAnswer = (item: any) => {
    router.push(
      `/${params.tenant}/${params.campaign}/${params.slug}/exam/${getTestFormat(item?.testFormat)}/${idExam}/${item?.idHistory}/answer-key`,
    );
  };

  const getTimeCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    let minute = 0;
    let second = 0;
    if (hours > 0) {
      minute = Math.floor((seconds - 3600 * hours) / 60);
    } else {
      minute = Math.floor(seconds / 60);
    }
    second = seconds - 3600 * hours - minute * 60;

    return `${hours > 9 ? hours : hours > 0 ? `0${hours}` : ''}${
      hours > 0 ? ' hour ' : ''
    }${minute > 9 ? minute : minute > 9 ? `0${minute}` : ''} ${
      minute > 0 ? ' minutes ' : ''
    } ${second > 9 ? second : second > 9 ? `0${second}` : ''} ${
      second > 0 ? ' seconds' : ''
    }`;
  };

  const skeletonoading = () => {
    return (
      <div className="mt-6 px-4 sm:px-6 bg-[#F0F6FF] w-full py-6 flex items-center flex-wrap justify-center rounded-2xl space-y-4 sm:space-y-0 sm:space-x-6">
        <Skeleton height={200} circle />
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full sm:w-auto flex-none xl:flex-1 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} height={144} width={400} radius="xl" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-[62px] sm:pt-16 fixed top-0 left-0 right-0 bottom-0">
      <HeaderTest
        type="full-result"
        childrenHeader={() => {
          return <></>;
        }}
        showDrawer={false}
        showOpenDraw={false}
        redoStatus={false}
        metadata={metadata}
      />
      <div className="pt-12 lg:pt-20 px-4 sm:px-10 lg:px-16 xl:px-24 h-full overflow-y-auto scroll-smooth pb-10">
        <h2 className="text-2xl flex items-center justify-center text-center">
          {t('full_result_exam.congratulations_completed')}
        </h2>
        <p className="mt-6 text-center">
          {t('full_result_exam.here_are_your_score')}
        </p>
        {loadingData ? (
          skeletonoading()
        ) : (
          <div className="mt-6 px-4 sm:px-6 bg-[#F0F6FF] w-full py-6 flex items-center flex-wrap justify-center rounded-2xl space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="items-center flex flex-col">
              <div
                className={` w-40 h-40 lg:w-[200px] lg:h-[200px] ${
                  metadata?.status
                    ? 'bg-[#5ABB10] text-white'
                    : 'bg-ct-fail text-white'
                } rounded-full flex flex-col justify-center space-y-2 items-center`}
              >
                <p className="text-[22px]">{t('full_result_exam.overall')}</p>
                <p
                  className={`${
                    metadata?.overall_score == -1
                      ? 'text-3xl'
                      : 'text-6xl font-bold'
                  }`}
                >
                  {metadata?.overall_score == -1
                    ? t('full_result_exam.waiting')
                    : metadata?.overall_score}
                </p>
                
              </div>
              {metadata?.overall_score == -1 ? null : (
                <div
                  className={`w-28 h-7 flex items-center justify-center rounded border ${
                    metadata?.status
                      ? 'border-ct-green-100 text-ct-green-100'
                      : 'border-ct-fail text-ct-fail'
                  } my-[10px]`}
                >
                  <p className="text-sm font-normal">
                    {metadata?.status
                      ? t('full_result_exam.passed')
                      : t('full_result_exam.failed')}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 w-full sm:w-auto flex-none xl:flex-1 gap-4 sm:gap-6">
              {/* listening */}
              <div className="bg-white rounded-lg py-4 pl-4 pr-2 flex flex-wrap sm:items-center sm:justify-between w-full">
                <div className="sm:w-1/2">
                  <h4 className="flex items-center text-xl">
                    <img className="mr-4" src={ListeningIcon} alt="" />
                    {t('full_result_exam.ielts_listening')}
                  </h4>
                  <p className="mt-3">
                    {t('full_result_exam.time')}:{' '}
                    {getTimeCountdown(metadata?.rounds[0]?.timeAllow)}
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`${
                        !metadata?.rounds[0]?.exam_scores?.graded
                          ? 'bg-ct-green-100 text-base font-medium'
                          : metadata?.rounds[0]?.exam_scores?.status
                          ? 'bg-ct-green-100 text-base font-medium'
                          : 'bg-ct-fail text-xl font-white'
                      } w-24 h-12 rounded-[100px] text-white inline-flex items-center mr-6 justify-center`}
                    >
                      {!metadata?.rounds[0]?.exam_scores?.graded
                        ? t('full_result_exam.waiting')
                        : metadata?.rounds[0]?.exam_scores?.lms_score}
                    </span>
                    {metadata?.rounds[0]?.exam_scores?.graded && (
                      <div
                        className={`w-28 h-7 flex items-center justify-center rounded border ${
                          !metadata?.rounds[0]?.exam_scores?.graded
                            ? 'bg-ct-green-100 text-base font-medium'
                            : metadata?.rounds[0]?.exam_scores?.status
                            ? 'border-ct-green-100 text-ct-green-100'
                            : 'border-ct-fail text-ct-fail'
                        } my-[10px]`}
                      >
                        <p className="text-sm font-normal">
                          {metadata?.rounds[0]?.exam_scores?.status
                            ? t('full_result_exam.passed')
                            : t('full_result_exam.failed')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {metadata?.rounds[0]?.idHistory &&
                  metadata?.rounds[0]?.exam_scores?.graded && (
                    <div className="flex items-center flex-1 justify-center sm:justify-end space-x-4 sm:space-x-6 mt-2 sm:mt-0">
                      <Button
                        onClick={() =>
                          onClickViewDetailAnswer(metadata?.rounds[0])
                        }
                        style={{ width: '133px' }}
                        >
                          {t('full_result_exam.view_details')}
                      </Button>
                    </div>
                  )}
              </div>

              {/* Reading */}
              <div className="bg-white rounded-lg py-4 pl-4 pr-2 flex flex-wrap sm:items-center sm:justify-between w-full">
                <div className="sm:w-1/2">
                  <h4 className="flex items-center text-xl">
                    <Book1
                      className="mr-4"
                      size="24"
                      color="#000000"
                      variant="Bold"
                    />
                    {t('full_result_exam.reading')}
                  </h4>
                  <p className="mt-3">
                    {t('full_result_exam.time')}:{' '}
                    {getTimeCountdown(metadata?.rounds[1]?.timeAllow)}
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`${
                        !metadata?.rounds[1]?.exam_scores?.graded
                          ? 'bg-ct-green-100 text-base font-medium'
                          : metadata?.rounds[1]?.exam_scores?.status
                          ? 'bg-ct-green-100 text-base font-medium'
                          : 'bg-ct-fail text-xl font-white'
                      } w-24 h-12 rounded-[100px] text-white inline-flex items-center mr-6 justify-center`}
                    >
                      {!metadata?.rounds[1]?.exam_scores?.graded
                        ? t('full_result_exam.waiting')
                        : metadata?.rounds[1]?.exam_scores?.lms_score}
                    </span>
                    {metadata?.rounds[1]?.exam_scores?.graded && (
                      <div
                        className={`w-28 h-7 flex items-center justify-center rounded border ${
                          metadata?.rounds[1]?.exam_scores?.status
                            ? 'border-ct-green-100 text-ct-green-100'
                            : 'border-ct-fail text-ct-fail'
                        } my-[10px]`}
                      >
                        <p className="text-sm font-normal">
                          {metadata?.rounds[1]?.exam_scores?.status
                            ? t('full_result_exam.passed')
                            : t('full_result_exam.failed')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {metadata?.rounds[1]?.idHistory &&
                  metadata?.rounds[1]?.exam_scores?.graded && (
                    <div className="flex flex-1 items-center justify-center sm:justify-end space-x-4 sm:space-x-6 mt-2 sm:mt-0">
                      <Button
                        onClick={() =>
                          onClickViewDetailAnswer(metadata?.rounds[1])
                        }
                        style={{ width: '133px' }}
                      >
                        {t('full_result_exam.view_details')}
                      </Button>
                    </div>
                  )}
              </div>

              {/* Writing */}
              <div className="bg-white rounded-lg py-4 pl-4 pr-2 flex flex-wrap sm:items-center sm:justify-between w-full">
                <div className="sm:w-1/2">
                  <h4 className="flex items-center text-xl">
                    <Edit2
                      className="mr-4"
                      size="24"
                      color="#000000"
                      variant="Bold"
                    />
                    {t('full_result_exam.writing')}
                  </h4>
                  <p className="mt-3">
                    {t('full_result_exam.time')}:{' '}
                    {getTimeCountdown(metadata?.rounds[2]?.timeAllow)}
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`${
                        !metadata?.rounds[2]?.exam_scores?.graded
                          ? 'bg-ct-green-100 text-base font-medium'
                          : metadata?.rounds[2]?.exam_scores?.status
                          ? 'bg-ct-green-100 text-base font-medium'
                          : 'bg-ct-fail text-xl font-white'
                      } w-24 h-12 rounded-[100px] text-white inline-flex items-center mr-6 justify-center`}
                    >
                      {!metadata?.rounds[2]?.exam_scores?.graded
                        ? t('full_result_exam.waiting')
                        : metadata?.rounds[2]?.exam_scores?.lms_score}
                    </span>
                    {metadata?.rounds[2]?.exam_scores?.graded && (
                      <div
                        className={`w-28 h-7 flex items-center justify-center rounded border ${
                          metadata?.rounds[2]?.exam_scores?.status
                            ? 'border-ct-green-100 text-ct-green-100'
                            : 'border-ct-fail text-ct-fail'
                        } my-[10px]`}
                      >
                        <p className="text-sm font-normal">
                          {metadata?.rounds[2]?.exam_scores?.status
                            ? t('full_result_exam.passed')
                            : t('full_result_exam.failed')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {metadata?.rounds[2]?.idHistory &&
                  metadata?.rounds[2]?.exam_scores?.graded && (
                    <div className="flex items-center flex-1 space-x-4 sm:space-x-6 justify-center sm:justify-end mt-2 sm:mt-0">
                      <Button
                        onClick={() =>
                          onClickViewDetailAnswer(metadata?.rounds[2])
                        }
                        style={{ width: '133px' }}
                      >
                        {t('full_result_exam.view_details')}
                      </Button>
                    </div>
                  )}
              </div>

              {/* Speaking */}
              <div className="bg-white rounded-lg py-4 pl-4 pr-2 flex flex-wrap sm:items-center sm:justify-between w-full">
                <div className="sm:w-1/2">
                  <h4 className="flex items-center text-xl">
                    <img className="mr-4" src={SpeakingIcon} alt="" />
                    {t('full_result_exam.speaking')}
                  </h4>
                  <p className="mt-3">
                    {t('full_result_exam.time')}:{' '}
                    {getTimeCountdown(metadata?.rounds[3]?.timeAllow)}
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`${
                        !metadata?.rounds[3]?.exam_scores?.graded
                          ? 'bg-ct-green-100 text-base font-medium'
                          : metadata?.rounds[3]?.exam_scores?.status
                          ? 'bg-ct-green-100 text-base font-medium'
                          : 'bg-ct-fail text-xl font-white'
                      } w-24 h-12 rounded-[100px] text-white inline-flex items-center mr-6 justify-center`}
                    >
                      {!metadata?.rounds[3]?.exam_scores?.graded
                        ? t('full_result_exam.waiting')
                        : metadata?.rounds[3]?.exam_scores?.lms_score}
                    </span>
                    {metadata?.rounds[3]?.exam_scores?.graded && (
                      <div
                        className={`w-28 h-7 flex items-center justify-center rounded border ${
                          metadata?.rounds[3]?.exam_scores?.status
                            ? 'border-ct-green-100 text-ct-green-100'
                            : 'border-ct-fail text-ct-fail'
                        } my-[10px]`}
                      >
                        <p className="text-sm font-normal">
                          {metadata?.rounds[3]?.exam_scores?.status
                            ? t('full_result_exam.passed')
                            : t('full_result_exam.failed')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {metadata?.rounds[3]?.idHistory &&
                  metadata?.rounds[3]?.exam_scores?.graded && (
                    <div className="flex items-center flex-1 space-x-4 sm:space-x-6 justify-center sm:justify-end mt-2 sm:mt-0">
                      <Button
                        onClick={() =>
                          onClickViewDetailAnswer(metadata?.rounds[3])
                        }
                        style={{ width: '133px' }}
                      >
                        {t('full_result_exam.view_details')}
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullResult;
