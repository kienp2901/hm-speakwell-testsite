/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { HoverCard, Modal } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { TestType } from '@/enum';
const Logo_Ican = '/images/LogoIcan.svg';
const arrow_icon = '/images/arrow_icon.svg';
import { CSSProperties, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { LocalStorageService } from '@/services';
import { postExamPartSubmit } from '@/service/api/examConfig';
import { ExamInfo, IdHistoryContest, IdHistoryRound, ListUserAnswer } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { getTestFormat, removeEleComment } from '@/utils';
import { t } from 'i18next';

import ModalExit from '../ModalExit';
import ModalExitPause from '../ModalExitPause';

type HeaderTestProps = {
  childrenHeader?: any;
  type: string | null;
  total?: number;
  page?: number;
  time?: boolean;
  showDrawer?: any;
  showOpenDraw?: boolean;
  style?: CSSProperties;
  isOpenDrawer?: boolean;
  showSubmitBtn?: boolean;
  submitAnswer?: any;
  exitCurrentPage?: any;
  stayCurrentPage?: any;
  showSendExamBtn?: boolean;
  showInfoSendExamBtn?: boolean;
  redoStatus?: boolean;
  isPauseAllow?: boolean;
  isDisabledSubmit?: boolean;
  isScore?: boolean;
  isTimeout?: boolean;
  metadata?: any;
};

const HeaderTest = ({
  total,
  page,
  type,
  childrenHeader,
  showDrawer = true,
  showOpenDraw = true,
  isOpenDrawer,
  showSubmitBtn = true,
  submitAnswer,
  exitCurrentPage,
  stayCurrentPage,
  showSendExamBtn = false,
  showInfoSendExamBtn = true,
  redoStatus = true,
  isPauseAllow = false,
  isDisabledSubmit = false,
  isScore,
  isTimeout,
  metadata,
}: HeaderTestProps) => {
  const examInfo = useSelector(ExamInfo, shallowEqual);
  const idHistoryRound = useSelector(IdHistoryRound, shallowEqual);
  const idHistoryContest = useSelector(IdHistoryContest, shallowEqual);
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual);
  const dispatch = useDispatch();
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const location = { pathname: router.asPath, state: {} };
  const params = router.query;

  const [isWait, setIsWait] = useState<boolean>(false);

  const onClickExit = async () => {
    exitCurrentPage && exitCurrentPage();
    localStorage.removeItem('page');
    localStorage.removeItem('index-current');
    if (
      location?.pathname.includes('/answer-key') ||
      location?.pathname.includes('/answer-detail') ||
      location?.pathname.includes('/wait-grading')
    ) {
      if (
        location?.pathname.includes('/answer-key') &&
        location?.pathname.includes('/writing') &&
        !isScore &&
        !isTimeout
      ) {
        setIsWait(true);
      } else {
        const ele = document.getElementsByTagName('audio');
        if (ele.length > 0) {
          ele[0].setAttribute('src', '');
        }

        if (location?.pathname.includes('/exam/')) {
          router.back();
        } else {
          setTimeout(() => {
            const redirectPath = params.tenant && params.campaign && params.slug 
              ? `/${params.tenant}/${params.campaign}/${params.slug}/`
              : '/';
            router.replace(redirectPath);
          }, 500);
        }
        dispatch(setListUserAnswer([]));
        removeEleComment();
      }

      // await postExamPartStopApi(Number(params.idExam));
    } else if (
      location?.pathname.includes('/exam/result') ||
      location?.pathname.includes('/exercise/result')
    ) {
      const redirectPath = params.tenant && params.campaign && params.slug 
        ? `/${params.tenant}/${params.campaign}/${params.slug}/`
        : '/';
      router.push(redirectPath);
    } else if (location?.pathname.includes('/answer-task-detail')) {
      router.back();
    } else {
      setOpened(true);
    }
  };

  const onSubmit = async () => {
    const dataParams = {
      idHistory: `${idHistoryRound}`,
      idMockContest: Number(params?.idExam),
      idbaikiemtra: Number(params?.idRound),
      contest_type_id: 19,
      listUserAnswer: [...listUserAnswerState],
    };
    const response = await postExamPartSubmit(dataParams);

    if (response.status === 200) {
      if (location?.pathname.includes('/practice/')) {
        router.replace(`${location?.pathname.replace('/test', '/answer-key')}`);
      } else if (location?.pathname.includes('/exam/listening')) {
        const idRound = examInfo?.rounds?.find(
          (item: { test_format: number }) => item.test_format === TestType.Reading,
        )?.id;
        router.replace(`/${params.tenant}/${params.campaign}/${params.slug}/exam/reading/${params.idExam}/${idRound}`);
      } else if (location?.pathname.includes('/exam/reading')) {
        const idRound = examInfo?.rounds?.find(
          (item: { test_format: number }) => item.test_format === TestType.Writing,
        )?.id;
        router.replace(`/${params.tenant}/${params.campaign}/${params.slug}/exam/writing/${params.idExam}/${idRound}`);
      } else if (location?.pathname.includes('/exam/writing')) {
        const idRound = examInfo?.rounds?.find(
          (item: { test_format: number }) => item.test_format === TestType.Speaking,
        )?.id;
        router.replace(`/${params.tenant}/${params.campaign}/${params.slug}/exam/speaking/${params.idExam}/${idRound}`);
      } else if (location?.pathname.includes('/exam/speaking')) {
        router.replace(`/${params.tenant}/${params.campaign}/${params.slug}/exam/result/${params.idExam}/${idHistoryContest}`);
      }
      dispatch(setListUserAnswer([]));
      localStorage.removeItem('page');
      localStorage.removeItem('index-current');
    }
  };

  const handleRedo = async () => {
    removeEleComment();
    localStorage.removeItem('page');
    localStorage.removeItem('index-current');
    if (location?.pathname.includes('/exam')) {
      const idRound = metadata?.rounds?.find(
        (item: { test_format: number }) => item.test_format === TestType.Listening,
      )?.round_id;
      router.push(`/${params.tenant}/${params.campaign}/${params.slug}/exam/listening/${params.idExam}/${idRound}`);
    } else if (location?.pathname.includes('/answer-detail')) {
      router.push(
        `/practice/${getTestFormat(metadata?.test_format)}/${params.idExam}/${
          metadata?.round_id
        }`,
      );
    } else if (location?.pathname.includes('/answer-key')) {
      router.push(`${location?.pathname.replace('/answer-key', '')}`);
    } else if (location?.pathname.includes('/wait-grading')) {
      router.push(`${location?.pathname.replace('/wait-grading', '')}`);
    } else if (location?.pathname.includes('/answer-task-detail')) {
      router.push(
        `/practice/${getTestFormat(metadata?.test_format)}/${params.idExam}/${
          metadata?.round_id
        }`,
      );
    }
  };

  return (
    <>
      <div
        className={`absolute top-0 z-50 w-full flex items-center justify-between bg-white px-4 sm:px-6 py-3 `}
      >
        <div
          className={`cursor-pointer ${
            location?.pathname.includes('/answer-key') ||
            location?.pathname.includes('/wait-grading') ||
            (location?.pathname.includes('/speaking') &&
              location?.pathname.includes('/answer-detail'))
              ? ''
              : 'hidden'
          } sm:block`}
          onClick={() => {
            const redirectPath = params.tenant && params.campaign && params.slug 
              ? `/${params.tenant}/${params.campaign}/${params.slug}/`
              : '/';
            router.replace(redirectPath);
          }}
        >
          <img src={Logo_Ican} alt="" />
        </div>
        {childrenHeader()}
        {
          <div className="flex justify-end">
            {type == null ? (
              <div />
            ) : (
              <>
                {showSubmitBtn && page === total && type === 'test' && (
                  <Button
                    disabled={isDisabledSubmit}
                    className="mr-2 lg:mr-4"
                    onClick={submitAnswer || onSubmit}
                  >
                    {t('header_test.submit')}
                  </Button>
                )}
                {((type === 'answer-detail' &&
                  location?.pathname.includes('/practice') &&
                  redoStatus) ||
                  (type === 'full-result' && redoStatus)) && (
                  <Button
                    className="bg-white hover:bg-ct-primary-100/[.9] mr-2 lg:mr-4"
                    variant="outline"
                    onClick={handleRedo}
                  >
                    {t('header_test.redo')}
                  </Button>
                )}
                <Button
                  className="bg-white hover:bg-ct-primary-100/[.9]"
                  variant="outline"
                  onClick={onClickExit}
                >
                  {type === 'answer-task-detail'
                    ? t('header_test.back')
                    : t('header_test.exit')}
                </Button>
              </>
            )}
            {showOpenDraw && !isOpenDrawer && (
              <img
                onClick={showDrawer}
                className="cursor-pointer ml-[10px] rotate-180 hidden sm:block"
                src={arrow_icon}
                alt=""
              />
            )}
          </div>
        }
      </div>
      {(location?.pathname.includes('practice/') ||
        location?.pathname.includes('exercise/testing/')) &&
      isPauseAllow ? (
        <ModalExitPause
          isOpen={opened}
          onClose={() => {
            stayCurrentPage && stayCurrentPage();
            setOpened(false);
          }}
        />
      ) : (
        <ModalExit
          isOpen={opened}
          onClose={() => {
            stayCurrentPage && stayCurrentPage();
            setOpened(false);
          }}
        />
      )}

      {/* Modal back writing */}
      <Modal
        opened={isWait}
        centered
        onClose={() => setIsWait(false)}
        closeOnClickOutside={false}
        className="min-w-[360px] z-[1201]"
        size={360}
        radius={'lg'}
        classNames={{
          header: 'mb-0',
          body: 'p-3',
          close:
            'bg-ct-neutral-200 rounded-full text-ct-primary-400 min-w-[24px] min-h-[24px] w-6 h-6 hover:bg-ct-neutral-300 mr-2',
        }}
      >
        <div className="pb-6 pt-5">
          <p className="text-center px-4">
            {t('header_test.ai_grading_message')}
          </p>
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              className="!px-4"
              variant="outline"
              onClick={async () => {
                const ele = document.getElementsByTagName('audio');
                if (ele.length > 0) {
                  ele[0].setAttribute('src', '');
                }
                dispatch(setListUserAnswer([]));
                removeEleComment();
                const redirectPath = params.tenant && params.campaign && params.slug 
                  ? `/${params.tenant}/${params.campaign}/${params.slug}/`
                  : '/';
                router.replace(redirectPath);
              }}
            >
              {t('header_test.back_to_homepage')}
            </Button>
            <Button className="!px-4" onClick={() => setIsWait(false)}>
              {t('header_test.continue_waiting')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HeaderTest;
