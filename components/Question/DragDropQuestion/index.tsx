import React, { memo, useCallback, useEffect, useState } from 'react';
import MathJax from '../../shared/MathJax';
import style from './style.module.css';
import Image from '@/components/shared/Image';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { examSaveApi } from '@/service/api/contest';
import { IdHistory, ListUserAnswer, StudentId } from '@/store/selector';

interface DragDropQuestionProps {
  text?: string;
  data: any;
}

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({ text, data }) => {
  const {
    text: textChild,
    idQuestion,
    listAnswerDrag,
    listQuestionChildren,
    quiz_type,
    idChildQuestion,
    video,
    audio,
    image,
  } = data;
  const dispatch = useAppDispatch();

  const dataAnswerDraft = useAppSelector(ListUserAnswer, shallowEqual);
  const studentId = useAppSelector(StudentId, shallowEqual);
  const idHistory = useAppSelector(IdHistory, shallowEqual);

  const [content, setContent] = useState<string | null>(null);
  const [hiddenBlock, setHiddenBlock] = useState(false);
  const [listAnswerDragFake, setListDrag] = useState<any[]>(listAnswerDrag);

  const changeAnswerFill = useCallback(() => {
    const dataFill: any[] = [];

    for (let i = 0; i < listQuestionChildren.length; i++) {
      const ele = document.getElementById(
        `fill${idQuestion}${idChildQuestion ?? ''}${i}`,
      );
      let item = null;
      if (ele != null) {
        const answer = ele.firstElementChild?.getAttribute('data-html');
        item = {
          idChildQuestion: listQuestionChildren[i].idChildQuestion,
          answer: `${answer || ''}`,
          weight: 1,
        };
        dataFill.push(item);
      }
    }
    const listUserAnswerTemp = {
      answer: dataFill,
      idQuestion: idQuestion,
    };
    const response = examSaveApi(studentId, {
      idHistory: idHistory,
      listUserAnswer: [listUserAnswerTemp],
    }).then((res) => {});
    const dataFilter = dataAnswerDraft.filter(
      (item) => item?.idQuestion != listUserAnswerTemp?.idQuestion,
    );
    dispatch(setListUserAnswer([listUserAnswerTemp, ...dataFilter]));

    Array.from({ length: listQuestionChildren.length }).map((item, index) => {
      const itemDrop = document.getElementById(
        `fill${idQuestion}${idChildQuestion ?? ''}${index}`,
      );
      if (itemDrop !== null) {
        if (itemDrop.childElementCount != 0) {
          itemDrop.style.border = 'none';
          itemDrop.style.minWidth = 'auto';
        } else {
          itemDrop.style.border = '';
          itemDrop.style.width = '50px';
        }
      }
    });
  }, [idChildQuestion, idQuestion, studentId, idHistory, dataAnswerDraft, listQuestionChildren, dispatch]);

  useEffect(() => {
    setListDrag(listAnswerDrag);
    const RenderQuestion = () => {
      let indexInputFill = 0;
      let index = 1;
      let contentQuestion = textChild;
      const regex = /___/gi;
      let result;
      const indices: number[] = [];
      while ((result = regex.exec(contentQuestion))) {
        indices.push(result.index);
      }
      indices.map(() => {
        contentQuestion = contentQuestion.replace(
          '___',
          `<span draggable="true" key="fill${idQuestion}${
            idChildQuestion ?? ''
          }${indexInputFill}" class='${
            style.droptarget
          } droptarget' id="fill${idQuestion}${
            idChildQuestion ?? ''
          }${indexInputFill}">
          </span>`,
        );
        indexInputFill++;
      });
      if (contentQuestion.includes('$$$')) {
        const blockDrag = document.getElementById('block-drag');

        contentQuestion = contentQuestion.replace(
          '$$$',
          `${blockDrag?.innerHTML || ''}`,
        );
        setHiddenBlock(true);
      }

      setContent(contentQuestion);
    };
    RenderQuestion();
  }, [idChildQuestion, idQuestion, text, textChild]);

  //Add answer draft to curent question
  useEffect(() => {
    const answerDraft = dataAnswerDraft?.find(
      (item) => item?.idQuestion == idQuestion,
    );
    if (answerDraft) {
      const answerChild = answerDraft?.answer?.find(
        (answerChild: any) => answerChild?.idChildQuestion == idChildQuestion,
      );
      if (idChildQuestion) {
        if (answerChild) {
          let newListDrag = [...listAnswerDragFake];
          answerChild?.answer?.map((itemChild: any, index: number) => {
            const node = document.getElementById(
              `fill${idQuestion}${idChildQuestion ?? ''}${index}`,
            );
            if (node != null && itemChild?.answer != '') {
              const index = newListDrag.findIndex(
                (itemDrag) => itemDrag == itemChild?.answer,
              );
              newListDrag.splice(index, 1);

              node.style.border = 'none';
              node.style.width = '50px';
              node.insertAdjacentHTML(
                'afterbegin',
                `<span key="dragtarget${idQuestion}${
                  idChildQuestion ?? ''
                }${index}" draggable="true" class="${
                  style.dragtarget
                }" style="padding: 5px 10px; margin-bottom: 8px" id="dragtarget${index}" data-html="${
                  itemChild?.answer
                }">${itemChild?.answer}</span>`,
              );
              node.getElementsByTagName('span')[0].style.border =
                '2px solid #017EFA';
            }
            setListDrag(newListDrag);
          });
        }
      } else {
        let newListDrag = [...listAnswerDragFake];
        answerDraft?.answer?.map((item: any, index: number) => {
          const node = document.getElementById(
            `fill${idQuestion}${idChildQuestion ?? ''}${index}`,
          );
          if (node != null && item?.answer != '') {
            const index = newListDrag.findIndex(
              (itemDrag) => itemDrag == item?.answer,
            );
            newListDrag.splice(index, 1);
            node.style.border = 'none';
            node.style.width = '50px';
            node.insertAdjacentHTML(
              'afterbegin',
              `<span key="dragtarget${idQuestion}${
                idChildQuestion ?? ''
              }${index}" draggable="true" class="${
                style.dragtarget
              }" style="width: 50px; margin-bottom: 8px" id="dragtarget${index}" data-html="${
                item?.answer
              }">${item?.answer}</span>`,
            );
            node.getElementsByTagName('span')[0].style.border =
              '2px solid #017EFA';
          }
        });
        setListDrag(newListDrag);
      }
    }
  }, [content, dataAnswerDraft, idQuestion, idChildQuestion, listAnswerDragFake]);

  var dragP: any;
  /* Events fired on the drag target */

  document.addEventListener('dragstart', function (event: any) {
    dragP = event.target;
    event.dataTransfer.setData('text', event.target.id);
    // Change the opacity of the draggable element
    event.target.style.opacity = '0.4';
  });

  // Output some text when finished dragging the p element and reset the opacity
  document.addEventListener('dragend', function (event: any) {
    const { parentElement } = event.target;
    event.target.style.opacity = '1';
    if (parentElement.id.includes('fill')) {
      event.target.style.border = '2px solid #017EFA';
    }
    if (parentElement.id === 'answerDrag' && parentElement.childElementCount) {
      Array.from({ length: parentElement.childElementCount }).map(
        (item, index) => {
          parentElement.getElementsByTagName('span')[index].style.border = '';
        },
      );
    }
  });

  /* Events fired on the drop target */

  // When the draggable p element enters the droptarget, change the DIVS's border style
  document.addEventListener('dragenter', function (event: any) {
    if (event.target.className == 'droptarget') {
      console.log('dragenter-2');
    }
  });

  // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
  document.addEventListener('dragover', function (event: any) {
    if (dragP?.textContent?.trim()) {
      event.preventDefault();
    }
  });
  
  document.addEventListener('dragleave', function (event: any) {
    if (event.target.className == 'droptarget') {
      // event.target.style.border = '';
    }
  });

  // When the draggable p element leaves the droptarget, reset the DIVS's border style
  document.addEventListener('drop', function (event: any) {
    event.preventDefault();
    const targetDiv = event.target;
    console.log('drop-1', targetDiv);

    if (targetDiv.className.includes('droptarget')) {
      targetDiv.style.border = 'none';
      console.log('droptarget-1');
      if (targetDiv.childElementCount != 0) {
        const { 0: childP } = targetDiv.getElementsByTagName('span');
        const answerDrag = document.getElementById('answerDrag');
        if (answerDrag !== null) {
          answerDrag.appendChild(childP);
          childP.style.border = '';
        }
      }
      if (dragP !== undefined) targetDiv.appendChild(dragP);
      else {
        const data = event.dataTransfer.getData('text');
        const dropItem = document.getElementById(data);
        targetDiv.appendChild(dropItem);
      }

      dragP = null;
    }
    if (targetDiv.className.includes('dropback')) {
      const answerDrag = document.getElementById('answerDrag');
      if (dragP !== undefined) {
        targetDiv.appendChild(dragP);
      } else {
        const data = event.dataTransfer.getData('text');
        const dropItem = document.getElementById(data);
        if (answerDrag && dropItem) {
          answerDrag.appendChild(dropItem);
        }
      }
      dragP = null;
    }
  });

  return (
    <React.Fragment>
      <div
        className="flex flex-col gap-4 lg:gap-6"
        onDragEnd={changeAnswerFill}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-center items-center w-full">
            {image && (
              <Image
                height={200}
                width={200}
                loader={() => image}
                src={image}
                alt="image_one_right_question"
              />
            )}
          </div>
          <MathJax
            math={content || ''}
            className="lg:font-medium font-normal lg:text-base text-sm"
          />
          {audio && <audio src={audio} controls />}
          {video && (
            <video
              src={video}
              controls
              className="w-[560px] h-[315px] rounded-xl"
            />
          )}
        </div>
        <div
          className={`flex flex-wrap items-center ${
            hiddenBlock ? `hidden` : ``
          }`}
          id="block-drag"
        >
          <div
            className={`${
              hiddenBlock ? `mt-0 mb-3` : ` `
            } w-full pt-8 mb-4 pl-2 pb-2 relative flex justify-center flex-wrap gap-3 border-t-[1px] dropback border-[#ccc] ${
              style.dropback
            }`}
            id="answerDrag"
          >
            {listAnswerDragFake?.map((item, index) => {
              return (
                <span
                  key={
                    'dragtarget' + idQuestion + (idChildQuestion ?? '') + index
                  }
                  draggable="true"
                  className={`${style.dragtarget} px-3 text-center mb-2`}
                  id={
                    'dragtarget' + idQuestion + (idChildQuestion ?? '') + index
                  }
                  data-html={item}
                  dangerouslySetInnerHTML={{ __html: item }}
                ></span>
              );
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default memo(DragDropQuestion);
