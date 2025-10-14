import { Modal } from '@mantine/core';
import { useRouter } from 'next/router';
import { removeEleComment } from '@/utils';

interface DialogBoxProps {
  showDialog: boolean;
  cancelNavigation: () => void;
  confirmNavigation: () => void;
  sideEffectLeave?: () => void;
  sideEffectStay?: () => void;
  removeRecord?: () => void;
}

export default function DialogBox({
  showDialog,
  cancelNavigation,
  confirmNavigation,
  sideEffectLeave,
  sideEffectStay,
  removeRecord,
}: DialogBoxProps) {
  const router = useRouter();
  
  const handleStay = () => {
    cancelNavigation();
    if (sideEffectStay) {
      sideEffectStay();
    }
  };
  
  const handleLeave = async () => {
    confirmNavigation();
    removeRecord && removeRecord();
    if (sideEffectLeave) {
      sideEffectLeave();
    }
    localStorage.removeItem('redirectPreview');
    localStorage.removeItem('addTest');
    removeEleComment();
  };
  
  return (
    <>
      <Modal
        opened={showDialog}
        closeOnClickOutside={false}
        centered
        radius={15}
        className="z-[1201]"
        size={380}
        onClose={() => cancelNavigation()}
        classNames={{
          header: 'mb-0',
          close:
            'bg-ct-neutral-200 rounded-full text-ct-primary-400 min-w-[24px] min-h-[24px] w-6 h-6 hover:bg-ct-neutral-300',
        }}
      >
        {router.asPath.includes('practice/') ? (
          <div className="pb-6 pt-5">
            <p className="text-center">
              You have some incomplete questions in this{' '}
              {router.asPath.includes('/practice') ? 'practice' : 'exam'}{' '}
              Do you want to save or exit this{' '}
              {router.asPath.includes('/practice') ? 'practice' : 'exam'}?
            </p>
            <div className="flex justify-center space-x-4 mt-8">
              <button 
                className="py-[9px] px-6 border border-ct-primary-400 text-ct-primary-400 rounded-full hover:bg-ct-primary-100" 
                onClick={() => { /* TODO: Implement save functionality */ }}
              >
                Save {router.asPath.includes('/practice') ? 'practice' : 'exam'}
              </button>
              <button 
                className="py-[10px] px-6 bg-ct-primary-400 text-white rounded-full hover:bg-ct-primary-500" 
                onClick={handleLeave}
              >
                Exit {router.asPath.includes('/practice') ? 'practice' : 'exam'}
              </button>
            </div>
          </div>
        ) : (
          <div className="pb-6 pt-5">
            <p className="text-center">Your answers will be deleted.</p>
            <p className="text-center">Do you want to exit?</p>
            <div className="flex justify-center space-x-4 mt-8">
              <button
                className="py-[9px] px-6 border border-ct-primary-400 text-ct-primary-400 rounded-full hover:bg-ct-primary-100"
                onClick={handleStay}
              >
                No, Take me back
              </button>
              <button 
                className="py-[10px] px-6 bg-ct-primary-400 text-white rounded-full hover:bg-ct-primary-500" 
                onClick={handleLeave}
              >
                Yes, I do
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

