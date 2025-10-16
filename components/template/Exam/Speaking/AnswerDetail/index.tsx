/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Discussion from '@/components/organisms/Exam/AnswerDetail/Discussion';
import Interview from '@/components/organisms/Exam/AnswerDetail/Interview';
import HeaderTest from '@/components/organisms/Exam/HeaderTest';
import { TestType } from '@/enum';
import { ArrowDown2 } from 'iconsax-react';
const Person = '/images/Person.svg';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getHistoryDetail } from '@/service/api/examConfig';
import { notify } from '@/utils/notify';

const AnswerDetail = () => {
  const router = useRouter();
  const params = router.query;
  const { idHistory } = params;
  
  const pathname = router.asPath;
  const [metadataAnswer, setMetadatAnswer] = useState<any>();
  const [listQuestion, setListQuestion] = useState<any>([]);
  const [listUserAnswer, setListUserAnswer] = useState<any>([]);
  const [redoStatus, setRedoStatus] = useState(true);

  const getExamHistoryDetail = () => {
    getHistoryDetail(`${idHistory}`)
      .then(res => {
        const index = res?.data?.data?.rounds?.findIndex(
          (item: any) => item.test_format === TestType.Speaking,
        );
        setMetadatAnswer(res.data.data?.rounds[index]);
        setRedoStatus(res?.data?.data?.redo_status);
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
        setMetadatAnswer(res.data.data);
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
        router.replace('/');
        notify({
          type: 'error',
          message: err?.response?.data?.message,
          delay: 500,
        });
      });
  };

  useEffect(() => {
    if (idHistory) {
      if (pathname.includes('/exam')) getExamHistoryPart();
      else getExamHistoryDetail();
    }
  }, [idHistory]);

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

  return (
    <div className="bg-[#EFF1F4] pt-[62px] sm:pt-16 fixed top-0 left-0 right-0 bottom-0">
      <HeaderTest
        type="answer-detail"
        childrenHeader={() => {
          return <></>;
        }}
        showDrawer={false}
        showOpenDraw={false}
        redoStatus={redoStatus}
        metadata={metadataAnswer}
      />
      <div className="h-full overflow-y-auto scroll-smooth pb-10">
        <div className="bg-white mx-0 sm:mx-6 lg:mx-20 xl:mx-28 my-10 lg:my-12 sm:rounded-2xl py-4 lg:py-6">
          <div className="flex items-center justify-center my-6 lg:my-[40px]">
            <img
              src={Person}
              width={25}
              height={25}
              className="mr-[16px]"
              alt=""
            />
            <h2 className="text-2xl text-center">IELTS Speaking Test</h2>
          </div>

          <div className="mx-4 sm:mx-6 mt-4">
            {/* <Disclosure ref={refPart1} defaultOpen={true}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between rounded-t-lg bg-ct-neutral-200 px-2 sm:px-6 py-2 text-left focus:outline-none focus-visible:ring">
                    <p>
                      <span className="text-2xl">PART 1</span>
                      <span className="text-xl ml-2 sm:ml-6">
                        Introduction and Interview
                      </span>
                    </p>
                    <ArrowDown2
                      className={`${open && 'rotate-180'}`}
                      size="18"
                      color="#000000"
                    />
                  </Disclosure.Button>

                  <Transition
                    enter="transition duration-150 ease-linear"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-150 ease-linear"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel>
                      <Interview
                        listQuestion={listQuestion[0] || []}
                        listAudioAnswer={listUserAnswer}
                      />
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            <Disclosure ref={refPart2}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between bg-ct-neutral-200 px-2 sm:px-6 py-2 text-left focus:outline-none focus-visible:ring">
                    <p>
                      <span className="text-2xl">PART 2</span>
                      <span className="text-xl ml-2 sm:ml-6">
                        Individual long turn
                      </span>
                    </p>
                    <ArrowDown2
                      className={`${open && 'rotate-180'}`}
                      size="18"
                      color="#000000"
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-150 ease-linear"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-150 ease-linear"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel>
                      <Interview
                        listQuestion={listQuestion[1] || []}
                        listAudioAnswer={listUserAnswer}
                      />
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            <Disclosure ref={refPart3}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between rounded-b-lg bg-ct-neutral-200 px-2 sm:px-6 py-2 text-left focus:outline-none focus-visible:ring">
                    <p>
                      <span className="text-2xl">PART 3</span>
                      <span className="text-xl ml-2 sm:ml-6">
                        Two-way discussion
                      </span>
                    </p>
                    <ArrowDown2
                      className={`${open && 'rotate-180'}`}
                      size="18"
                      color="#000000"
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-150 ease-linear"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-150 ease-linear"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel>
                      <Interview
                        listQuestion={listQuestion[2] || []}
                        listAudioAnswer={listUserAnswer}
                      />
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure> */}
            <Accordion className="custom-accordion" defaultExpanded>
              <AccordionSummary
                expandIcon={<ArrowDown2 size="18" color="#000000" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <p>
                  <span className="text-2xl">PART 1</span>
                  <span className="text-xl ml-2 sm:ml-6">
                    Introduction and Interview
                  </span>
                </p>
              </AccordionSummary>
              <AccordionDetails>
                <Interview
                  listQuestion={listQuestion[0] || []}
                  listAudioAnswer={listUserAnswer}
                />
              </AccordionDetails>
            </Accordion>
            {listQuestion[1]?.length > 0 && (
              <Accordion className="custom-accordion">
                <AccordionSummary
                  expandIcon={<ArrowDown2 size="18" color="#000000" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <p>
                    <span className="text-2xl">PART 2</span>
                    <span className="text-xl ml-2 sm:ml-6">
                      Individual long turn
                    </span>
                  </p>
                </AccordionSummary>
                <AccordionDetails>
                  <Interview
                    listQuestion={listQuestion[1] || []}
                    listAudioAnswer={listUserAnswer}
                  />
                </AccordionDetails>
              </Accordion>
            )}
            {listQuestion[2]?.length > 0 && (
              <Accordion className="custom-accordion">
                <AccordionSummary
                  expandIcon={<ArrowDown2 size="18" color="#000000" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <p>
                    <span className="text-2xl">PART 3</span>
                    <span className="text-xl ml-2 sm:ml-6">
                      Two-way discussion
                    </span>
                  </p>
                </AccordionSummary>
                <AccordionDetails>
                  <Interview
                    listQuestion={listQuestion[2] || []}
                    listAudioAnswer={listUserAnswer}
                  />
                </AccordionDetails>
              </Accordion>
            )}
          </div>

          {metadataAnswer?.teacher_review?.length > 0 ? (
            <div className="mx-6 mt-4">
              <Discussion
                score_ielts={metadataAnswer?.score?.score_ielts}
                teacher_review={metadataAnswer?.teacher_review[0]}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AnswerDetail;
