import React, { Fragment, useEffect, useRef, useState, Suspense } from 'react';
import Draggable from '../drag/Draggable';
import DragGroup from '../drag/DragGroup';
import Droppable from '../drag/Droppable';
import {
  DndProvider,
  TouchTransition,
  MouseTransition,
} from 'react-dnd-multi-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import HtmlToReact from 'html-to-react';
import {
  setListUserAnswer,
  setListUserAnswerDraft,
} from '@/store/slice/examInfo';
import { ListUserAnswerDraft } from '@/store/selector';
import Image from '@/components/shared/Image';

export const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

interface DragDropProps {
  question: any;
}

function DragDrop({ question }: DragDropProps) {
  const columns = ['box0', 'box1', 'box2', 'box3', 'box4', 'box5', 'box6'];
  var stateArray: any[][] = Array(columns.length).fill([]);
  const [stateLoadArray, setStateLoadArray] = useState(stateArray);
  const [listAnswerChild, setListAnswerChild] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIdQuest, setIsIdQuest] = useState('');
  const [isItem, setIsItem] = useState<any>({});
  const dispatch = useAppDispatch();
  const listAnswerUser = useAppSelector(
    (state) => state.examInfo.listUserAnswer,
    shallowEqual,
  );
  const listAnswerDraft = useAppSelector(ListUserAnswerDraft, shallowEqual);

  const refStateLoadArray = useRef(stateArray);

  useEffect(() => {
    if (!question) {
      return;
    }
    let answer = listAnswerUser.find(
      (item) => item?.idQuestion == question?.idQuestion,
    );
    if (answer) {
      setListAnswerChild(answer.answer);
    }

    stateArray = Array(columns.length).fill([]);
    let listDrag = question.listAnswerDrag;
    let arrayDragAnswer: any[] = [];
    let listQuestionChildren = question.listQuestionChildren;
    const newStateArray = [...stateArray];
    listDrag?.map((e: any, index: number) => {
      if (!answer) {
        arrayDragAnswer.push({
          text: e,
          id: question.idQuestion + '_index_' + index,
        });
      } else {
        const find = answer.answer.findIndex((e2: any, index2: number) => {
          if (e2.id == question.idQuestion + '_index_' + index) {
            return e2;
          }
        });
        if (find == -1) {
          arrayDragAnswer.push({
            text: e,
            id: question.idQuestion + '_index_' + index,
          });
        } else {
          let answer_child = answer.answer[find];
          if (answer_child.answer && answer_child.answer.length > 0) {
            listQuestionChildren?.map((e3: any, index3: number) => {
              if (
                e3.idChildQuestion == answer_child.idChildQuestion &&
                answer_child.id == question.idQuestion + '_index_' + index
              ) {
                newStateArray[index3 + 1] = [
                  { text: answer_child.answer, id: answer_child.id },
                ];
              }
            });
          }
        }
      }
    });
    newStateArray[0] = arrayDragAnswer;

    stateArray = [...newStateArray];
    refStateLoadArray.current = newStateArray;
    setStateLoadArray(newStateArray);
  }, [question]);

  useEffect(() => {
    if (!question || listAnswerChild.length == 0 || listAnswerChild[0] == 1)
      return;
    let idQuestion = question.idQuestion;

    let item = {
      idQuestion: idQuestion,
      answer: listAnswerChild,
      quiz_type: question?.quiz_type,
    };
    let draftFilter = listAnswerDraft?.filter(
      (item) => item?.idQuestion != idQuestion,
    );
    let answerFilter = listAnswerUser?.filter(
      (item) => item?.idQuestion != idQuestion,
    );
    dispatch(setListUserAnswerDraft([item, ...draftFilter]));
    dispatch(setListUserAnswer([item, ...answerFilter]));
  }, [listAnswerChild]);

  useEffect(() => {
    console.log('stateLoadArray', stateLoadArray);
    if (!stateLoadArray) {
      return;
    }
    if (!question) {
      return;
    }
    if (listAnswerChild.length == 0) {
      return;
    }
    setListAnswerChild([]);
    let answer_load: any[] = [];
    stateLoadArray.map((e, index) => {
      question.listQuestionChildren?.map((e2: any, index2: number) => {
        if (index == index2 + 1) {
          if (!e[0]) return;
          answer_load.push({
            idChildQuestion: e2.idChildQuestion,
            id: e[0].id,
            answer: e[0].text,
          });
        }
      });
    });
    setListAnswerChild(answer_load);
  }, [stateLoadArray]);

  useEffect(() => {
    if (!isLoading) return;
    let item = isItem;
    let idQuest = isIdQuest;
    let copyStateArray = [...stateLoadArray];
    let newStateArray = [...stateLoadArray];
    let oldIndex = -1;
    newStateArray.forEach((itemCopy, index) => {
      itemCopy.map((child) => {
        if (child.id == item.id) {
          oldIndex = index;
        }
      });
    });

    columns.map((col, index) => {
      const index_find = copyStateArray[index].findIndex(
        (each) => each.id == item.id,
      );
      if (index_find != -1) {
        copyStateArray[index].splice(index_find, 1);
      }

      if (col == idQuest) {
        if (index == 0) {
          copyStateArray[index] = [
            ...copyStateArray[index],
            {
              text: item.text,
              id: item.id,
            },
          ];
        }
        // truong hop 1: ko co gia tri
        if (copyStateArray[index].length == 0) {
          copyStateArray[index] = [
            {
              text: item.text,
              id: item.id,
            },
          ];
        }
        // truong hop 2: co gia tri
        else {
          if (index != 0) {
            if (oldIndex != 0)
              copyStateArray[oldIndex] = [...copyStateArray[index]];
            else
              copyStateArray[0] = [
                ...copyStateArray[0],
                copyStateArray[index][0],
              ];
            copyStateArray[index] = [
              {
                text: item.text,
                id: item.id,
              },
            ];
          }
        }
      }
    });
    setIsLoading(false);
    refStateLoadArray.current = copyStateArray;
    setStateLoadArray(copyStateArray);
  }, [isLoading]);

  const renderTemplate = (htmlString: string, stateArray: any[][]) => {
    let replaceIndex = 0;

    const htmlParser = new HtmlToReact.Parser();
    const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions();

    function isValidNode() {
      return true;
    }

    const processingInstructions = [
      {
        shouldProcessNode: (node: any) => {
          return node.data && node.data.indexOf('___') !== -1;
        },
        processNode: (node: any, children: any) => {
          let attribs = node.attribs;

          let content: any = node.data.split('___');

          content = content.reduce((reduceValue: any[], el: any, index: number) => {
            if (reduceValue.length == 0) {
              reduceValue.push(el);
              return reduceValue;
            }

            if (reduceValue.length % 2 !== 0) {
              reduceValue.push(
                <div
                  key={'box_group_' + question.idQuestion + (replaceIndex + 1)}
                  className="!inline-block my-[10px] mr-2 box_drag_type4"
                >
                  <Droppable
                    accept="drag-3"
                    handleDrop={handleBox}
                    state={stateArray[replaceIndex + 1]}
                    idQuest={'box' + (replaceIndex + 1)}
                    answer_child={true}
                    key={'box_drop' + (replaceIndex + 1)}
                    isQuestion={true}
                  >
                    <DragGroup answer={true}>
                      {stateArray[replaceIndex + 1].map((drag: any) => (
                        <Draggable
                          key={'box_drag_' + (replaceIndex + 1)}
                          type="drag-3"
                          text={drag.text}
                          item={{ text: drag.text, id: drag.id }}
                          state={stateArray[replaceIndex + 1]}
                        />
                      ))}
                    </DragGroup>
                  </Droppable>
                </div>,
              );
              replaceIndex++;

              reduceValue.push(el);

              return reduceValue;
            }
          }, []);
          return React.createElement(React.Fragment, { ...attribs }, content);
        },
      },
      {
        shouldProcessNode: () => true,
        processNode: processNodeDefinitions.processDefaultNode,
      },
    ];

    return htmlParser.parseWithInstructions(
      htmlString,
      isValidNode,
      processingInstructions,
    );
  };

  const handleBox = (item: any, monitor: any, state: any, idQuest: any) => {
    console.log(item, monitor, state, idQuest);
    if (state.find((each: any) => each.id == item.id)) return;
    setIsLoading(true);
    setListAnswerChild([1]);
    setIsIdQuest(idQuest);
    setIsItem(item);
  };

  const RenderContentQuestion: React.FC<{ question: any; state: any[][] }> = (props) => {
    const { question, state } = props;

    const questionContent = renderTemplate(question.text, state);
    return questionContent;
  };

  const RenderOptionContent: React.FC<{ question: any; state: any[][] }> = (props) => {
    const { question, state } = props;

    const optionContent = (
      <div className="mt-[16px]" key={`drop_box0_${question.idQuestion}`}>
        <Droppable
          accept="drag-3"
          handleDrop={handleBox}
          state={state[0]}
          idQuest="box0"
        >
          <DragGroup>
            {state[0].map((drag: any) => (
              <Draggable
                key={drag.text}
                type="drag-3"
                text={drag.text}
                item={{ text: drag.text, id: drag.id }}
                state={state[0]}
              />
            ))}
          </DragGroup>
        </Droppable>
      </div>
    );

    return optionContent;
  };

  return (
    <div className='h-full overflow-y-auto'>
      <div className="flex justify-center items-center w-full">
        {question?.image && (
          <Image
            height={200}
            width={200}
            loader={() => question?.image}
            src={question?.image}
            alt="image_one_right_question"
          />
        )}
      </div>
      <div className="box_question text-[14px] lg:text-[16px]">
        <DndProvider options={HTML5toTouch}>
          <div className="font-[500] my-3">
            <RenderContentQuestion question={question} state={stateLoadArray} />
          </div>
          <RenderOptionContent question={question} state={stateLoadArray} />
        </DndProvider>
      </div>
    </div>
  );
}
export default DragDrop;
