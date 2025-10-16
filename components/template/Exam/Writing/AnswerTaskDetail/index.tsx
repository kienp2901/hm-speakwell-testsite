import Discussion from '@/components/organisms/Exam/AnswerDetail/Discussion';
import HeaderTest from '@/components/organisms/Exam/HeaderTest';
import ZoomIn from '@/components/sharedV2/ZoomIn';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getHistoryDetail, getHistoryPartDetail } from '@/service/api/examConfig';
import { notify } from '@/utils/notify';
import { InfoCircle } from 'iconsax-react';
import { listTabAIWriting } from '@/enum';

const AnswerTaskDetail = () => {
  const router = useRouter();
  const params = router.query;
  const { idHistory, idQuestion } = params;
  
  const location = { pathname: router.asPath, state: {} };

  const [metadataAnswer, setMetadataAnswer] = useState<any>({});
  const [selectReview, setSelectReview] = useState(0);
  const [dataResultAI, setDataResultAI] = useState<any>([]);

  useEffect(() => {
    const getExamHistoryDetail = () => {
      getHistoryDetail(`${idHistory}`)
        .then(res => {
          setMetadataAnswer(res.data.metadata?.rounds[0]);
        })
        .catch(err => {
          router.replace('/');
          notify({
            type: 'error',
            message: err?.response?.data?.message,
            delay: 500,
          });
        });
    };

    const getExamHistoryPart = () => {
      getHistoryDetail(`${idHistory}`)
        .then(res => {
          setMetadataAnswer(res.data.data);
        })
        .catch(err => {
          router.replace('/');
          notify({
            type: 'error',
            message: err?.response?.data?.message,
            delay: 500,
          });
        });
    };

    if (idHistory) {
      if (location.pathname.includes('/exam')) getExamHistoryPart();
      else getExamHistoryDetail();
    }
  }, [idHistory]);

  const exitCurrentPage = () => {
    router.back();
  };

  const convertTextToHtml = (text: string) => {
    const html = text
      ?.split('\n')
      .map(line => {
        if (line.startsWith('## ')) {
          return `<h2>${line.substring(3)}</h2>`;
        } else if (line.startsWith('* ')) {
          return `<ul><li>${line.substring(2)}</li></ul>`;
        } else if (line.startsWith('    * ')) {
          return `<li>${line.substring(6)}</li>`;
        } else {
          return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}</p>`;
        }
      })
      .join('');
    return html;
  };

  useEffect(() => {
    if (Object.keys(metadataAnswer).length > 0) {
      const currentQuest = metadataAnswer?.listQuestionGraded.find(
        (itemQuest: any) => itemQuest?.idQuestion == Number(idQuestion),
      );
      if (currentQuest) {
        // let dataAI = JSON.parse(currentQuest?.suggestions);
        setDataResultAI(currentQuest?.externalGradingDetail?.content);
      }
      const eleComment = document.getElementsByTagName('comment');

      eleComment.length > 0 &&
        Array.from(eleComment).forEach((item: any) => {
          const image = document.createElement('img');
          const contentCmt = document.createElement('div');
          contentCmt.innerHTML = item?.getAttribute('content');
          image.setAttribute(
            'src',
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMTYgMkg4QzQgMiAyIDQgMiA4djEzYzAgLjU1LjQ1IDEgMSAxaDEzYzQgMCA2LTIgNi02VjhjMC00LTItNi02LTZabS0yIDEzLjI1SDdjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWg3Yy40MSAwIC43NS4zNC43NS43NXMtLjM0Ljc1LS43NS43NVptMy01SDdjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWgxMGMuNDEgMCAuNzUuMzQuNzUuNzVzLS4zNC43NS0uNzUuNzVaIiBmaWxsPSIjMDA2N2M1Ij48L3BhdGg+PC9zdmc+',
          );
          image.classList.add('icon-comment-writing');
          contentCmt.classList.add('content-comment-writing');
          item?.appendChild(image);
          item?.appendChild(contentCmt);
        });
    }
  }, [metadataAnswer]);

  return (
    <div className="bg-[#EFF1F4] pt-[62px] sm:pt-16 fixed top-0 left-0 right-0 bottom-0">
      <HeaderTest
        type="answer-task-detail"
        childrenHeader={() => {
          return <></>;
        }}
        exitCurrentPage={exitCurrentPage}
        showDrawer={false}
        showOpenDraw={false}
        metadata={metadataAnswer}
      />
      <div className="h-full overflow-y-auto scroll-smooth pt-8 pb-10">
        <div className="bg-white mx-4 sm:mx-6 lg:mx-28 my-6 lg:my-12 rounded-2xl py-6">
          <div className="flex items-center justify-center my-[40px]">
            <h2 className="text-2xl text-ct-primary-400 text-center">
              Result - Writing Task{' '}
              {metadataAnswer?.listQuestion?.findIndex(
                (itemQues: any) => itemQues?.idQuestion == Number(idQuestion),
              ) + 1}
            </h2>
          </div>
          <div className="bg-[#E2EBF3] rounded-2xl p-4 mx-6">
            <p className="text-xl">
              Task{' '}
              {metadataAnswer?.listQuestion?.findIndex(
                (itemQues: any) => itemQues?.idQuestion == Number(idQuestion),
              ) + 1}
            </p>
            <div className="bg-white p-3 mt-3 rounded-2xl overflow-x-auto">
              <div
                className="rounded-2xl answer-table"
                dangerouslySetInnerHTML={{
                  __html:
                    metadataAnswer?.listQuestion?.find(
                      (itemQues: any) =>
                        itemQues?.idQuestion == Number(idQuestion),
                    )?.text || '',
                }}
              ></div>
              {metadataAnswer?.listQuestion?.find(
                (itemQues: any) => itemQues?.idQuestion == Number(idQuestion),
              )?.image ? (
                <div className="flex items-center">
                  <ZoomIn
                    src={
                      metadataAnswer?.listQuestion?.find(
                        (itemQues: any) =>
                          itemQues?.idQuestion == Number(idQuestion),
                      )?.image
                    }
                    className="h-[500px] my-4 rounded-2xl"
                    alt="IMG"
                  />
                </div>
              ) : (
                ''
              )}
              {metadataAnswer?.listQuestion?.find(
                (itemQues: any) => itemQues?.idQuestion == Number(idQuestion),
              )?.audio ? (
                <audio
                  src={
                    metadataAnswer?.listQuestion?.find(
                      (itemQues: any) =>
                        itemQues?.idQuestion == Number(idQuestion),
                    )?.audio
                  }
                  controls
                ></audio>
              ) : (
                ''
              )}
              {metadataAnswer?.listQuestion?.find(
                (itemQues: any) => itemQues?.idQuestion == Number(idQuestion),
              )?.video ? (
                <video
                  src={
                    metadataAnswer?.listQuestion?.find(
                      (itemQues: any) =>
                        itemQues?.idQuestion == Number(idQuestion),
                    )?.video
                  }
                  controls
                  className="w-[560px] h-[315px] rounded-xl"
                ></video>
              ) : (
                ''
              )}
            </div>
          </div>

          <div className="mx-6 mt-6 mb-4 text-xl">
            <p>Candidate&apos;s Submission</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#7893B0] p-4 mx-6">
            <p
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: metadataAnswer?.listQuestionGraded?.find(
                  (itemQues: any) => itemQues?.idQuestion == Number(idQuestion),
                )?.userAnswer,
              }}
            ></p>
          </div>

          {metadataAnswer?.teacher_review?.length > 0 ? (
            <div className="mx-6 mt-4">
              <Discussion
                score_ielts={
                  metadataAnswer?.score?.tasks?.find(
                    (itemQues: any) =>
                      itemQues?.question_id == Number(idQuestion),
                  ).final_score
                }
                teacher_review={metadataAnswer?.teacher_review?.find(
                  (itemQues: any) =>
                    itemQues?.question_id == Number(idQuestion),
                )}
              />
            </div>
          ) : (
            <div className="mx-6 mt-6">
              <h4 className="text-xl">AI Evaluation</h4>
              {dataResultAI?.length > 0 ? (
                <div className="relative my-4 w-full">
                  <div className=" relative w-[100% ] flex flex-wrap sm:flex-nowrap overflow-x-auto gap-2">
                    {listTabAIWriting.map((item, indexReview) => {
                      if (
                        indexReview == 5 &&
                        metadataAnswer?.listQuestion.findIndex(
                          (itemQuest: any) =>
                            itemQuest?.idQuestion == Number(idQuestion),
                        ) == 0
                      )
                        return null;
                      return (
                        <div
                          onClick={() => setSelectReview(indexReview)}
                          key={`review-${item.key}`}
                          className={`cursor-pointer flex flex-shrink-0 items-center px-4 py-2 rounded-xl ${
                            selectReview == indexReview
                              ? 'bg-ct-primary-500'
                              : 'bg-neutral-200'
                          }`}
                        >
                          <p
                            className={`${
                              selectReview == indexReview
                                ? 'text-base font-medium text-white'
                                : 'text-sm font-medium text-neutral-500'
                            }`}
                            dangerouslySetInnerHTML={{
                              __html:
                                indexReview == 1 &&
                                metadataAnswer?.listQuestion.findIndex(
                                  (itemQuest: any) =>
                                    itemQuest?.idQuestion == Number(idQuestion),
                                ) == 0
                                  ? 'Task Achievement'
                                  : item.title,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {dataResultAI?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[#7893B0] p-4 mt-4">
                      {selectReview == 0 ? (
                        <div className="mt-4 border border-[#7893B0] p-4 rounded-2xl">
                          <p
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                              __html: convertTextToHtml(
                                dataResultAI.find(
                                  (item: any) =>
                                    Number(item.part_number) ==
                                    selectReview + 1,
                                )?.data?.comment,
                              ),
                            }}
                          ></p>
                        </div>
                      ) : selectReview == 5 ? (
                        <p
                          className={`${'text-base text-black'}`}
                          dangerouslySetInnerHTML={{
                            __html: dataResultAI.find(
                              (item: any) =>
                                Number(item.part_number) == selectReview + 1,
                            )?.data?.comment?.revised_essay,
                          }}
                        />
                      ) : selectReview == 6 ? (
                        <p
                          className="text-justify answer-table"
                          dangerouslySetInnerHTML={{
                            __html: metadataAnswer?.listQuestion.find(
                              (item: any) =>
                                item.idQuestion == Number(idQuestion),
                            )?.solution,
                          }}
                        />
                      ) : (
                        <div>
                          <span className="text-base text-black font-semibold">
                            Score:{' '}
                            <span className="text-base font-normal text-black">
                              {
                                dataResultAI.find(
                                  (item: any) =>
                                    Number(item.part_number) ==
                                    selectReview + 1,
                                )?.data?.score
                              }
                            </span>
                          </span>
                          <p />
                          <span className="text-base text-black font-semibold">
                            Comment:&nbsp;
                            <span
                              className={`${'text-base font-normal text-black'}`}
                              dangerouslySetInnerHTML={{
                                __html: dataResultAI.find(
                                  (item: any) =>
                                    Number(item.part_number) ==
                                    selectReview + 1,
                                )?.data?.comment?.comment,
                              }}
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 border border-[#7893B0] p-4 rounded-2xl">
                  <p
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: metadataAnswer?.score?.tasks?.find(
                        (itemQues: any) =>
                          itemQues?.question_id == Number(idQuestion),
                      )?.suggestions,
                    }}
                  ></p>
                </div>
              )}
              {/* note */}
              <div className="mt-4 p-2 flex items-center">
                <InfoCircle size="32" color="#ff2323" variant="Bold" />
                <p className="text-sm italic break-words ml-2 flex-1">
                  *The score for your IELTS essay is for reference only and may
                  not align precisely with official scoring. It&apos;s advised to
                  view this assessment as supplementary, and for a comprehensive
                  evaluation, consult qualified IELTS instructors.
                </p>
              </div>
              <table className="mt-6 w-full score">
                <tr>
                  <td className="rounded-l-2xl">Final score</td>
                  <td colSpan={4} className="rounded-r-2xl">
                    <p className="bg-white h-full rounded text-base font-bold text-ct-primary-500 inline-block px-20 py-[3px]">
                      {metadataAnswer?.writing?.find(
                        (itemScore: any) =>
                          itemScore?.task_number ==
                          metadataAnswer?.listQuestion?.find(
                            (itemQuest: any) =>
                              itemQuest?.idQuestion == Number(idQuestion),
                          )?.writingTask,
                      )?.score || 0}
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerTaskDetail;
