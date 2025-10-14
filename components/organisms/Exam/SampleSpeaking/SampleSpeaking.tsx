/* eslint-disable camelcase */
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import TestAudio from '@/components/organisms/Exam/TestAudio';
import { ArrowDown2 } from 'iconsax-react';
import './styles.css';

type SampleSpeakingProps = {
  listQuestion: any[];
};

const SampleSpeaking = ({ listQuestion }: SampleSpeakingProps) => {
  return (
    <div className="bg-white my-6 py-6 sm:py-10 sm:rounded-2xl sm:mx-6 lg:mx-20 xl:mx-28 px-2 sm:px-6">
      <h3 className="text-2xl pb-6 sm:pb-10 text-center font-medium">
        IELTS Speaking Test with Model Answers and Audio
      </h3>
      <Accordion className="custom-accordion">
        <AccordionSummary
          expandIcon={<ArrowDown2 size="18" color="#000000" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="bg-ct-neutral-200"
        >
          <p>
            <span className="text-2xl">PART 1</span>
            <span className="text-xl ml-2 sm:ml-6">
              Introduction and Interview
            </span>
          </p>
        </AccordionSummary>
        <AccordionDetails>
          <div className="py-4 sm:p-4 lg:p-6 pr-0">
            {listQuestion[0]?.map((item: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex items-center">
                  <span className="w-9 h-9 inline-flex justify-center items-center rounded-full bg-ct-primary-400 text-lg font-medium text-white mr-4">
                    {index + 1}
                  </span>
                  <p
                    className="flex-1"
                    dangerouslySetInnerHTML={{
                      __html: item?.text,
                    }}
                  ></p>
                </div>
                <div className="w-full sm:w-4/5 lg:w-3/4 px-2 sm:px-4 lg:px-6 py-4">
                  <TestAudio
                    srcAudio={item?.solution_audio}
                    isStart={false}
                    type="answer-key"
                  />
                </div>
                <p
                  className="px-2 sm:px-4 lg:px-6 text-justify"
                  dangerouslySetInnerHTML={{
                    __html: item?.solution || 'No solution',
                  }}
                ></p>
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion className="custom-accordion">
        <AccordionSummary
          expandIcon={<ArrowDown2 size="18" color="#000000" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="bg-ct-neutral-200"
        >
          <p>
            <span className="text-2xl">PART 2</span>
            <span className="text-xl ml-2 sm:ml-6">Individual long turn</span>
          </p>
        </AccordionSummary>
        <AccordionDetails>
          <div className="py-2">
            {listQuestion[1]?.map((item: any, index: number) => (
              <div className="mb-4" key={index}>
                <div
                  className="bg-ct-neutral-200 py-2 px-6 rounded-lg"
                  dangerouslySetInnerHTML={{
                    __html: item?.text,
                  }}
                ></div>
                <div className="w-full sm:w-4/5 lg:w-3/4 px-2 sm:px-4 lg:px-6 pl-3 sm:pl-8 lg:pl-10 py-4">
                  <TestAudio
                    srcAudio={item?.solution_audio}
                    isStart={false}
                    type="answer-key"
                  />
                </div>
                <p
                  className="pl-3 sm:pl-8 lg:pl-10 pr-2 sm:pr-6 text-justify"
                  dangerouslySetInnerHTML={{
                    __html: item?.solution || 'No solution',
                  }}
                ></p>
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion className="custom-accordion">
        <AccordionSummary
          expandIcon={<ArrowDown2 size="18" color="#000000" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="bg-ct-neutral-200"
        >
          <p>
            <span className="text-2xl">PART 3</span>
            <span className="text-xl ml-2 sm:ml-6">Two-way discussion</span>
          </p>
        </AccordionSummary>
        <AccordionDetails>
          <div className="py-4 sm:p-4 lg:p-6 pr-0">
            {listQuestion[2]?.map((item: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex items-center">
                  <span className="w-9 h-9 inline-flex justify-center items-center rounded-full bg-ct-primary-400 text-lg font-medium text-white mr-4">
                    {index + 1}
                  </span>
                  <p
                    className="flex-1"
                    dangerouslySetInnerHTML={{
                      __html: item?.text,
                    }}
                  ></p>
                </div>
                <div className="w-full sm:w-4/5 lg:w-3/4 px-2 sm:px-4 lg:px-6 py-4">
                  <TestAudio
                    srcAudio={item?.solution_audio}
                    isStart={false}
                    type="answer-key"
                  />
                </div>
                <p
                  className="px-2 sm:px-4 lg:px-6 text-justify answer-table"
                  dangerouslySetInnerHTML={{
                    __html: item?.solution || 'No solution',
                  }}
                ></p>
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default SampleSpeaking;
