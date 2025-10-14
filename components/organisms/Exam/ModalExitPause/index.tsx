import { Modal } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { LocalStorageService } from 'services';
import { postExamPartPause, postExamPartStopApi } from '@/service/api/examConfig';
import { IdHistoryContest, IdHistoryRound } from 'store/selector';
import { setListUserAnswer } from 'store/slice/examInfo';
import { removeEleComment } from 'utils';
import { t } from 'i18next';

type ModalExitPauseProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalExitPause = ({ isOpen, onClose }: ModalExitPauseProps) => {
  ;
  const dispatch = useDispatch();
  const router = useRouter();
  const params = router.query;
  
  const pathname = router.asPath;

  const idHistoryContest = useSelector(IdHistoryContest, shallowEqual);
  const idHistory = useSelector(IdHistoryRound, shallowEqual);

  const exitPractice = () => {
    const ele = document.getElementsByTagName('audio');
    if (ele.length > 0) {
      ele[0].setAttribute('src', '');
    }
    navigate(LocalStorageService.get('historyPath') || '/', {
      replace: true,
    });
    dispatch(setListUserAnswer([]));

    localStorage.removeItem('page');
    removeEleComment();
  };

  return (
    <>
      <Modal
        opened={isOpen}
        centered
        onClose={onClose}
        closeOnClickOutside={false}
        className="min-w-[360px] z-[1201]"
        size={360}
        radius={'lg'}
        classNames={{
          header: 'mb-0',
          close:
            'bg-ct-neutral-200 rounded-full text-ct-primary-400 min-w-[24px] min-h-[24px] w-6 h-6 hover:bg-ct-neutral-300',
        }}
      >
        <div className="pb-6 pt-5">
          <p className="text-center">
            {t('modal_exit_pause.incomplete_questions')}{' '}
            {pathname.includes('/practice') ? t('modal_exit_pause.practice') : t('modal_exit_pause.exam')}{' '}
            {t('modal_exit_pause.save_or_exit')}{' '}
            {pathname.includes('/practice') ? t('modal_exit_pause.practice') : t('modal_exit_pause.exam')}?
          </p>
          <div className="flex justify-center space-x-3 mt-8">
            <Button
              variant="outline"
              className="!px-4"
              onClick={async () => {
                exitPractice();
                if (pathname.includes('/test')) {
                  await postExamPartPause({
                    idHistory: `${idHistory}`,
                  });
                }
              }}
            >
              {t('modal_exit_pause.save')} {pathname.includes('/practice') ? t('modal_exit_pause.practice') : t('modal_exit_pause.exam')}
            </Button>
            <Button
              className="!px-4"
              onClick={async () => {
                exitPractice();
                if (pathname.includes('/test')) {
                  await postExamPartStopApi(`${idHistoryContest}`);
                }
              }}
            >
              {t('modal_exit_pause.exit')} {pathname.includes('/practice') ? t('modal_exit_pause.practice') : t('modal_exit_pause.exam')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalExitPause;
