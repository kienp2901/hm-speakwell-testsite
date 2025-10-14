/* eslint-disable prefer-const */
/* eslint-disable no-unneeded-ternary */
import React, { useCallback, useMemo, useState } from 'react';
import MathJaxRender from '@/components/sharedV2/MathJax';
import { Radio } from '@mantine/core';
import { getIndexQuestion } from '@/utils';

type MultiYesNoOneRightProp = {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType: number;
};

const MultiYesNoOneRight = ({
  question,
  indexQuestion,
  data,
  page,
  idHistoryRound,
  contestType
}: MultiYesNoOneRightProp) => {
  const { listCheckOptions, listQuestionChildren } = question;
  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data, page]);
  const firstListQuestionChildrenRender = useCallback(() => {
    let newArrQuestion = [...listQuestionChildren];
    newArrQuestion = newArrQuestion.map((item: any) => {
      return {
        ...item,
        listSelectOptions: item.listSelectOptions.map((value: any) => {
          return {
            ...value,
            checked: false,
          };
        }),
      };
    });
    return newArrQuestion;
  }, []);

  const [listQuestion, setListQuestion] = useState<any[]>(
    firstListQuestionChildrenRender(),
  );

  const CheckBoxOneRight = (idCheck: any, index: any) => {
    let newArr: any[] = [...listQuestion];
    let rowChecked = { ...listQuestion[index] };
    rowChecked = {
      ...rowChecked,
      listSelectOptions: rowChecked.listSelectOptions.map((item: any) => {
        return {
          ...item,
          checked: item.idCheck === idCheck ? true : false,
        };
      }),
    };
    newArr.splice(index, 1, rowChecked);
    setListQuestion(newArr);
  };

  return (
    <div className="mt-4">
      {question?.description && (
        <p className="question-desc mb-2">
          <MathJaxRender math={`${question?.description}`} />
          <MathJaxRender math={`${question?.text}`} />
        </p>
      )}
      <div className="overflow-x-auto w-full">
        <table className="w-full multi-yes-no">
          <thead className="w-full">
            <tr>
              <th className="text-center" style={{ minWidth: '300px' }}>
                <p style={{ minWidth: '300px' }}>
                  {listCheckOptions.title_question}
                </p>
              </th>
              {listCheckOptions.title_answer.map((item: any) => (
                <th
                  className="text-center"
                  key={item.idCheck}
                  style={{ minWidth: '90px' }}
                >
                  <p style={{ minWidth: '90px' }}>{item.text}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listQuestion.map((item: any, index: any) => (
              <tr key={index}>
                <td className="pl-2 ">
                  <div className="flex">
                    <div
                      className="bg-ct-secondary-100 w-8 h-8 flex justify-center items-center rounded-full text-sm text-ct-secondary-500"
                      id={`question-${indexFillQues + 1 + index}`}
                    >
                      {indexFillQues + 1 + index}
                    </div>
                    <div className="flex-1 ml-2">
                      <MathJaxRender
                        math={item.text}
                        styletext={'customtable'}
                      />
                    </div>
                  </div>
                </td>
                {item.listSelectOptions.map((i: any) => (
                  <td
                    key={i.idCheck}
                    className="cursor-pointer"
                    onClick={() => {
                      CheckBoxOneRight(i.idCheck, index);
                      //   handleSelectOption(i.answer_id, item.idChildQuestion);
                    }}
                  >
                    <p>
                      <Radio
                        className="flex justify-center"
                        value={''}
                        checked={i.checked}
                        onChange={() => {}}
                        classNames={{
                          body: 'items-center',
                          radio: 'bg-transparent border-ct-neutral-700',
                          inner: 'self-center',
                        }}
                        styles={() => ({
                          radio: {
                            ':checked': {
                              borderColor: '#0056A4',
                              backgroundColor: 'transparent',
                            },
                          },
                          icon: {
                            color: '#0056A4',
                            width: '12px',
                            height: '12px',
                            top: 'calc(50% - 6px)',
                            left: 'calc(50% - 6px)',
                          },
                        })}
                      />
                    </p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MultiYesNoOneRight;
