/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-const */
import { useEffect, useMemo, useState } from 'react';
import MathJaxRender from '@/components/sharedV2/MathJax';

import { getIndexQuestion, getListUserAnswer } from '@/utils';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ListUserAnswer } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { useRouter } from 'next/router';
import { postExamPartSave } from '@/service/api/examConfig';

interface DragDropProps {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  idHistoryRound?: string | null;
  contestType: number;
  listDataResult?: any;
}

const DragDrop = ({
  question,
  indexQuestion,
  type,
  data,
  page,
  idHistoryRound,
  contestType,
  listDataResult,
}: DragDropProps) => {
  const dispatch = useDispatch();
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual);
  const [content, setContent] = useState<any>('');
  const [hiddenBlock, setHiddenBlock] = useState(false);
  const [listAnswerDrag, setListAnswerDrag] = useState<any[]>([]);
  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data]);

  const changeAnswerFill = async () => {
    const dataFill = [];
    for (let i = 0; i < question.listQuestionChildren.length; i++) {
      const ele = document.getElementById(
        `dragdrop-${question.idChildQuestion}-${question.listQuestionChildren[i].idChildQuestion}`,
      ) as HTMLElement;
      let item = null;
      item = {
        idChildQuestion: question.listQuestionChildren[i].idChildQuestion,
        answer: `${ele.firstElementChild?.getAttribute('data-html')}`,
      };
      dataFill.push(item);
    }
    let listUserAnswer = getListUserAnswer(
      listUserAnswerState,
      data,
      page,
      question,
      dataFill,
    );
    dispatch(setListUserAnswer(listUserAnswer));

    const response = await postExamPartSave({
      contest_type: contestType,
      idHistory: idHistoryRound,
      listUserAnswer: [...listUserAnswer],
    });
  };

  useEffect(() => {
    setListAnswerDrag(question?.listAnswerDrag);
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
        <span class="inline-flex items-center my-2">
          <span class="inline-flex items-center justify-center w-[32px] h-[32px] not-italic select-none text-sm text-center bg-ct-secondary-100 text-ct-secondary-500 rounded-full" id='question-${
            indexInputFill + 1
          }'>${
          indexInputFill + 1
        }</span> <span draggable="true" class="droptarget droptarget-${
          question.idChildQuestion
        }" id="dragdrop-${question.idChildQuestion}-${
          question.listQuestionChildren[index]?.idChildQuestion
        }"></span>
        </span>`,
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
      setHiddenBlock(true);
    }

    setContent(contentQuestion);
  }, [question]);

  useEffect(() => {
    const index = listUserAnswerState.findIndex(
      (i: any) => i.idQuestion === data[page - 1].idQuestion,
    );
    if (index !== -1) {
      const indexQues = listUserAnswerState[index]?.answer?.findIndex(
        (i: any) => i.idChildQuestion === question.idChildQuestion,
      );
      if (indexQues !== -1) {
        let arrListAnswerDrag = [...question?.listAnswerDrag];
        listUserAnswerState[index]?.answer[indexQues].answer.map(
          (item: any) => {
            if (item.answer !== 'undefined') {
              const element = document.getElementById(
                `dragdrop-${question.idChildQuestion}-${item.idChildQuestion}`,
              ) as HTMLElement;

              if (element !== null) {
                arrListAnswerDrag = arrListAnswerDrag.filter(
                  (i: any) => i != item.answer,
                );
                const nodeChild = `<span draggable="true" class="dragtarget" data-id="${question.idChildQuestion}" data-html="${item.answer}">${item.answer}</span>`;
                element.innerHTML = nodeChild;
              }
            }
          },
        );
        setListAnswerDrag(arrListAnswerDrag);
      }
    }
  }, [content, listUserAnswerState]);

  // eslint-disable-next-line no-var
  var dragP: any;
  let idChild: any;
  /* Events fired on the drag target */

  document.addEventListener('dragstart', function (event: any) {
    dragP = event.target;
    event.dataTransfer.setData('text', event.target.id);
    idChild = event.target.getAttribute('data-id');

    // Change the opacity of the draggable element
    event.target.style.opacity = '0.4';
  });

  // While dragging the p element, change the color of the output text
  // document.addEventListener("drag", function (event) {
  // });

  // Output some text when finished dragging the p element and reset the opacity
  document.addEventListener('dragend', function (event: any) {
    event.target.style.opacity = '1';

    // event.target.style.border = '2px solid #017EFA';
    const itemDrag = document.getElementById(
      `answerDrag-${question?.idChildQuestion}`,
    ) as HTMLElement;
    Array.from({ length: itemDrag.childElementCount }).map(
      (item: any, index: number) => {
        itemDrag.getElementsByTagName('span')[index].style.border = '';
      },
    );
  });

  /* Events fired on the drop target */

  // When the draggable p element enters the droptarget, change the DIVS's border style
  document.addEventListener('dragenter', function (event: any) {
    if (event.target.className == 'droptarget') {
      // event.target.style.border = '3px dotted red';
    }
  });

  // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
  document.addEventListener('dragover', function (event: any) {
    event.preventDefault();
  });
  document.addEventListener('dragleave', function (event: any) {
    if (event.target.className == 'droptarget') {
      // event.target.style.border = '';
    }
  });

  // When the draggable p element leaves the droptarget, reset the DIVS's border style

  document.addEventListener('drop', function (event: any) {
    event.preventDefault();
    event.stopPropagation();

    const targetDiv: HTMLElement = event.target;

    if (targetDiv.className.includes(`droptarget-${idChild}`)) {
      targetDiv.style.border = 'none';
      if (targetDiv.childElementCount != 0) {
        const childP = targetDiv.getElementsByTagName('span')[0];
        const answerDrag = document.getElementById(
          `answerDrag-${idChild}`,
        ) as HTMLElement;
        answerDrag.appendChild(childP);
        childP.style.border = '';
      }
      console.log(dragP, targetDiv);
      if (dragP !== undefined) targetDiv.appendChild(dragP);
      else {
        const data = event.dataTransfer.getData('text');
        const dropItem = document.getElementById(data) as HTMLElement;
        targetDiv.appendChild(dropItem);
      }
      dragP = null;
    }

    if (
      event.target?.parentNode?.parentNode?.className?.includes(
        `droptarget-${idChild}`,
      )
    ) {
      const targetDrop = event.target?.parentNode?.parentNode;
      targetDrop.style.border = 'none';
      if (targetDrop.childElementCount != 0) {
        const childP = targetDrop.getElementsByTagName('span')[0];
        const answerDrag = document.getElementById(
          `answerDrag-${idChild}`,
        ) as HTMLElement;
        answerDrag.appendChild(childP);
        childP.style.border = '';
      }
      if (dragP !== undefined) targetDrop.appendChild(dragP);
      else {
        const data = event.dataTransfer.getData('text');
        const dropItem = document.getElementById(data) as HTMLElement;
        targetDrop.appendChild(dropItem);
      }
      dragP = null;
    }

    if (targetDiv.className.includes(`dropback-${idChild}`)) {
      const answerDrag = document.getElementById(
        `answerDrag-${idChild}`,
      ) as HTMLElement;
      if (dragP !== undefined) answerDrag.appendChild(dragP);
      else {
        const data = event.dataTransfer.getData('text');
        const dropItem = document.getElementById(data) as HTMLElement;
        answerDrag.appendChild(dropItem);
      }
      dragP = null;
    }
  });

  return (
    <div className={`mt-4`}>
      <p>
        <MathJaxRender math={`${question?.description}`} />
      </p>
      <div className="question-drapdrop" onDragEnd={changeAnswerFill}>
        <MathJaxRender math={`${content}`} />

        <div
          className={`flex flex-wrap items-center  ${
            hiddenBlock ? `hidden` : ``
          }`}
          id="block-drag"
        >
          <div
            className={`${
              hiddenBlock ? `mt-0 mb-3` : `mt-4`
            } w-full pt-6 pl-2 pb-2 relative flex flex-wrap border border-t-ct-neutral-300 dropback-${
              question?.idChildQuestion
            }`}
            id={`answerDrag-${question?.idChildQuestion}`}
          >
            {listAnswerDrag.map((item: any, index: number) => (
              <span
                key={index}
                draggable="true"
                className="dragtarget"
                id={`dragtarget-${indexFillQues + index}`}
                data-html={item}
                data-id={question?.idChildQuestion}
                dangerouslySetInnerHTML={{ __html: item }}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDrop;
