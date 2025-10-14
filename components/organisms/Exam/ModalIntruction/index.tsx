import { useMemo, useState } from 'react';
import { Modal, Stepper } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { ArrowCircleLeft, ArrowCircleRight } from 'iconsax-react';
// listening
const Listening_FZ = '/images/instruction/listening/Listening_Fz.png';
const Listening_Ht = '/images/instruction/listening/Listening_Ht.png';
const Listening_Cmt = '/images/instruction/listening/Listening_Cmt.png';
const Listening_Review = '/images/instruction/listening/Listening_Review.png';
const Listening_QuesPalette = '/images/instruction/listening/Listening_QuesPalette.png';
const Listening_AudioBar = '/images/instruction/listening/Listening_AudioBar.png';
const Listening_ListQues = '/images/instruction/listening/Listening_ListQues.png';
// reading
const Reading_Timer = '/images/instruction/reading/Reading_Timer.png';
const Reading_Fz = '/images/instruction/reading/Reading_Fz.png';
const Reading_Ht = '/images/instruction/reading/Reading_Ht.png';
const Reading_Cmt = '/images/instruction/reading/Reading_Cmt.png';
const Reading_Review = '/images/instruction/reading/Reading_Review.png';
const Reading_QuesPalette = '/images/instruction/reading/Reading_QuesPalette.png';
const Reading_Passage = '/images/instruction/reading/Reading_Passage.png';
const Reading_Ques = '/images/instruction/reading/Reading_Ques.png';
const Reading_Resize = '/images/instruction/reading/Reading_Resize.png';
// writing
const Writing_Timer = '/images/instruction/writing/Writing_Timer.png';
const Writing_Answer = '/images/instruction/writing/Writing_Answer.png';
const Writing_Task = '/images/instruction/writing/Writing_Task.png';
const Writing_Resize = '/images/instruction/writing/Writing_Resize.png';
// speaking
const Speaking_Timer = '/images/instruction/speaking/Speaking_Timer.png';
const Speaking_Record = '/images/instruction/speaking/Speaking_Record.png';
const Speaking_Part = '/images/instruction/speaking/Speaking_Part.png';
const Speaking_Resize = '/images/instruction/speaking/Speaking_Resize.png';

type ModalIntructionProps = {
  isIntruction: boolean;
  onClose: () => void;
  pathName: string;
};

const ModalIntruction = ({
  isIntruction,
  onClose,
  pathName,
}: ModalIntructionProps) => {
  const dataListening = [
    Listening_FZ,
    Listening_Ht,
    Listening_Cmt,
    Listening_Review,
    Listening_QuesPalette,
    Listening_AudioBar,
    Listening_ListQues,
  ];
  const dataReading = [
    Reading_Timer,
    Reading_Fz,
    Reading_Ht,
    Reading_Cmt,
    Reading_Review,
    Reading_QuesPalette,
    Reading_Passage,
    Reading_Ques,
    Reading_Resize,
  ];
  const dataWriting = [
    Writing_Timer,
    Writing_Answer,
    Writing_Task,
    Writing_Resize,
  ];
  const dataSpeaking = [
    Speaking_Timer,
    Speaking_Record,
    Speaking_Part,
    Speaking_Resize,
  ];

  const [active, setActive] = useState<number>(0);

  const dataIntruction = useMemo<any[]>(() => {
    if (pathName.includes('/listening')) {
      return dataListening;
    } else if (pathName.includes('/reading')) {
      return dataReading;
    } else if (pathName.includes('/writing')) {
      return dataWriting;
    } else {
      return dataSpeaking;
    }
  }, [pathName]);

  const nextStep = () => {
    setActive((current: number) => current + 1);
  };
  const prevStep = () => {
    setActive((current: number) => current - 1);
  };
  return (
    <>
      <Modal
        opened={isIntruction}
        onClose={() => {}}
        centered
        withCloseButton={false}
        overlayOpacity={0.85}
        overlayBlur={3}
        zIndex={1201}
        classNames={{
          modal: 'p-0 w-full sm:w-[95%] lg::w-[90%] 2xl:w-[75%] ',
        }}
      >
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          allowNextStepsSelect={false}
          classNames={{
            steps: 'hidden',
            content: 'p-0',
          }}
        >
          {dataIntruction.map((item: any, index: any) => (
            <Stepper.Step key={index} step={index}>
              <img className="w-full max-h-[92vh]" src={item} alt="empty" />
            </Stepper.Step>
          ))}
        </Stepper>
        <div className="absolute left-1/2 bottom-0 sm:bottom-2 lg:bottom-3 -translate-x-1/2 p-2 lg:p-3 2xl:p-4 min-w-[200px] rounded-2xl bg-[#D3DCE7] flex justify-center items-center ">
          <ArrowCircleLeft
            className={`cursor-pointer ${
              active === 0 ? 'pointer-events-none' : 'pointer-events-auto'
            }`}
            size="32"
            color={`${active === 0 ? '#B5C7D9' : '#0056a4'}`}
            onClick={prevStep}
          />
          <ArrowCircleRight
            className={`cursor-pointer ml-2 ${
              active === dataIntruction?.length - 1
                ? 'pointer-events-none'
                : 'pointer-events-auto'
            }`}
            size="32"
            color={`${
              active === dataIntruction?.length - 1 ? '#B5C7D9' : '#0056a4'
            }`}
            onClick={nextStep}
          />
          <Button
            className="ml-0 sm:ml-10 lg:ml-16 font-medium"
            variant="outline"
            onClick={onClose}
          >
            End tour
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalIntruction;
