import HeaderTest from '@/components/organisms/Exam/HeaderTest';
import Button from '@/components/sharedV2/Button';
import { useRouter } from 'next/router';
const submitWritingSuccess = '/images/submitWritingSuccess.svg';
import { sendToExaminerApi } from '@/service/api/examConfig';
import { notify } from '@/utils/notify';
interface CustomizedState {
  idHistory: number;
  part_history_id: number;
}

const WaitGrading = () => {
  const router = useRouter();
  const location = { pathname: router.asPath, state: {} };
  const state = location.state as CustomizedState;
  
  const params = router.query;

  const cancelSendToExaminer = () => {
    router.push(`/exam/result/${params?.idExam}/${state.idHistory}`);
  };

  const sendToExaminer = () => {
    sendToExaminerApi(state?.part_history_id)
      .then(res => {
        if (res.status === 200) {
          router.push(`/exam/result/${params?.idExam}/${state.idHistory}`);
          notify({
            type: 'success',
            message: 'Send to examiner success!',
            delay: 500,
          });
        }
      })
      .catch(err => {
        notify({
          type: 'error',
          message: 'Cannot send to examiner',
        });
      })
      .finally(() => {
        return;
      });
  };

  return (
    <div className="bg-[#fff] h-auto pt-14 pb-20 fixed top-0 left-0 right-0 bottom-0">
      <HeaderTest
        type={null}
        childrenHeader={() => {
          return <></>;
        }}
        showDrawer={false}
        showOpenDraw={false}
      />
      <div className=" h-auto flex justify-center items-center">
        <div className=" w-[60%] mt-[97px] bg-[#E2EBF3] mx-6 p-12 rounded-2xl">
          <div className=" items-center">
            <div className="flex items-center justify-center text-sm">
              <img src={submitWritingSuccess} alt="" width={300} />
            </div>
            <div className="flex items-center justify-center mt-6 text-sm text-[#2F4E74] text-[16px]">
              Your Speaking test has done, do you want submit to examiner
            </div>
          </div>
          <div className="flex items-center justify-center mt-12 space-x-3">
            <Button variant="outline" onClick={cancelSendToExaminer}>
              No, I don&apos;t
            </Button>
            <Button onClick={sendToExaminer}>Yes, I do</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitGrading;
