import { Modal } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { t } from 'i18next';

const IconWarning = '/images/icon_warning.svg';

type ModalWarningProps = {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
};

const ModalWarning = ({ isOpen, onClose, onStart }: ModalWarningProps) => {
  return (
    <>
      <Modal
        opened={isOpen}
        centered
        onClose={onClose}
        closeOnClickOutside={false}
        className="min-w-[360px] z-[1201]"
        size={380}
        radius={'lg'}
        classNames={{
          content: 'pt-3 pb-6',
          header: 'mb-0',
          close:
            'bg-ct-neutral-200 rounded-full text-ct-primary-400 min-w-[24px] min-h-[24px] w-6 h-6 hover:bg-ct-neutral-300',
        }}
      >
        <div className="text-center">
          <img className="mx-auto" src={IconWarning} alt="Warning" />
          <p className="px-2 py-6">
            {t('modal_warning.mobile_version_message')}
          </p>
          <Button className="mx-auto" onClick={onStart}>
            {t('modal_warning.understand')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalWarning;
