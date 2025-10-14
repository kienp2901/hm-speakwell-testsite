import { Modal } from '@mantine/core';
import HeaderTest from '@/components/organisms/Exam/HeaderTest';
import SampleWriting from '@/components/organisms/Exam/SampleWriting';
import Button from '@/components/sharedV2/Button';
import { TestType } from '@/enum';
const submitWritingSuccess = '/images/submitWritingSuccess.svg';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getHistoryDetail } from '@/service/api/examConfig';

interface CustomizedState {
  idHistory: number;
  allowed_mark_request?: boolean;
  part_history_id?: number;
  isPart?: boolean;
}

const AnswerGradle = () => {
  const router = useRouter();
  const location = { pathname: router.asPath, state: {} };
  const state = location.state as CustomizedState;

  ;

  const [isOpenSaveModal, setOpenSaveModal] = useState(false);
  const [isOpenSendTeacherModal, setOpenSendTeacherModal] = useState(false);
  const [historyWriting, setHistoryWriting] = useState<any>({});
  const [redoStatus, setRedoStatus] = useState(true);

  const getHistoryExam = async () => {
    const response = await getHistoryDetail(`${state?.idHistory}`);
    if (response.status === 200) {
      const index = response?.data?.metadata?.rounds?.findIndex(
        (item: any) => item.test_format === TestType.Writing,
      );
      setHistoryWriting(response?.data?.metadata?.rounds[index]);
      setRedoStatus(response?.data?.metadata?.redo_status);
    }
  };

  useEffect(() => {
    getHistoryExam();
  }, [state?.idHistory]);

  const onCloseSaveModal = () => {
    setOpenSaveModal(false);
  };

  const onCloseSendTeacherModal = () => {
    setOpenSendTeacherModal(false);
  };

  return (
    <div className="bg-[#EFF1F4] pt-[48px] fixed top-0 left-0 right-0 bottom-0">
      <HeaderTest
        type={null}
        childrenHeader={() => {
          return <></>;
        }}
        showDrawer={false}
        showOpenDraw={false}
      />
      <div className="h-full overflow-y-auto scroll-smooth pb-10">
        <div className="mt-8 lg:mt-12 bg-[#fff] mx-4 sm:mx-6 lg:mx-28 p-6 lg:p-12 rounded-2xl">
          <div>
            <div className="flex items-center justify-center text-sm">
              <img src={submitWritingSuccess} alt="" width={300} />
            </div>
            <div className="flex items-center justify-center mt-6 text-sm text-[#2F4E74] text-[16px]">
              Previously you have done and saved the test, please select next
              action
            </div>
          </div>
          <div className="flex items-center justify-center mt-12 space-x-3">
            {redoStatus && (
              <Button
                variant="outline"
                onClick={() => {
                  navigate(
                    `${location.pathname.replace('/wait-grading', '')}`,
                    {
                      replace: true,
                    },
                  );
                }}
              >
                Redo
              </Button>
            )}
            <Button
              onClick={() => {
                router.replace('/');
              }}
            >
              Exit
            </Button>
          </div>
        </div>
        <SampleWriting listQuestion={historyWriting?.questions} />
      </div>
      <Modal
        opened={isOpenSaveModal}
        centered
        closeOnClickOutside={false}
        withCloseButton={false}
        onClose={onCloseSaveModal}
        className="min-w-[360px]"
        size={360}
        radius={'lg'}
      >
        <div className="py-8">
          <p className="text-center">Your test has been sent, please wait</p>
          <div className="flex justify-center mt-10">
            <Button className="py-[10px]" onClick={onCloseSaveModal}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={isOpenSendTeacherModal}
        centered
        closeOnClickOutside={false}
        withCloseButton={false}
        onClose={onCloseSendTeacherModal}
        className="min-w-[360px]"
        size={360}
        radius={'lg'}
      >
        <div className="py-8">
          <p className="text-center">
            You need to upgrade the package to send to the examiner
          </p>
          <div className="flex justify-center mt-10">
            <Button className="py-[10px]" onClick={onCloseSendTeacherModal}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnswerGradle;
