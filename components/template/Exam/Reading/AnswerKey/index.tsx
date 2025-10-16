import MoreInfo from '@/components/organisms/Exam/AnswerKey/MoreInfo';
import PartItem from '@/components/organisms/Exam/AnswerKey/PartItem';
import Scores from '@/components/organisms/Exam/AnswerKey/Scores';
import HeaderTest from '@/components/organisms/Exam/HeaderTest';
import Button from '@/components/sharedV2/Button';
import { TestType, questionEnumType } from '@/enum';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getHistoryDetail, getHistoryPartDetail } from '@/service/api/examConfig';

const AnswerKey = () => {
  const router = useRouter();
  const params = router.query;
  const { idExam, idHistory } = params;
  const [listDataResult, setListDataResult] = useState<any[]>([]);
  const [listDataQuestion, setListDataQuestion] = useState<any[]>([]);
  const [historyReading, setHistoryReading] = useState<any>({});
  const [redoStatus, setRedoStatus] = useState(true);

  
  const pathname = router.asPath;

  const getHistoryExam = async (idHistory: string) => {
    const response = await getHistoryDetail(idHistory);
    if (response.status === 200) {
      const index = response?.data?.metadata?.rounds?.findIndex(
        (item: any) => item.test_format === TestType.Reading,
      );
      setHistoryReading(response?.data?.data?.rounds[index]);
      // setRedoStatus(response?.data?.metadata?.redo_status);
    }
  };

  const getHistoryPart = async (idHistory: string) => {
    const response = await getHistoryDetail(idHistory);
    if (response.status === 200) {
      setHistoryReading(response?.data?.data);
    }
  };

  const handleRedo = async () => {
    router.push(`/practice/reading/${idExam}/${historyReading?.round_id}`);
  };

  useEffect(() => {
    if (pathname.includes('/exam')) getHistoryPart(`${idHistory}`);
    else getHistoryExam(`${idHistory}`);
  }, [idHistory]);

  useEffect(() => {
    let arrDataResult: any[] = [];
    historyReading?.listQuestionGraded?.map((item: any) => {
      item.userAnswer.map((i: any) => {
        if (i.answer[0]?.idChildQuestion) {
          arrDataResult = [...arrDataResult, ...i.answer];
        } else {
          arrDataResult.push(i);
        }
      });
    });
    arrDataResult = arrDataResult.filter((it: any) => it.answer !== '');
    setListDataResult(arrDataResult);
  }, [historyReading]);

  useEffect(() => {
    let arrDataQuestion: any[] = [];
    historyReading?.listQuestion?.map((item: any) => {
      item?.listQuestionChildren.map((i: any) => {
        if (i.quiz_type === questionEnumType.ONE_RIGHT) {
          arrDataQuestion.push(i);
        } else if (i.quiz_type === questionEnumType.MULTIPLE_RIGHT) {
          Array.from({ length: i?.maxAnswerChoice || 1 }).map(() =>
            arrDataQuestion.push(i),
          );
        } else {
          arrDataQuestion = [...arrDataQuestion, ...i.listQuestionChildren];
        }
      });
    });
    setListDataQuestion(arrDataQuestion);
  }, [historyReading]);

  return (
    <div className="bg-[#EFF1F4] pt-[62px] sm:pt-16 fixed top-0 left-0 right-0 bottom-0">
      <HeaderTest
        type="answer-key"
        childrenHeader={() => {
          return <></>;
        }}
        showDrawer={false}
        showOpenDraw={false}
      />
      <div className="h-full overflow-y-auto scroll-smooth pb-10">
        <Scores
          mark={{
            score: Math.round(historyReading?.lms_score * 100) / 100,
            score_max: historyReading?.scale,
          }}
          totalQuestion={listDataQuestion?.length}
          correctAnswer={historyReading?.correctAnswer}
        />
        <MoreInfo
          className="mx-4 sm:mx-6 lg:mx-20 xl:mx-28 px-6 lg:px-10 xl:px-14"
          metadataAnswer={historyReading}
        />
        <div className="bg-white mx-0 sm:mx-6 lg:mx-20 xl:mx-28 py-4 px-4 lg:px-7 sm:rounded-2xl">
          <div className="flex items-center justify-center space-x-3 sm:space-x-6">
            <h3 className="text-2xl">CORRECTION</h3>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 bg-ct-primary-400 rounded-full mr-2"></div>{' '}
              answered
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 bg-ct-neutral-200 rounded-full mr-2"></div>{' '}
              unanswered
            </div>
          </div>
          <div className="mt-6">
            <PartItem
              listDataResult={listDataResult}
              listDataQuestion={listDataQuestion}
            />
          </div>
          <div className="flex items-center justify-center mt-6 space-x-3">
            <Button
              onClick={() => {
                router.push(
                  `${pathname.replace('/answer-key', '/answer-detail')}`,
                );
              }}
            >
              View details
            </Button>
            {!pathname.includes('/exam/reading') && redoStatus && (
              <Button variant="outline" onClick={handleRedo}>
                Redo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerKey;
