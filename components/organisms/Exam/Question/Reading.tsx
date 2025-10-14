import MathJaxRender from '@/components/sharedV2/MathJax';
import React, { useEffect, useState } from 'react';
import { questionEnumType } from '@/enum';
import MultiChoiceOneRight from './MultiChoiceOneRight';
import MultiChoiceMultiRight from './MultiChoiceMultiRight';
import FillBlank from './FillBlank';
import DropDown from './DropDown';
import DragDrop from './DragDrop';
import MultiYesNoOneRight from './MultiYesNoOneRight';
import AnswerDragDrop from '../AnswerQuestion/AnswerDragDrop';
import { Divider } from '@mantine/core';
import { getIndexQuestion2 } from '@/utils';

type ReadingProps = {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType: number;
};

const Reading = ({
  question,
  type,
  data,
  page,
  idHistoryRound,
  listDataResult,
  contestType,
}: ReadingProps) => {
  const [listAnswer, setListAnswer] = useState<any>([]);

  useEffect(() => {
    const answerUserCurrentQuest = listDataResult?.filter(
      (item: any) => item.idQuestion == data[page - 1].idQuestion,
    );
    let arrDataResult: any[] = [];
    answerUserCurrentQuest?.map((item: any) => {
      item?.userAnswer?.map((i: any) => {
        if (i.answer[0]?.idChildQuestion) {
          arrDataResult = [...arrDataResult, ...i.answer];
        } else {
          arrDataResult.push(i);
        }
      });
    });
    arrDataResult = arrDataResult.filter((it: any) => it?.answer !== '');
    setListAnswer(arrDataResult);
  }, [listDataResult, data, page]);

  const getContentQuestion = (listQuestion: any) => {
    const listItemQuestion: any = [];
    listQuestion?.listQuestionChildren?.map((itemQuest: any, index: any) => {
      let itemQuestion: any = <></>;
      switch (itemQuest.quiz_type) {
        case questionEnumType.ONE_RIGHT:
          itemQuestion = (
            <MultiChoiceOneRight
              question={itemQuest}
              indexQuestion={index}
              key={index}
              data={data}
              page={page}
              idHistoryRound={idHistoryRound}
              type={type}
              listDataResult={listAnswer}
              contestType={contestType}
            />
          );
          break;
        case questionEnumType.MULTIPLE_RIGHT:
          itemQuestion = (
            <MultiChoiceMultiRight
              question={itemQuest}
              indexQuestion={index}
              key={index}
              data={data}
              page={page}
              idHistoryRound={idHistoryRound}
              type={type}
              listDataResult={listAnswer}
              contestType={contestType}
            />
          );
          break;
        case questionEnumType.SHORT:
          itemQuestion = (
            <FillBlank
              key={index}
              indexQuestion={index}
              question={itemQuest}
              data={data}
              page={page}
              idHistoryRound={idHistoryRound}
              type={type}
              listDataResult={listAnswer}
              contestType={contestType}
            />
          );
          break;
        case questionEnumType.FILL_BLANK:
          itemQuestion = (
            <FillBlank
              key={index}
              indexQuestion={index}
              question={itemQuest}
              data={data}
              page={page}
              idHistoryRound={idHistoryRound}
              type={type}
              listDataResult={listAnswer}
              contestType={contestType}
            />
          );
          break;
        case questionEnumType.DROPDOWN:
          itemQuestion = (
            <DropDown
              key={index}
              indexQuestion={index}
              question={itemQuest}
              data={data}
              page={page}
              idHistoryRound={idHistoryRound}
              type={type}
              listDataResult={listAnswer}
              contestType={contestType}
            />
          );
          break;
        case questionEnumType.DRAG_DROP:
          itemQuestion =
            type == 'answer-detail' ? (
              <AnswerDragDrop
                key={index}
                indexQuestion={index}
                question={itemQuest}
                data={data}
                page={page}
                type={type}
                listDataResult={listAnswer}
                contestType={contestType}
              />
            ) : (
              <DragDrop
                key={index}
                indexQuestion={index}
                question={itemQuest}
                data={data}
                page={page}
                idHistoryRound={idHistoryRound}
                type={type}
                contestType={contestType}
              />
            );
          break;
        case questionEnumType.MULTIPLE_YES_NO_ONE_RIGHT:
          itemQuestion = (
            <MultiYesNoOneRight
              key={index}
              indexQuestion={index}
              question={itemQuest}
              data={data}
              page={page}
              idHistoryRound={idHistoryRound}
              type={type}
              listDataResult={listAnswer}
              contestType={contestType}
            />
          );
          break;
        default:
          break;
      }
      listItemQuestion.push(itemQuestion);
    });
    return listItemQuestion;
  };

  return (
    <div>
      <div className="flex items-center">
        <div className="bg-ct-secondary-100 text-ct-secondary-500 h-6 px-2 rounded-3xl mr-[10px]">
          {getIndexQuestion2(data, page, question.idChildQuestion)}
        </div>
        Read passage and anwer question
      </div>
      <div className=" flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        {question?.text && (
          <p className="question-desc flex-1 md:h-[400px] overflow-y-auto">
            <MathJaxRender math={`${question?.text}`} />
          </p>
        )}
        <Divider orientation="vertical" className="border-ct-neutral-300" />
        <div className="flex-1 md:h-[400px] overflow-y-auto">
          <div className="pb-5 lg:pb-[60px]">
            {question?.listQuestionChildren?.length > 0 && (
              <div className={`flex-col space-y-6 `}>
                {getContentQuestion(question)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reading;
