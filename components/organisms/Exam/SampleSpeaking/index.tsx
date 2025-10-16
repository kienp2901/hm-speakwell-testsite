/* eslint-disable camelcase */
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import TestAudio from '@/components/organisms/Exam/TestAudio';
import { ArrowDown2 } from 'iconsax-react';
const SpeakingIcon = '/images/speaking_icon2.svg';
import Button from '@/components/sharedV2/Button';
import { useMemo, useState } from 'react';
import { Modal } from '@mantine/core';
import { scaleIeltsScore } from 'utils';
import FeedbackSection from './FeedbackSection';
import PronunciationResult from './PronunciationResult';
import parseFeedback from 'utils/parseFeedback';
import { FEEDBACK_TABS, MODAL_ANSWER_TABS } from 'enum';

type SampleSpeakingProps = {
  listQuestion: any[];
  listAnswer: any[];
  isTeacherReview: boolean;
};

const AnswerSpeaking = ({
  listQuestion,
  listAnswer,
  isTeacherReview,
}: SampleSpeakingProps) => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [idBlock, setIdBlock] = useState<number>(0);
  const [selectReview, setSelectReview] = useState(0);
  const [selectAnswer, setSelectAnswer] = useState<any>(null);
  const [selectQuestion, setSelectQuestion] = useState<any>(null);

  const skillResult = useMemo(
    () => ({
      fluency:
        selectAnswer?.externalGradingDetail?.fluency
          ?.english_proficiency_scores[`mock_ielts`].prediction,
      vocabulary:
        selectAnswer?.externalGradingDetail?.vocabulary
          ?.english_proficiency_scores[`mock_ielts`].prediction,
      grammar:
        selectAnswer?.externalGradingDetail?.grammar
          ?.english_proficiency_scores[`mock_ielts`].prediction,
      pronunciation:
        selectAnswer?.externalGradingDetail?.pronunciation
          ?.english_proficiency_scores[`mock_ielts`].prediction,
    }),
    [selectAnswer],
  );

  const handleData = useMemo(() => {
    if (selectAnswer?.externalGradingDetail)
      return parseFeedback(selectAnswer?.externalGradingDetail);
  }, [selectAnswer]);

  const listTab = useMemo(() => {
    if (selectAnswer && !isTeacherReview) {
      return [...FEEDBACK_TABS, ...MODAL_ANSWER_TABS];
    } else {
      return [...MODAL_ANSWER_TABS];
    }
  }, [selectAnswer, isTeacherReview]);

  const feedbackSections = useMemo(() => {
    if (selectAnswer && !isTeacherReview) {
      return {
        content: <FeedbackSection data={handleData?.metaData} />,
        pronunciation: (
          <PronunciationResult
            words={selectAnswer?.externalGradingDetail?.pronunciation.words}
          />
        ),
        fluency: <FeedbackSection data={handleData?.fluencyFeedback} />,
        grammar: <FeedbackSection data={handleData?.grammarFeedback} />,
        vocabulary: <FeedbackSection data={handleData?.vocabularyFeedback} />,
        modalAnswer: (
          <div className="mb4">
            <div
              className={`w-full sm:w-4/5 lg:w-3/4 px-2 sm:px-4 lg:px-6 py-4`}
            >
              <TestAudio
                srcAudio={selectAnswer?.solution_audio}
                isStart={false}
                type="answer-key"
              />
            </div>
            <p
              className="px-2 sm:px-4 lg:px-6 text-justify answer-table"
              dangerouslySetInnerHTML={{
                __html: selectAnswer?.solution || 'No solution',
              }}
            ></p>
          </div>
        ),
      };
    } else {
      return {
        modalAnswer: (
          <div className="w-full">
            {selectAnswer?.solution_audio && (
              <div className="w-full px-2 sm:px-4 lg:px-6 py-4">
                <TestAudio
                  srcAudio={selectAnswer?.solution_audio}
                  isStart={false}
                  type="answer-key"
                />
              </div>
            )}
            <p
              className="px-2 sm:px-4 lg:px-6 text-justify answer-table"
              dangerouslySetInnerHTML={{
                __html: selectAnswer?.solution || 'No solution',
              }}
            ></p>
          </div>
        ),
      };
    }
  }, [selectAnswer, handleData, isTeacherReview]);

  const progress = useMemo(
    () =>
      selectAnswer &&
      Object.fromEntries([
        [
          'overall',
          ((selectAnswer?.externalGradingDetail?.overall
            .english_proficiency_scores
            ? selectAnswer?.externalGradingDetail?.overall
                .english_proficiency_scores[`mock_ielts`].prediction
            : 0) /
            9) *
            100,
        ],
        ...Object.entries(skillResult).map(([skill, score]) => [
          skill,
          scaleIeltsScore((score / 9) * 100),
        ]),
      ]),
    [selectAnswer, skillResult],
  );

  const onpenModalDetail = (
    idBlock: number,
    currentQuest: any,
    currentAns?: any,
  ) => {
    setOpenModal(true);
    setIdBlock(idBlock);
    setSelectQuestion(currentQuest);
    setSelectAnswer(currentAns || null);
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setSelectAnswer(null);
    setSelectQuestion(null);
    setSelectReview(0);
  };

  return (
    <div className="bg-white my-6 py-6 sm:py-10 sm:rounded-2xl sm:mx-6 lg:mx-20 xl:mx-28 px-2 sm:px-6">
      <div className="flex items-center justify-center mb-10">
        <img className="w-8 h-8 mr-3" src={SpeakingIcon} alt="" />
        <h3 className="text-2xl text-center font-medium">Your Answers</h3>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full md:w-3/4 lg:w-3/4 border rounded-lg">
          <Accordion className="custom-accordion">
            <AccordionSummary
              expandIcon={<ArrowDown2 size="18" color="#000000" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className="bg-ct-neutral-200"
            >
              <p>
                <span className="text-2xl">PART 1</span>
                <span className="text-xl ml-2 sm:ml-6">
                  Introduction and Interview
                </span>
              </p>
            </AccordionSummary>
            <AccordionDetails>
              <div className="py-4 sm:p-4 lg:p-6 pr-0">
                {listQuestion[0]?.map((item: any, index: number) => {
                  const isAnswer = listAnswer.findIndex(
                    itemAnswer => itemAnswer.idQuestion == item.idQuestion,
                  );
                  return (
                    <div key={index} className="mb-4">
                      <div className="flex items-center">
                        <span className="w-9 h-9 inline-flex justify-center items-center rounded-full border border-ct-primary-400 text-ct-primary-400 text-lg font-medium mr-4">
                          {index + 1}
                        </span>
                        <p
                          className="flex-1"
                          dangerouslySetInnerHTML={{
                            __html: item?.text,
                          }}
                        ></p>
                      </div>
                      <div className="w-full flex flex-shrink-0 flex-col sm:flex-row py-4">
                        {isAnswer != -1 ? (
                          <>
                            <TestAudio
                              srcAudio={listAnswer[isAnswer]?.filepath}
                              isStart={false}
                              type="answer-key"
                              className={'flex-1'}
                            />
                            <div className="w-full sm:w-32 flex items-center justify-center mt-4 sm:mt-0">
                              <Button
                                className="flex-shrink-0"
                                onClick={() =>
                                  onpenModalDetail(
                                    0,
                                    item,
                                    isAnswer != -1
                                      ? listAnswer[isAnswer]
                                      : null,
                                  )
                                }
                              >
                                View Details
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-1 items-center text-red-500">
                              No Answer
                            </div>
                            <div className="w-full sm:w-36 flex items-center justify-center mt-4 sm:mt-0">
                              <Button onClick={() => onpenModalDetail(0, item)}>
                                Modal Answer
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionDetails>
          </Accordion>
          {listQuestion[1]?.length > 0 && (
            <Accordion className="custom-accordion">
              <AccordionSummary
                expandIcon={<ArrowDown2 size="18" color="#000000" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="bg-ct-neutral-200"
              >
                <p>
                  <span className="text-2xl">PART 2</span>
                  <span className="text-xl ml-2 sm:ml-6">
                    Individual long turn
                  </span>
                </p>
              </AccordionSummary>
              <AccordionDetails>
                <div className="py-2">
                  {listQuestion[1]?.map((item: any, index: number) => {
                    const isAnswer = listAnswer.findIndex(
                      itemAnswer => itemAnswer.idQuestion == item.idQuestion,
                    );
                    return (
                      <div className="mb-4" key={index}>
                        <div
                          className="bg-ct-neutral-200 py-2 px-6 rounded-lg"
                          dangerouslySetInnerHTML={{
                            __html: item?.text,
                          }}
                        ></div>
                        <div className="w-full flex flex-shrink-0 flex-col sm:flex-row py-4">
                          {isAnswer != -1 ? (
                            <>
                              <TestAudio
                                srcAudio={listAnswer[isAnswer]?.filepath}
                                isStart={false}
                                type="answer-key"
                                className={'flex-1'}
                              />
                              <div className="w-full sm:w-32 flex items-center justify-center mt-4 sm:mt-0">
                                <Button
                                  className="flex-shrink-0"
                                  onClick={() =>
                                    onpenModalDetail(
                                      1,
                                      item,
                                      isAnswer != -1
                                        ? listAnswer[isAnswer]
                                        : null,
                                    )
                                  }
                                >
                                  View Details
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-1 items-center text-red-500">
                                No Answer
                              </div>
                              <div className="w-full sm:w-36 flex items-center justify-center mt-4 sm:mt-0">
                                <Button
                                  onClick={() => onpenModalDetail(1, item)}
                                >
                                  Modal Answer
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          )}
          {listQuestion[2]?.length > 0 && (
            <Accordion className="custom-accordion">
              <AccordionSummary
                expandIcon={<ArrowDown2 size="18" color="#000000" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="bg-ct-neutral-200"
              >
                <p>
                  <span className="text-2xl">PART 3</span>
                  <span className="text-xl ml-2 sm:ml-6">
                    Two-way discussion
                  </span>
                </p>
              </AccordionSummary>
              <AccordionDetails>
                <div className="py-4 sm:p-4 lg:p-6 pr-0">
                  {listQuestion[2]?.map((item: any, index: number) => {
                    const isAnswer = listAnswer.findIndex(
                      itemAnswer => itemAnswer.idQuestion == item.idQuestion,
                    );
                    return (
                      <div key={index} className="mb-4">
                        <div className="flex items-center">
                          <span className="w-9 h-9 inline-flex justify-center items-center rounded-full border border-ct-primary-400 text-ct-primary-400  text-lg font-medium mr-4">
                            {index + 1}
                          </span>
                          <p
                            className="flex-1"
                            dangerouslySetInnerHTML={{
                              __html: item?.text,
                            }}
                          ></p>
                        </div>
                        <div className="w-full flex flex-shrink-0 flex-col sm:flex-row py-4">
                          {isAnswer != -1 ? (
                            <>
                              <TestAudio
                                srcAudio={listAnswer[isAnswer]?.filepath}
                                isStart={false}
                                type="answer-key"
                                className={'flex-1'}
                              />
                              <div className="w-full sm:w-32 flex items-center justify-center mt-4 sm:mt-0">
                                <Button
                                  className="flex-shrink-0"
                                  onClick={() =>
                                    onpenModalDetail(
                                      2,
                                      item,
                                      isAnswer != -1
                                        ? listAnswer[isAnswer]
                                        : null,
                                    )
                                  }
                                >
                                  View Details
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-1 items-center text-red-500">
                                No Answer
                              </div>
                              <div className="w-full sm:w-36 flex items-center justify-center mt-4 sm:mt-0">
                                <Button
                                  onClick={() => onpenModalDetail(2, item)}
                                >
                                  Modal Answer
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          )}
        </div>
      </div>
      {/* Modal detail answer */}
      <Modal
        centered
        size={'xl'}
        opened={isOpenModal}
        onClose={onCloseModal}
        classNames={{
          header: 'mb-0',
          root: 'py-0',
          body: 'h-[calc(100vh*2/3)]',
        }}
        closeOnClickOutside={false}
      >
        {selectQuestion ? (
          <div className="w-full">
            <div className="flex items-start">
              <span className="w-6 h-6 inline-flex justify-center items-center rounded-full border border-ct-primary-400 text-ct-primary-400  text-sm font-bold mr-4">
                {listQuestion[idBlock]?.findIndex(
                  (itemQues: any) =>
                    itemQues?.idQuestion == selectQuestion?.idQuestion,
                ) + 1}
              </span>
              <p
                className="flex-1"
                dangerouslySetInnerHTML={{
                  __html: selectQuestion?.text,
                }}
              />
            </div>
            {selectAnswer ? (
              <div
                className={`w-full ${
                  isTeacherReview ? 'md:w-2/3' : 'md:w-full'
                } flex flex-shrink-0 flex-col sm:flex-row py-4`}
              >
                <TestAudio
                  srcAudio={selectAnswer?.filepath}
                  isStart={false}
                  type="answer-key"
                  className={'flex-1'}
                />
              </div>
            ) : null}
            <div className="relative mb-4 w-full">
              <div className=" relative w-[100% ] flex flex-wrap sm:flex-nowrap overflow-x-auto gap-2">
                {listTab.map((item, indexReview) => {
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
                          __html: item.title,
                        }}
                      />
                      {/* {selectReview == indexReview && (
                        <div className="h-[1px] w-[100%] bg-ct-primary-500" />
                      )} */}
                    </div>
                  );
                })}
              </div>
            </div>
            {
              feedbackSections[
                listTab[selectReview].key as keyof typeof feedbackSections
              ]
            }
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default AnswerSpeaking;
