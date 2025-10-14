/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Modal } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { Sms, User } from 'iconsax-react';
import { questionEnumType } from 'enum';
import { getUserChoice } from 'utils';

type ModalAnswerProps = {
  isOpen: boolean;
  onClose: () => void;
  listQuestion: any;
  listDataQuestion: any;
  listDataResult: any;
};

const ModalAnswer = ({
  isOpen,
  onClose,
  listQuestion,
  listDataQuestion,
  listDataResult,
}: ModalAnswerProps) => {
  return (
    <>
      <Modal
        opened={isOpen}
        centered
        withCloseButton={false}
        onClose={onClose}
        className="min-w-[360px]"
        radius={'lg'}
        zIndex={2000}
        size={'xl'}
      >
        <div className="sm:px-6">
          {/* <div className="flex items-center justify-center gap-6">
            <p className="flex items-center gap-1">
              <User size="20" color="#292d32" variant="Bold" /> User name
            </p>
            <p className="flex items-center gap-1">
              <Sms size="20" color="#292d32" variant="Bold" /> mail@xyz.com
            </p>
          </div> */}
          <h3 className="text-2xl text-ct-primary-400 text-center mt-4">
            Answer Sheet
          </h3>
          <div className="my-6">
            {listQuestion?.length > 0 &&
              listQuestion?.map((item: any, index: any) => {
                let arrDataQuestion: any[] = [];
                item?.listQuestionChildren.map((i: any) => {
                  if (
                    i.quiz_type === questionEnumType.ONE_RIGHT ||
                    i.quiz_type === questionEnumType.MULTIPLE_RIGHT
                  ) {
                    arrDataQuestion.push(i);
                  } else {
                    arrDataQuestion = [
                      ...arrDataQuestion,
                      ...i.listQuestionChildren,
                    ];
                  }
                });
                // let indexChildQues = listDataQuestion.findIndex(
                //   (i: any) =>
                //     i.idChildQuestion === arrDataQuestion[0].idChildQuestion,
                // );

                return (
                  <div key={index}>
                    <h5 className="font-medium mb-3 mt-6">
                      Section{index + 1}
                    </h5>
                    <div className="grid grid-cols-4 border border-ct-neutral-400 ">
                      {arrDataQuestion.map((it: any, indexQues: any) => {
                        const indexResult = listDataResult.findIndex(
                          (i: any) => i.idChildQuestion === it.idChildQuestion,
                        );
                        let indexChild =
                          listDataQuestion.findIndex(
                            (i: any) =>
                              i.idChildQuestion === it.idChildQuestion,
                          ) + 1;

                        let result = '';
                        let resultMobile = '';
                        if (indexResult !== -1) {
                          if (
                            it.quiz_type === questionEnumType.ONE_RIGHT ||
                            it.quiz_type === questionEnumType.MULTIPLE_RIGHT
                          ) {
                            if (listDataResult[indexResult]?.answer?.length) {
                              listDataResult[indexResult]?.answer?.map(
                                (id: any) => {
                                  const indexOption =
                                    it?.listSelectOptions?.findIndex(
                                      (option: any) => option.answer_id === id,
                                    );

                                  result += `${it?.listSelectOptions[indexOption]?.answer_content}`;
                                  resultMobile += getUserChoice(indexOption);
                                },
                              );
                            }
                          } else {
                            result = listDataResult[indexResult]?.answer;
                            resultMobile = listDataResult[indexResult]?.answer;
                          }
                        }

                        return (
                          <div
                            key={it.idChildQuestion}
                            className={`bg-white p-2 pb-4 border-ct-neutral-400 flex flex-wrap space-x-1 ${
                              (indexQues + 1) % 4 !== 0 && 'border-r'
                            } ${
                              indexQues <
                                arrDataQuestion.length -
                                  (arrDataQuestion.length % 4) && 'border-b'
                            }`}
                          >
                            <p className="flex">
                              Q
                              {it.quiz_type === questionEnumType.MULTIPLE_RIGHT
                                ? `${indexChild}-${
                                    indexChild - 1 + (it?.maxAnswerChoice || 1)
                                  }`
                                : indexChild}
                            </p>
                            <p
                              className="answer-user-choice hidden lg:block"
                              dangerouslySetInnerHTML={{
                                __html: result,
                              }}
                            ></p>
                            <p
                              className="answer-user-choice flex space-x-1 lg:hidden"
                              dangerouslySetInnerHTML={{
                                __html: resultMobile,
                              }}
                            ></p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
          <div>
            <Button className="mx-auto" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalAnswer;
