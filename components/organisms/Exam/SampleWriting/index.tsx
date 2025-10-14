import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ZoomIn from '@/components/sharedV2/ZoomIn';
import { ArrowDown2 } from 'iconsax-react';

type SampleWritingProps = {
  listQuestion: any[];
};

const SampleWriting = ({ listQuestion = [] }: SampleWritingProps) => {
  return (
    <div className="bg-white my-6 py-6 sm:py-10 sm:rounded-2xl sm:mx-6 lg:mx-28 px-4 sm:px-6">
      <h3 className="text-2xl pb-6 sm:pb-10 text-center font-medium">
        IELTS Writing Test with Model Answers
      </h3>
      {listQuestion.map((item: any, index: number) => (
        <Accordion className="custom-accordion" key={index}>
          <AccordionSummary
            expandIcon={<ArrowDown2 size="18" color="#000000" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <p>
              <span className="text-2xl">Task {index + 1}</span>
            </p>
          </AccordionSummary>
          <AccordionDetails>
            <div className="bg-ct-neutral-200 p-6 mt-2 mb-4 rounded-lg overflow-x-auto">
              <div
                className="answer-table"
                dangerouslySetInnerHTML={{
                  __html: item?.text,
                }}
              ></div>
              {item?.image ? (
                <div className="flex items-center">
                  <ZoomIn
                    src={item?.image}
                    className="h-[500px] my-4 rounded-2xl"
                    alt="IMG"
                  />
                </div>
              ) : (
                ''
              )}
              {item?.audio ? <audio src={item?.audio} controls></audio> : ''}
              {item?.video ? (
                <video
                  src={item?.video}
                  controls
                  className="w-[560px] h-[315px] rounded-xl"
                ></video>
              ) : (
                ''
              )}
            </div>
            <div className="mb-6">
              <p className="text-[22px]">
                {index === 1 ? 'Outline & Model Answer' : 'Model Answer'}
              </p>
              <div className="sm:mt-4 sm:p-4 sm:border sm:border-ct-neutral-700 sm:rounded-2xl">
                <div
                  className="text-justify answer-table"
                  dangerouslySetInnerHTML={{
                    __html: item?.solution,
                  }}
                ></div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
      {/* <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full items-center justify-between  bg-ct-neutral-200 px-6 py-2 text-left focus:outline-none focus-visible:ring">
              <p>
                <span className="text-2xl">Task 1</span>
              </p>
              <ArrowDown2
                className={`${open && 'rotate-180'}`}
                size="18"
                color="#000000"
              />
            </Disclosure.Button>

            <Transition
              enter="transition duration-150 ease-linear"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-150 ease-linear"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel>
                <div className="bg-ct-neutral-200 p-6 mt-2 mb-4 rounded-lg">
                  {listQuestion.length > 0 && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: listQuestion[0]?.text,
                      }}
                    ></div>
                  )}
                </div>
                <div className="mb-6">
                  <p className="text-[22px]">Model Answer</p>
                  <div className="mt-4 p-4 border border-ct-neutral-700 rounded-2xl">
                    {listQuestion?.length > 0 && (
                      <>
                        <p
                          className="text-justify"
                          dangerouslySetInnerHTML={{
                            __html: listQuestion[0]?.solution,
                          }}
                        ></p>
                        <p className="font-bold mt-6 text-right">(0 Words)</p>
                      </>
                    )}
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure> */}
    </div>
  );
};

export default SampleWriting;
