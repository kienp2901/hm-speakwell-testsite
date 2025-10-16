import { Drawer, HoverCard, Pagination } from '@mantine/core';
import ContentTestLayout from '@/components/Layouts/ContentTest';
import MySlpit from '@/components/Layouts/SplitLayout';
import Button from '@/components/sharedV2/Button';
import ZoomIn from '@/components/sharedV2/ZoomIn';
import { DocumentText } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getHistoryDetail,
  getHistoryPartDetail,
  sendToExaminerApi,
} from '@/service/api/examConfig';
import { notify } from '@/utils/notify';
import { v4 as uuid } from 'uuid';

interface CustomizedState {
  idHistory: number;
  isPart?: boolean;
}

const AnswerDetail = () => {
  const id = uuid();

  const router = useRouter();
  const location = { pathname: router.asPath, state: {} };
  const state = location.state as CustomizedState;
  
  const params = router.query;
  const { idExam, idHistory } = params;
  console.log('params', params);

  const [page, setPage] = useState(1);
  const [valueInput, setValueInput] = useState('');
  const [listQuestion, setListQuestion] = useState<any>([]);
  const [metadataRound, setMetadataRound] = useState<any>(null);
  const [listAnswerUser, setListAnswer] = useState<any>([]);
  const [redoStatus, setRedoStatus] = useState(true);
  const [isDrawerRead, setIsDrawerRead] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.keyCode === 65 || //key a
          e.keyCode === 67 || //key c
          e.keyCode === 70 || //key f
          e.keyCode === 80 || //key p
          e.keyCode === 82 || //key r
          e.keyCode === 83 || //key s
          e.keyCode === 86 || //key v
          e.keyCode === 117) //key F6
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', event => {
        event.preventDefault();
      });
    };
  }, []);

  const getExamHistoryDetail = () => {
    getHistoryDetail(`${idHistory}`)
      .then(res => {
        setListQuestion(res?.data?.data?.listQuestion);
        setListAnswer(res?.data?.data?.listQuestionGraded);
        setMetadataRound(res?.data?.data);
        const listAnswerUser = res?.data?.data?.listQuestionGraded;
        const listQuestions = res?.data?.data?.listQuestion;

        const indexAnswer = listAnswerUser?.findIndex(
          (item: any) => item?.idQuestion == listQuestions[0]?.idQuestion,
        );
        setValueInput(listAnswerUser[indexAnswer]?.userAnswer);
        setRedoStatus(res?.data?.metadata?.redo_status);
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
    getHistoryPartDetail(state?.idHistory)
      .then(res => {
        setListQuestion(res?.data?.metadata?.questions);
        setListAnswer(res?.data?.metadata?.graded);
        setMetadataRound(res?.data?.metadata);
        const listAnswerUser = res?.data?.metadata?.graded;
        const listQuestions = res?.data?.metadata?.questions;

        const indexAnswer = listAnswerUser?.findIndex(
          (item: any) => item?.idQuestion == listQuestions[0]?.idQuestion,
        );
        setValueInput(listAnswerUser[indexAnswer]?.userAnswer);
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
    console.log('state', state);

    if (idHistory) {
      if (state?.isPart) getExamHistoryPart();
      else getExamHistoryDetail();
    }
  }, [idHistory]);

  const headerContent = () => {
    return (
      <div className="flex items-center space-x-2 sm:space-x-4 text-ct-primary-500">
        <span>{'Task'}</span>
        <Pagination
          key={`pagination-${page}`}
          defaultValue={page}
          total={listQuestion?.length}
          withControls={false}
          noWrap
          className="!gap-0 space-x-2"
          sx={{
            '& button[data-active]': {
              backgroundColor: '#FF3BAF !important',
            },
            '& button': {
              backgroundColor: 'white',
              minWidth: '24px',
              height: '24px',
              width: '24px',
              '@media (min-width: 1024px)': {
                minWidth: '32px',
                height: '32px',
                width: '32px',
              },
            },
          }}
          onChange={(newPage: number) => onCLickSelectPage(newPage)}
        />
      </div>
    );
  };

  const onClickPrevQuestion = () => {
    setPage(page - 1);
    const indexAnswer = listAnswerUser.findIndex(
      (item: any) => item.idQuestion == listQuestion[page - 2]?.idQuestion,
    );
    if (indexAnswer === -1) {
      setValueInput('');
    } else {
      setValueInput(listAnswerUser[indexAnswer].userAnswer);
    }
  };

  const onClickNextQuestion = () => {
    setPage(page + 1);

    const indexAnswer = listAnswerUser.findIndex(
      (item: any) => item.idQuestion == listQuestion[page]?.idQuestion,
    );
    if (indexAnswer === -1) {
      setValueInput('');
    } else {
      setValueInput(listAnswerUser[indexAnswer].userAnswer);
    }
  };

  const onCLickSelectPage = (pageNum: number) => {
    setPage(pageNum);
    const indexAnswer = listAnswerUser.findIndex(
      (item: any) => item.idQuestion == listQuestion[pageNum - 1]?.idQuestion,
    );
    if (indexAnswer === -1) {
      setValueInput('');
    } else {
      setValueInput(listAnswerUser[indexAnswer]?.userAnswer);
    }
  };

  const sendTestToExaminer = async () => {
    const response = await sendToExaminerApi(metadataRound?.round_history_id);

    if (response?.data?.status === 200) {
      notify({
        type: 'success',
        message: 'Send to examiner success!',
      });
      if (state?.isPart) getExamHistoryPart();
      else getExamHistoryDetail();
    } else {
      notify({
        type: 'error',
        message: response.data.message,
        delay: 200,
      });
    }
  };

  const leftContainer = () => {
    return (
      <div className="h-full pt-[64px] relative flex flex-col justify-between">
        <div className="h-full p-6 overflow-y-auto scroll-smooth">
          <div className="flex items-center mb-[10px]">
            <h3 className="text-2xl">Task {page} Introduction and interview</h3>
          </div>
          {listQuestion && listQuestion[page - 1] && (
            <div
              id={id}
              className="question-writing p-3 rounded-md text-[22px]"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: listQuestion[page - 1].text,
                }}
              ></div>
              {listQuestion[page - 1]?.image ? (
                <div className="flex items-center">
                  <ZoomIn
                    src={listQuestion[page - 1]?.image}
                    className="h-[500px] my-4 rounded-2xl"
                    alt="IMG"
                  />
                </div>
              ) : (
                ''
              )}
              {listQuestion[page - 1]?.audio ? (
                <audio src={listQuestion[page - 1]?.audio} controls></audio>
              ) : (
                ''
              )}
              {listQuestion[page - 1]?.video ? (
                <video
                  src={listQuestion[page - 1]?.video}
                  controls
                  className="w-[560px] h-[315px] rounded-xl"
                ></video>
              ) : (
                ''
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 w-full px-4 py-3 flex items-center justify-between bg-ct-neutral-200">
          <Button
            className="bg-white"
            variant="outline"
            disabled={page === 1}
            onClick={onClickPrevQuestion}
          >
            Previous Task
          </Button>
          <Button
            disabled={page === listQuestion?.length}
            onClick={onClickNextQuestion}
          >
            Next Task
          </Button>
        </div>
      </div>
    );
  };

  const rightContainer = () => {
    return (
      <div className="h-full bg-ct-neutral-200 py-[62px] sm:pt-[64px] pb-[62px] sm:pb-[64px] lg:pb-0 relative">
        <div className="h-full overflow-y-auto scroll-smooth p-4 sm:p-6 relative">
          <div
            className="fixed top-20 right-4 sm:right-6 cursor-pointer px-2 min-w-10 h-10 bg-ct-tertiary-600 rounded-full inline-flex items-center justify-center lg:hidden"
            onClick={() => setIsDrawerRead(true)}
          >
            <DocumentText color="#ffffff" variant="Bold" />
            <span className="read-here text-white font-medium text-sm">
              &nbsp;&nbsp;See question
            </span>
          </div>
          <h3 className="text-2xl">Task {page}</h3>
          <p className=" text-[16px]">
            You have entered {valueInput ? valueInput.split(' ').length : 0}{' '}
            word(s)
          </p>
          <div className="h-[88%] lg:h-[78vh] overflow-y-auto rounded-2xl border-2 border-[black] focus:border-[black] pb-20 lg:pb-4 px-2 pt-2 relative">
            <p>{valueInput || ''}</p>
          </div>
        </div>
        <div className="absolute bottom-0 w-full px-4 py-3 flex lg:hidden items-center justify-between bg-white">
          <Button
            className="bg-white"
            variant="outline"
            disabled={page === 1}
            onClick={onClickPrevQuestion}
          >
            Previous Task
          </Button>
          <Button
            disabled={page === listQuestion?.length}
            onClick={onClickNextQuestion}
          >
            Next Task
          </Button>
        </div>
      </div>
    );
  };

  const testContent = () => {
    return (
      <div className="flex h-full w-full">
        <div className="h-full overflow-hidden w-full">
          <MySlpit leftContent={leftContainer} rightContent={rightContainer} />
          <Drawer
            opened={isDrawerRead}
            className="lg:hidden"
            onClose={() => setIsDrawerRead(false)}
            zIndex={1201}
            withCloseButton={false}
            size={'100%'}
            classNames={{
              content: 'overflow-y-auto',
            }}
          >
            <div className="px-2 pt-4 sm:p-4 pb-8">
              <div className="flex items-center mb-1 sm:mb-2">
                <h3 className="text-2xl">
                  Task {page} Introduction and interview
                </h3>
              </div>
              {listQuestion && listQuestion[page - 1] && (
                <div
                  id={id}
                  className="question-writing p-3 rounded-md text-[22px]"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: listQuestion[page - 1].text,
                    }}
                  ></div>
                  {listQuestion[page - 1]?.image ? (
                    <div className="flex items-center">
                      <ZoomIn
                        src={listQuestion[page - 1]?.image}
                        className="h-[500px] my-4 rounded-2xl"
                        alt="IMG"
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  {listQuestion[page - 1]?.audio ? (
                    <audio src={listQuestion[page - 1]?.audio} controls></audio>
                  ) : (
                    ''
                  )}
                  {listQuestion[page - 1]?.video ? (
                    <video
                      src={listQuestion[page - 1]?.video}
                      controls
                      className="w-[560px] h-[315px] rounded-xl"
                    ></video>
                  ) : (
                    ''
                  )}
                </div>
              )}
            </div>
            <div className="sticky bottom-0 w-full bg-white py-2">
              <Button
                className="mx-auto "
                variant="solid"
                onClick={() => setIsDrawerRead(false)}
              >
                See answer
              </Button>
            </div>
          </Drawer>
        </div>
      </div>
    );
  };

  const exitCurrentPage = () => {
    router.replace('/');
  };

  return (
    <div className="flex select-none">
      <ContentTestLayout
        type="answer-detail"
        showSubmitBtn={false}
        page={page}
        total={listQuestion?.length}
        showOpenDraw={false}
        childrenHeader={headerContent}
        childrenContent={testContent}
        exitCurrentPage={exitCurrentPage}
        showSendExamBtn={!metadataRound?.already_requested}
        showInfoSendExamBtn={metadataRound?.allowed_mark_request}
        submitAnswer={sendTestToExaminer}
        redoStatus={redoStatus}
      />
    </div>
  );
};

export default AnswerDetail;
