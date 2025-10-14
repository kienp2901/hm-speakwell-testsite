/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-const */
import { useEffect, useMemo, useState } from 'react';
import MathJaxRender from '@/components/sharedV2/MathJax';
import { getIndexQuestion } from 'utils';

interface DragDropProps {
  question: any;
  indexQuestion: number;
  type?: string;
  page: number;
  data: any;
  listDataResult: any;
  contestType?: number;
}

const AnswerDragDrop = ({
  question,
  indexQuestion,
  type,
  page,
  data,
  listDataResult,
  contestType = 0,
}: DragDropProps) => {
  const [content, setContent] = useState<any>('');
  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data]);

  const checkUserAnswer = (idChildQuestion: number) => {
    if (type === 'answer-detail') {
      const index = listDataResult.findIndex(
        (i: any) => i.idChildQuestion === idChildQuestion,
      );
      if (index === -1) {
        return false;
      } else {
        return listDataResult[index].isTrue;
      }
    }
  };

  const renderUserAnswer = (idChildQuestion: number) => {
    if (type === 'answer-detail') {
      const index = listDataResult.findIndex(
        (i: any) => i.idChildQuestion === idChildQuestion,
      );

      if (index === -1) {
        return '';
      } else {
        return listDataResult[index].answer == 'undefined'
          ? ''
          : listDataResult[index].answer;
      }
    }
  };

  useEffect(() => {
    let indexInputFill = indexFillQues;
    let contentQuestion = question.text;
    const regex = /___/gi;
    let result;
    const indices = [];
    while ((result = regex.exec(contentQuestion))) {
      indices.push(result.index);
    }
    indices.map((item: any, index: any) => {
      contentQuestion = contentQuestion.replace(
        '___',
        `
        <span class=" inline-flex flex-row space-x-1 my-1 items-center">
        <div class="bg-[#b5c7d9] inline-flex min-h-[32px] min-w-[80px] py-1 px-3 rounded ${
          checkUserAnswer(
            question?.listQuestionChildren[index]?.idChildQuestion,
          )
            ? 'text-ct-true'
            : 'text-ct-fail'
        }">${renderUserAnswer(
          question?.listQuestionChildren[index]?.idChildQuestion,
        )}</div>
        </span>
        `,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      indexInputFill++;
    });
    if (contentQuestion.includes('$$$')) {
      const blockDrag = document.getElementById('block-drag') as HTMLElement;

      contentQuestion = contentQuestion.replace(
        '$$$',
        `${blockDrag.innerHTML}`,
      );
    }

    setContent(contentQuestion);
  }, [listDataResult]);

  return (
    <div className="question-drapdrop">
      <MathJaxRender math={`${content}`} />

      <div className={`flex flex-wrap items-center mt-2 `}>
        <div
          className={` w-full pt-6 pl-2 pb-2 relative flex flex-wrap border border-t-ct-neutral-300 dropback`}
        >
          <div className="mb-2 w-full">
            {question?.listQuestionChildren?.map((item: any, index: any) => (
              <div key={index} className={`w-full flex items-center mb-4`}>
                Answer:{' '}
                <div
                  className="text-ct-true"
                  dangerouslySetInnerHTML={{
                    __html: item?.listShortAnswer?.listKeyword
                      ? item?.listShortAnswer?.listKeyword[0]
                      : '',
                  }}
                />
              </div>
            ))}
          </div>

          {question.listAnswerDrag?.map((item: any, index: number) => (
            <span
              key={index}
              className={`bg-[#b5c7d9] py-[6px] px-3 rounded mr-2 mb-1`}
              data-html={item}
              dangerouslySetInnerHTML={{ __html: item }}
            ></span>
          ))}
        </div>
      </div>
      <div className="bg-white mt-2 sm:mt-3 rounded-2xl px-[6px] sm:px-3 py-2 sm:py-[10px]">
        <span className="text-ct-primary-400">Explain</span>
        <p
          dangerouslySetInnerHTML={{ __html: question.solution || 'no data' }}
        ></p>
      </div>
    </div>
  );
};

export default AnswerDragDrop;
