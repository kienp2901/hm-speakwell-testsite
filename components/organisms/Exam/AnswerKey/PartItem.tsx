import { Divider, Table } from '@mantine/core';

import { TickCircle } from 'iconsax-react';
import { useEffect } from 'react';
import { questionEnumType } from 'enum';

type PartItemTypes = {
  listDataResult: any;
  listDataQuestion: any;
};

const PartItem = ({ listDataResult, listDataQuestion }: PartItemTypes) => {
  const renderYourAnswer = (question: any) => {
    const index = listDataResult.findIndex(
      (i: any) => i.idChildQuestion === question.idChildQuestion,
    );

    if (index === -1) {
      return '....';
    } else {
      if (
        question.quiz_type === questionEnumType.ONE_RIGHT ||
        question.quiz_type === questionEnumType.MULTIPLE_RIGHT
      ) {
        let result = '';
        if (typeof listDataResult[index]?.answer === 'string') {
          result += question.listSelectOptions.find(
            (it: any) => it.answer_id === Number(listDataResult[index]?.answer),
          ).answer_content;
        } else {
          listDataResult[index]?.answer?.map((idQues: any) => {
            const index = question.listSelectOptions.findIndex(
              (it: any) => it.answer_id === idQues,
            );
            result += question.listSelectOptions[index]?.answer_content;
          });
        }
        return (
          <p
            className={`text-ct-primary-400 your-answer ${
              listDataResult[index]?.answer?.length > 1 && 'multi-key'
            }`}
            dangerouslySetInnerHTML={{ __html: result }}
          ></p>
        );
      } else {
        return listDataResult[index].answer;
      }
    }
  };

  const renderKey = (question: any) => {
    const index = listDataResult.findIndex(
      (i: any) => i.idChildQuestion === question.idChildQuestion,
    );

    if (index === -1 || !listDataResult[index].isTrue) {
      if (question.quiz_type === questionEnumType.ONE_RIGHT) {
        let result = '';
        question.listSelectOptions
          .filter((it: any) => it.is_true)
          .map((i: any) => {
            result += i.answer_content;
          });

        return (
          <p
            className={`text-fail`}
            dangerouslySetInnerHTML={{ __html: result }}
          ></p>
        );
      } else if (question.quiz_type === questionEnumType.MULTIPLE_RIGHT) {
        const listQuesTrue = question.listSelectOptions.filter(
          (it: any) => it.is_true,
        );

        return listQuesTrue.map((item: any) => {
          return (
            <p
              key={item?.answer_id}
              className={`${
                question.quiz_type === questionEnumType.MULTIPLE_RIGHT &&
                'multi-key'
              } ${
                listDataResult[index]?.answer?.includes(item?.answer_id)
                  ? 'text-true'
                  : 'text-fail-multi'
              }`}
              dangerouslySetInnerHTML={{ __html: item?.answer_content }}
            ></p>
          );
        });
      } else {
        let result = '';
        if (question?.listShortAnswer?.listKeyword?.length === 1) {
          question?.listShortAnswer?.listKeyword?.map((item: any) => {
            result = item;
          });
        } else {
          question?.listShortAnswer?.listKeyword?.map(
            (item: any, index: any) => {
              if (
                index + 1 ===
                question?.listShortAnswer?.listKeyword?.length
              ) {
                result = result + item;
              } else {
                result = result + item + '/';
              }
            },
          );
        }
        return result;
      }
    } else {
      return (
        <TickCircle
          className="mx-auto"
          size="32"
          color="#009521"
          variant="Bold"
        />
      );
    }
  };

  return (
    <div
      className="flex flex-1 p-4 lg:p-6 flex-col sm:flex-row rounded-2xl"
      style={{
        boxShadow: '0px 4px 16px rgba(0, 58, 125, 0.16)',
      }}
    >
      <div className="flex-1">
        <div className="flex items-center text-sm lg:text-base">
          <p className="w-1/5 text-center">Question</p>
          <p className="w-2/5 text-center mx-1 lg:mx-2">Your answer</p>
          <p className="w-2/5 text-center">Key</p>
        </div>
        {Array.from(new Set(listDataQuestion.slice(0, 20))).map((item: any) => {
          const index =
            listDataQuestion
              .slice(0, 20)
              .findIndex(
                (i: any) => i.idChildQuestion === item.idChildQuestion,
              ) + 1;
          return (
            <div
              className="flex mt-4 items-center border-b border-[#EFF1F4] pb-2"
              key={item.idChildQuestion}
            >
              <div className="w-1/5">
                <p
                  className={`mx-auto w-12 h-8 text-sm font-bold text-white rounded-full flex items-center justify-center ${
                    listDataResult.findIndex(
                      (it: any) => it.idChildQuestion === item.idChildQuestion,
                    ) === -1
                      ? 'bg-ct-neutral-400'
                      : 'bg-ct-primary-400'
                  } `}
                >
                  {item.quiz_type === questionEnumType.MULTIPLE_RIGHT
                    ? `${index}-${index + (item?.maxAnswerChoice || 1) - 1}`
                    : index}
                </p>
              </div>
              <div className="w-2/5 text-ct-primary-400 mx-1 lg:mx-2">
                <p className="text-center text-sm lg:text-base">
                  {renderYourAnswer(item)}
                </p>
              </div>
              <div className="w-2/5">
                <div className="text-center text-ct-fail text-sm lg:text-base">
                  {renderKey(item)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Divider
        orientation="vertical"
        className="hidden sm:block sm:mx-2 lg:mx-4 border-ct-neutral-500"
      />
      <div className="flex-1">
        <div className="hidden sm:flex items-center text-sm lg:text-base">
          <p className="w-1/5 text-center">Question</p>
          <p className="w-2/5 text-center mx-1 lg:mx-2">Your answer</p>
          <p className="w-2/5 text-center">Key</p>
        </div>
        {Array.from(new Set(listDataQuestion.slice(20))).map((item: any) => {
          const index =
            listDataQuestion
              .slice(20)
              .findIndex(
                (i: any) => i.idChildQuestion === item.idChildQuestion,
              ) + 21;

          return (
            <div
              className="flex mt-4 items-center border-b border-[#EFF1F4] pb-2"
              key={item.idChildQuestion}
            >
              <div className="w-1/5">
                <p
                  className={`mx-auto w-12 h-8 text-sm font-bold text-white rounded-full flex items-center justify-center ${
                    listDataResult.findIndex(
                      (it: any) => it.idChildQuestion === item.idChildQuestion,
                    ) === -1
                      ? 'bg-ct-neutral-400'
                      : 'bg-ct-primary-400'
                  } `}
                >
                  {item.quiz_type === questionEnumType.MULTIPLE_RIGHT
                    ? `${index}-${index + item?.maxAnswerChoice - 1}`
                    : index}
                </p>
              </div>
              <div className="w-2/5 text-ct-primary-400 mx-1 lg:mx-2">
                <p className="text-center text-sm lg:text-base">
                  {renderYourAnswer(item)}
                </p>
              </div>
              <div className="w-2/5">
                <div className="text-center text-ct-fail text-sm lg:text-base">
                  {renderKey(item)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartItem;
