import { Modal } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { LocalStorageService } from '@/services';
import { postExamPartStopApi } from '@/service/api/examConfig';
import { IdHistoryContest } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { removeEleComment } from '@/utils';
import { t } from 'i18next';

type ModalExitProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalExit = ({ isOpen, onClose }: ModalExitProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = router.asPath;

  const idHistoryContest = useSelector(IdHistoryContest, shallowEqual);

  return (
    <>
      <Modal
        opened={isOpen}
        centered
        onClose={onClose}
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
          <p className="text-center">{t('modal_exit.answers_will_be_deleted')}</p>
          <p className="text-center">{t('modal_exit.do_you_want_to_exit')}</p>
          <div className="flex justify-center space-x-4 mt-10">
            <Button variant="outline" className="py-[9px]" onClick={onClose}>
              {t('modal_exit.no_take_me_back')}
            </Button>
            <Button
              className="py-[10px]"
              onClick={async () => {
                const ele = document.getElementsByTagName('audio');
                if (ele.length > 0) {
                  ele[0].setAttribute('src', '');
                }
                router.replace(LocalStorageService.get('historyPath') || '/');
                dispatch(setListUserAnswer([]));

                localStorage.removeItem('page');
                if (pathname.includes('/test')) {
                  await postExamPartStopApi(`${idHistoryContest}`);
                }
                removeEleComment();
              }}
            >
              {t('modal_exit.yes_i_do')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalExit;
