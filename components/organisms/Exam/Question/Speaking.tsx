import { useEffect, useMemo, useState } from 'react';
import AudioAnalyser from 'react-audio-analyser';
import { uploadAudioFileApi } from '@/service/api/examConfig';
import { getIndexQuestion2 } from '@/utils';
import MathJaxRender from '@/components/sharedV2/MathJax';
import TestAudio from '../../Exercise/TestAudio';
import Button from '@/components/sharedV2/Button';
import styled, { keyframes } from 'styled-components';
import { useRouter } from 'next/router';
import { Collapse, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ArrowDown2, Information } from 'iconsax-react';
import parseFeedback from 'utils/parseFeedback';
import { FEEDBACK_TABS, MODAL_ANSWER_TABS } from '@/enum';
import FeedbackSection from '../SampleSpeaking/FeedbackSection';
import PronunciationResult from '../SampleSpeaking/PronunciationResult';

// Move styled components outside of component to avoid recreation
const blinkAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const FlashingText = styled.span`
  animation: ${blinkAnimation} 1s linear infinite;
`;

interface SpeakingProps {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType?: number;
}

const Speaking = ({
  question,
  indexQuestion,
  type,
  data,
  page,
  listDataResult,
  idHistoryRound,
  contestType = 0,
}: SpeakingProps) => {
  const router = useRouter();
  const pathname = router.asPath;
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | Blob>('');
  const [selectReview, setSelectReview] = useState(0);
  const [opened, { toggle }] = useDisclosure(false);

  const audioProps = {
    status: isRecording ? 'recording' : 'inactive',
    audioType: 'audio/mp3',
    audioSrc: recordedUrl,
    timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
    startCallback: (e: any) => {},
    pauseCallback: (e: any) => {},
    stopCallback: (e: any) => {
      setRecordedUrl(window.URL.createObjectURL(e));
      saveRecordedAnswer(window.URL.createObjectURL(e));
    },
    onRecordCallback: (e: any) => {},
    errorCallback: (err: any) => {},
    width: 0,
    height: 0,
    backgroundColor: 'white',
  };

  const skillResult = useMemo(() => {
    if (!listDataResult || listDataResult.length === 0) return {};
    return {
      fluency:
        listDataResult[0]?.externalGradingDetail?.fluency
          ?.english_proficiency_scores[`mock_ielts`].prediction,
      vocabulary:
        listDataResult[0]?.externalGradingDetail?.vocabulary
          ?.english_proficiency_scores[`mock_ielts`].prediction,
      grammar:
        listDataResult[0]?.externalGradingDetail?.grammar
          ?.english_proficiency_scores[`mock_ielts`].prediction,
      pronunciation:
        listDataResult[0]?.externalGradingDetail?.pronunciation
          ?.english_proficiency_scores[`mock_ielts`].prediction,
    };
  }, [listDataResult]);

  const handleData = useMemo(() => {
    if (
      listDataResult &&
      listDataResult?.length > 0 &&
      listDataResult[0]?.externalGradingDetail
    )
      return parseFeedback(listDataResult[0]?.externalGradingDetail);
  }, [listDataResult]);

  const listTab = useMemo(() => {
    if (
      listDataResult &&
      listDataResult.length > 0 &&
      listDataResult[0]?.externalGradingDetail
    ) {
      return [...FEEDBACK_TABS, ...MODAL_ANSWER_TABS];
    } else {
      return [...MODAL_ANSWER_TABS];
    }
  }, [listDataResult]);

  const feedbackSections = useMemo(() => {
    if (
      listDataResult &&
      listDataResult.length > 0 &&
      listDataResult[0]?.externalGradingDetail
    ) {
      return {
        content: <FeedbackSection data={handleData?.metaData} />,
        pronunciation: (
          <PronunciationResult
            words={
              listDataResult[0]?.externalGradingDetail?.pronunciation.words
            }
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
                srcAudio={listDataResult[0]?.solution_audio}
                isStart={false}
                type="answer-key"
              />
            </div>
            <p
              className="px-2 sm:px-4 lg:px-6 text-justify answer-table"
              dangerouslySetInnerHTML={{
                __html: listDataResult[0]?.solution || 'No solution',
              }}
            ></p>
          </div>
        ),
      };
    } else {
      return {
        modalAnswer: (
          <div className="w-full">
            {listDataResult[0]?.solution_audio && (
              <div className="w-full px-2 sm:px-4 lg:px-6 py-4">
                <TestAudio
                  srcAudio={listDataResult[0]?.solution_audio}
                  isStart={false}
                  type="answer-key"
                />
              </div>
            )}
            <p
              className="px-2 sm:px-4 lg:px-6 text-justify answer-table"
              dangerouslySetInnerHTML={{
                __html: listDataResult[0]?.solution || 'No solution',
              }}
            ></p>
          </div>
        ),
      };
    }
  }, [listDataResult, handleData]);

  const record = () => {
    if (!isRecording && recordedUrl) {
      setRecordedUrl('');
    }
    setTimeout(() => {
      setIsRecording(prv => !prv);
    }, 200);
  };

  const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const saveRecordedAnswer = async (blob: string) => {
    const audioBlob = await fetch(blob).then(r => r.blob());
    blobToBase64(audioBlob).then(blob => {
      const payload = {
        idHistory: idHistoryRound,
        idQuestion: question.idQuestion,
        audio_base64_full: blob,
        contest_type: contestType,
      };
      uploadAudioFileApi(payload)
        .then(res => {})
        .catch(er => {
          return;
        })
        .finally(() => {});
    });
  };

  useEffect(() => {
    if(listDataResult?.length > 0 &&
      listDataResult[0]?.filepath){
      setRecordedUrl(listDataResult[0]?.filepath);
    }
  }, [listDataResult])

  return (
    <div className="bg-white ">
      {/* Question Header with Number */}
      <div className="flex items-start space-x-2 mb-6">
        {pathname.includes('exercise') ? (
          <span className=" bg-ct-secondary-100 w-6 h-6 inline-flex flex-shrink-0 justify-center items-center rounded-full text-sm text-ct-secondary-500 mt-1 ">
            {getIndexQuestion2(
              data,
              page,
              question.idChildQuestion || question.idQuestion,
            )}
          </span>
        ) : (
          ''
        )}
        <div className="flex-1">
          {question?.description && (
            <div className="text-gray-600 mb-2">
              <MathJaxRender math={`${question?.description}`} />
            </div>
          )}
          <div className="text-gray-800 font-medium">
            <MathJaxRender
              math={`${question?.text?.replaceAll('&nbsp;', ' ')}`}
            />
          </div>
        </div>
      </div>

      {/* Audio Player */}
      {question?.audio && (
        <TestAudio
          srcAudio={question.audio}
          className="mt-6"
          showVolumeControl={true}
          isStart={false}
          type="answer-key"
        />
      )}

      {/* Recording Section */}
      {type === 'answer-detail' ? (
        <></>
      ) : (
        <div className="mt-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={record}
              className={`px-6 py-2 rounded-full font-medium transition-colors`}
            >
              {isRecording ? 'Stop record' : 'Record your answer'}
            </Button>
            <div className="flex flex-1 items-center">
              {isRecording ? (
                <FlashingText className="flex text-[#7893B0] items-center ">
                  <div className=" rounded-full bg-[red] w-2 h-2 mr-1"></div>
                  Recording ...
                </FlashingText>
              ) : recordedUrl ? (
                <TestAudio
                  srcAudio={recordedUrl.toString()}
                  showVolumeControl={true}
                  showDurationTime={false}
                  showCurrentTime={false}
                  isStart={false}
                />
              ) : null}
            </div>
            <AudioAnalyser className={'audioRecordContainer'} {...audioProps} />
          </div>
        </div>
      )}
      {type === 'answer-detail' && listDataResult[0]?.filepath && (
        <div className="mt-6 ">
          <div className="text-[#252525] font-normal text-base mb-2">
            Trả lời của bạn
          </div>
          <div className="w-1/3">
            <TestAudio
              srcAudio={listDataResult[0]?.filepath}
              showVolumeControl={false}
              showDurationTime={false}
              showCurrentTime={false}
              isStart={false}
              primaryColor="#5ABB10"
            />
          </div>
        </div>
      )}
      {/* Solution/Explanation Section */}
      {type === 'answer-detail' &&
        listDataResult.length > 0 &&
        listDataResult[0].externalGradingDetail && (
          <div>
            <Divider className="border-ct-neutral-300" my="sm" />
            <div className="mt-2 rounded-2xl border bg-white px-[6px] py-2 sm:mt-3 sm:px-3 sm:py-[10px]">
              <div
                onClick={toggle}
                className={`flex items-center justify-between ${
                  opened && 'mb-2'
                } cursor-pointer`}
              >
                <div className="flex items-center">
                  <Information size="15" color="#1294F2" variant="Bold" />
                  <span className="text-ct-primary-400 ml-1">Explain</span>
                </div>
                <ArrowDown2
                  className={`${opened && 'rotate-180'}`}
                  size="24"
                  color="#000"
                  variant="Bold"
                />
              </div>
              <Collapse in={opened}>
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
              </Collapse>
            </div>
          </div>
        )}
    </div>
  );
};

export default Speaking;
