/* eslint-disable no-loop-func */
import { Divider } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import MathJaxRender from '@/components/sharedV2/MathJax';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { postExamPartSave } from '@/service/api/examConfig';
import { ListUserAnswer } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { getIndexQuestion, getIndexQuestion2, getListUserAnswer } from '@/utils';
import { useRouter } from 'next/router';

interface FillBlankProps {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType?: number;
}

const FillBlank = ({
  question,
  indexQuestion,
  type,
  data,
  page,
  listDataResult,
  idHistoryRound,
  contestType = 0,
}: FillBlankProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = router.asPath;

  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual);
  const [content, setContent] = useState<string>('');
  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data, page]);

  const [dataFillState, setDataFillState] = useDebouncedState<any>([], 500);

  // State for dropdown
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownData, setDropdownData] = useState<{
    listKeyword: any[];
    currentValue: string;
    inputId: string;
  }>({
    listKeyword: [],
    currentValue: '',
    inputId: '',
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownContainer, setDropdownContainer] = useState<HTMLElement | null>(null);

  // Function global để xử lý click từ HTML
  const showFillblankDropdown = useCallback(
    (inputId: string, listKeyword: any[]) => {
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      const container = inputElement?.closest(
        '.fillblank-container',
      ) as HTMLDivElement;

      if (container && inputElement) {
        // Đặt container position relative nếu chưa có
        if (container.style.position !== 'relative') {
          container.style.position = 'relative';
        }

        setDropdownContainer(container);
        setDropdownPosition({
          top: container.offsetHeight + 2,
          left: 0,
        });

        setDropdownData({
          listKeyword: listKeyword || [],
          currentValue: inputElement.value,
          inputId,
        });

        setDropdownVisible(true);
      }
    },
    [],
  );

  // Effect để đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownVisible && dropdownContainer) {
        const dropdownElement = dropdownContainer.querySelector('.fillblank-dropdown');
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setDropdownVisible(false);
        }
      }
    };

    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible, dropdownContainer]);

  // Effect để cập nhật vị trí dropdown khi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (dropdownVisible && dropdownContainer) {
        setDropdownPosition({
          top: dropdownContainer.offsetHeight + 2,
          left: 0,
        });
      }
    };

    if (dropdownVisible) {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [dropdownVisible, dropdownContainer]);

  // Effect để thêm function global vào window
  useEffect(() => {
    (window as any).showFillblankDropdown = showFillblankDropdown;

    return () => {
      delete (window as any).showFillblankDropdown;
    };
  }, [showFillblankDropdown]);

  const autoResize = (el: any) => {
    if (!el) return;
    el.style.width = '100px'; // reset lại
    el.style.width = el.scrollWidth + 'px'; // set theo nội dung
  };

  // Effect để render dropdown vào container của input
  useEffect(() => {
    if (dropdownVisible && dropdownContainer) {
      // Xóa dropdown cũ nếu có
      const existingDropdown = dropdownContainer.querySelector('.fillblank-dropdown');
      if (existingDropdown) {
        existingDropdown.remove();
      }

      // Tạo dropdown mới
      const dropdownElement = document.createElement('div');
      dropdownElement.className = 'fillblank-dropdown';
      dropdownElement.style.position = 'absolute';
      dropdownElement.style.top = dropdownPosition.top + 'px';
      dropdownElement.style.left = dropdownPosition.left + 'px';
      dropdownElement.style.zIndex = '1000';

      dropdownElement.innerHTML = `
        <div class="dropdown-subtitle">The correct answer is:</div>
        <ul class="dropdown-list">
          ${dropdownData.listKeyword.map(keyword => `<li>${keyword}</li>`).join('')}
        </ul>
      `;

      dropdownContainer.appendChild(dropdownElement);
    }

    return () => {
      if (dropdownContainer) {
        const existingDropdown = dropdownContainer.querySelector('.fillblank-dropdown');
        if (existingDropdown) {
          existingDropdown.remove();
        }
      }
    };
  }, [dropdownVisible, dropdownContainer, dropdownPosition, dropdownData]);

  // Component DropdownBox - không render gì vì đã append vào DOM
  const DropdownBox = () => {
    return null;
  };

  const addInputEvents = (inputId: string, listKeyword: any[]) => {
    // Sử dụng setTimeout để đảm bảo element đã được render
    setTimeout(() => {
      // Tìm input element trước
      const inputElement = document.getElementById(inputId) as HTMLInputElement;

      if (inputElement) {
        // Tìm div container cha của input
        const container = inputElement.closest(
          '.fillblank-container',
        ) as HTMLDivElement;

        if (container) {
          // Thêm sự kiện click vào div container
          container.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            // Đặt container position relative nếu chưa có
            if (container.style.position !== 'relative') {
              container.style.position = 'relative';
            }

            setDropdownContainer(container);
            setDropdownPosition({
              top: container.offsetHeight + 2,
              left: 0,
            });

            setDropdownData({
              listKeyword: listKeyword || [],
              currentValue: inputElement.value,
              inputId,
            });

            setDropdownVisible(true);
          });
        }
      }
    }, 500); // Tăng timeout để đảm bảo DOM đã render
  };

  const changeAnswerFill = () => {
    const dataFill = [];
    // let indexInputFill = indexFillQues;
    for (let i = 0; i < question?.listQuestionChildren?.length; i++) {
      const questionId =
        question?.idChildQuestion || question?.idQuestion || 'unknown';
      const childQuestionId =
        question.listQuestionChildren[i].idChildQuestion || 'unknown';

      const ele = document.getElementById(
        `fillblank-${questionId}-${childQuestionId}`,
      ) as HTMLInputElement;
      let item = null;
      item = {
        idChildQuestion: question.listQuestionChildren[i].idChildQuestion,
        answer: `${ele.value}`,
      };
      dataFill.push(item);
    }

    setDataFillState(dataFill);
  };

  const saveQuestion = async () => {
    const listUserAnswer = getListUserAnswer(
      listUserAnswerState,
      data,
      page,
      question,
      dataFillState,
    );
    dispatch(setListUserAnswer(listUserAnswer));

    await postExamPartSave({
      contest_type: contestType,
      idHistory: idHistoryRound,
      listUserAnswer: [...listUserAnswer],
    });
  };

  const checkUserAnswer = (idChildQuestion: number) => {
    if (type === 'answer-detail') {
      if (data[page - 1].quiz_type == 6) {
        const index = listDataResult?.findIndex(
          (i: any) => i.idChildQuestion === idChildQuestion,
        );
        if (index === -1) {
          return false;
        } else {
          return listDataResult[index].isTrue;
        }
      } else {
        const index = listDataResult[0]?.userAnswer?.findIndex(
          (i: any) => i.idChildQuestion === idChildQuestion,
        );
        if (index === -1) {
          return false;
        } else {
          return listDataResult[0]?.userAnswer[index]?.isTrue;
        }
      }
    }
  };

  const renderUserAnswer = (idChildQuestion: number) => {
    // console.log('idChildQuestion', listDataResult, idChildQuestion);

    if (type === 'answer-detail') {
      if (data[page - 1].quiz_type == 6) {
        const index = listDataResult.findIndex(
          (i: any) => i.idChildQuestion === idChildQuestion,
        );
        if (index === -1) {
          return '';
        } else {
          return listDataResult[index].answer;
        }
      } else {
        if (listDataResult.length === 0) return '';

        const index = listDataResult[0]?.userAnswer?.findIndex(
          (i: any) => i.idChildQuestion === idChildQuestion,
        );
        if (index === -1) {
          return '';
        } else {
          return listDataResult[0]?.userAnswer[index]?.answer;
        }
      }
    }
  };

  // old code
  // useEffect(() => {
  //   let indexInputFill = indexFillQues;
  //   let contentQuestion = `${question.text}`;
  //   const regex = /___/gi;
  //   let result;
  //   const indices = [];
  //   while ((result = regex.exec(question.text))) {
  //     indices.push(result.index);
  //   }

  //   indices?.map((item: any, index: any) => {
  //     let correctAnswer = '';
  //     if (type === 'answer-detail') {
  //       correctAnswer =
  //         question?.listQuestionChildren[index]?.listShortAnswer &&
  //         Object.keys(question?.listQuestionChildren[index]?.listShortAnswer)
  //           .length > 0
  //           ? question?.listQuestionChildren[index]?.listShortAnswer
  //               ?.listKeyword
  //             ? question?.listQuestionChildren[index]?.listShortAnswer
  //                 ?.listKeyword[0]
  //             : ''
  //           : '';
  //     }
  //     contentQuestion = contentQuestion.replace(
  //       '___',
  //       `
  //     <span class=' items-center '>
  //       ${
  //         !pathname.includes('exercise')
  //           ? `<span
  //             class="relative select-none bg-ct-secondary-100 w-8 h-8 inline-flex justify-center items-center rounded-full text-sm text-ct-secondary-500"
  //             id="question-${indexInputFill + 1}"
  //           >
  //             ${indexInputFill + 1}
  //           </span>`
  //           : ''
  //       }
  //       ${
  //         type === 'answer-detail'
  //           ? `<input
  //             id='fillblank-${question.idChildQuestion}-${
  //               question?.listQuestionChildren[index]?.idChildQuestion
  //             }'
  //             disabled
  //             type='text'
  //             value='${
  //               renderUserAnswer(
  //                 question?.listQuestionChildren[index]?.idChildQuestion,
  //               ) || ''
  //             }'
  //             oninput="this.style.width = '100px'; this.style.width = (this.scrollWidth + 2) + 'px';"
  //             style="width: 100px;"
  //             class="mx-2 px-1 bg-transparent border-b focus:outline-none border-[black] h-[28px] leading-[23px] ${
  //               checkUserAnswer(
  //                 question?.listQuestionChildren[index]?.idChildQuestion,
  //               )
  //                 ? 'text-ct-true'
  //                 : 'text-ct-fail'
  //             }"
  //             /> ${
  //               !checkUserAnswer(
  //                 question?.listQuestionChildren[index]?.idChildQuestion,
  //               )
  //                 ? `<span class="text-ct-fail">---></span>
  //             <input
  //             id='fillblank-default-${question.idChildQuestion}-${
  //                     question?.listQuestionChildren[index]?.idChildQuestion
  //                   }'
  //             disabled
  //             type='text'
  //             value='${correctAnswer}'
  //             oninput="this.style.width = '100px'; this.style.width = (this.scrollWidth + 2) + 'px';"
  //             style="width: 100px;"
  //             class="mx-2 px-1 bg-transparent border-b focus:outline-none border-[black] h-[28px] leading-[23px] ${
  //               checkUserAnswer(
  //                 question?.listQuestionChildren[index]?.idChildQuestion,
  //               )
  //                 ? 'text-ct-true'
  //                 : 'text-ct-fail'
  //             }"
  //             />`
  //                 : ''
  //             }
            
  //           `
  //           : `<input
  //               id='fillblank-${question?.idChildQuestion}-${question?.listQuestionChildren[index]?.idChildQuestion}'
  //               type='text'
  //               autocomplete='off'
  //               spellcheck="false"
  //               oninput="this.style.width = '100px'; this.style.width = (this.scrollWidth + 2) + 'px';"
  //               style="width: 100px;"
  //               class="mx-2 text-black min-w-[100px] px-1 bg-transparent border-b focus:outline-none border-[black] h-[28px] leading-[23px]"
  //               />`
  //       }
  //     </span>
  //     `,
  //     );
  //     indexInputFill++;
  //   });
  //   setContent(contentQuestion);
  // }, [question, listDataResult, type]);

  useEffect(() => {
    let indexInputFill = indexFillQues;
    let contentQuestion = `${question.text}`;
    const regex = /___/gi;
    let result;
    const indices: number[] = [];
    while ((result = regex.exec(question.text))) {
      indices.push(result.index);
    }
  
    indices?.map((item: any, index: any) => {
      let correctAnswer = '';
      if (type === 'answer-detail') {
        correctAnswer =
          question?.listQuestionChildren[index]?.listShortAnswer &&
          Object.keys(question?.listQuestionChildren[index]?.listShortAnswer)
            .length > 0
            ? question?.listQuestionChildren[index]?.listShortAnswer?.listKeyword
              ? question?.listQuestionChildren[index]?.listShortAnswer
                  ?.listKeyword[0]
              : ''
            : '';
      }
  
      contentQuestion = contentQuestion.replace(
        '___',
        `
        <span class='items-center'>
          ${
            !pathname.includes('exercise')
              ? `<span
                  class="relative select-none bg-ct-secondary-100 w-8 h-8 inline-flex justify-center items-center rounded-full text-sm text-ct-secondary-500"
                  id="question-${indexInputFill + 1}"
                >
                  ${indexInputFill + 1}
                </span>`
              : ''
          }
          ${
            type === 'answer-detail'
              ? `<div class="relative inline-block ${checkUserAnswer(question?.listQuestionChildren[index]?.idChildQuestion) ? 'fillblank-container' : ''}" data-input-id="fillblank-${question?.idChildQuestion || question?.idQuestion || 'unknown'}-${
                  question?.listQuestionChildren[index]?.idChildQuestion || 'unknown'
                }" ${checkUserAnswer(question?.listQuestionChildren[index]?.idChildQuestion) ? 'onmouseenter="this.querySelector(\'input\').style.backgroundColor=\'#f0f0f0\'" onmouseleave="this.querySelector(\'input\').style.backgroundColor=\'transparent\'" onclick="window.showFillblankDropdown && window.showFillblankDropdown(\'fillblank-${question?.idChildQuestion || question?.idQuestion || \'unknown\'}-${question?.listQuestionChildren[index]?.idChildQuestion || \'unknown\'}\', ${JSON.stringify(question?.listQuestionChildren[index]?.listShortAnswer?.listKeyword || [])})" style="cursor: pointer;"' : ''}>
                  <input
                    id='fillblank-${question?.idChildQuestion || question?.idQuestion || 'unknown'}-${
                      question?.listQuestionChildren[index]?.idChildQuestion || 'unknown'
                    }'
                    disabled
                    type='text'
                    value="${(renderUserAnswer(
                        question?.listQuestionChildren[index]?.idChildQuestion,
                      ) || '').replace(/'/g, '&#39;')}"
                    style="width: 120px; max-width: 100px; min-width: 100px; pointer-events: none;"
                    class="mx-2 px-1 bg-transparent border-b focus:outline-none border-[black] h-[28px] leading-[23px] truncate ${
                      checkUserAnswer(
                        question?.listQuestionChildren[index]?.idChildQuestion,
                      )
                        ? 'text-ct-true'
                        : 'text-ct-fail'
                    }"
                  />
                </div>
                ${
                  !checkUserAnswer(
                    question?.listQuestionChildren[index]?.idChildQuestion,
                  )
                    ? `<span class="text-ct-fail">---></span>
                      <div class="relative inline-block fillblank-container" data-input-id="fillblank-default-${question?.idChildQuestion || question?.idQuestion || 'unknown'}-${question?.listQuestionChildren[index]?.idChildQuestion || 'unknown'}" onmouseenter="this.querySelector('input').style.backgroundColor='#f0f0f0'" onmouseleave="this.querySelector('input').style.backgroundColor='transparent'" onclick="window.showFillblankDropdown && window.showFillblankDropdown('fillblank-default-${question?.idChildQuestion || question?.idQuestion || 'unknown'}-${question?.listQuestionChildren[index]?.idChildQuestion || 'unknown'}', ${JSON.stringify(question?.listQuestionChildren[index]?.listShortAnswer?.listKeyword || [])})" style="cursor: pointer;">
                        <input
                        id='fillblank-default-${question?.idChildQuestion || question?.idQuestion || 'unknown'}-${question?.listQuestionChildren[index]?.idChildQuestion || 'unknown'}'
                        disabled
                        type='text'
                        value="${correctAnswer.replace(/'/g, '&#39;')}"
                        oninput="this.style.width = '100px'; this.style.width = (this.scrollWidth + 2) + 'px';"
                        style="width: 100px; pointer-events: none;"
                        class="mx-2 px-1 bg-transparent border-b focus:outline-none border-[black] h-[28px] leading-[23px] !text-ct-true"
                        />
                      </div>`
                    : ''
                }
              `
              : `<input
                  id='fillblank-${question?.idChildQuestion || question?.idQuestion || 'unknown'}-${question?.listQuestionChildren[index]?.idChildQuestion}'
                  type='text'
                  autocomplete='off'
                  spellcheck="false"
                  style="width: 120px; max-width: 100px; min-width: 100px;"
                  class="mx-2 text-black px-1 bg-transparent border-b focus:outline-none border-[black] h-[28px] leading-[23px] truncate"
                />`
          }
        </span>
        `,
      );
      indexInputFill++;
    });
  
    setContent(contentQuestion);
  }, [question, listDataResult, type]);

  useEffect(() => {
    const index = listUserAnswerState.findIndex(
      (i: any) => i.idQuestion === data[page - 1].idQuestion,
    );
    if (index !== -1) {
      if (data[page - 1].quiz_type == 6) {
        const indexQues = listUserAnswerState[index]?.answer?.findIndex(
          (i: any) => i.idChildQuestion === question.idChildQuestion,
        );
        if (indexQues !== -1) {
          const questionId = question?.idChildQuestion || question?.idQuestion || 'unknown';
          listUserAnswerState[index]?.answer[indexQues].answer.map(
            (item: any) => {
              if (item.answer !== '') {
                const element = document.getElementById(
                  `fillblank-${questionId}-${item.idChildQuestion}`,
                ) as any;

                if (element !== null) {
                  element.value = item.answer;
                  autoResize(element);
                }
              }
            },
          );
        }
      } else {
        const questionId = question?.idChildQuestion || question?.idQuestion || 'unknown';
        listUserAnswerState[index]?.answer.map((item: any) => {
          if (item.answer !== '') {
            const element = document.getElementById(
              `fillblank-${questionId}-${item.idChildQuestion}`,
            ) as any;

            if (element !== null) {
              element.value = item.answer;
              autoResize(element);
            }
          }
        });
      }
    }

    for (let i = 0; i < question?.listQuestionChildren?.length; i++) {
      const questionId =
        question?.idChildQuestion || question?.idQuestion || 'unknown';
      const childQuestionId =
        question.listQuestionChildren[i].idChildQuestion || 'unknown';
      
      const ele = document.getElementById(
        `fillblank-${questionId}-${childQuestionId}`,
      ) as HTMLInputElement;
      ele?.addEventListener('drop', (e: any) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }
  }, [content, listUserAnswerState]);

  useEffect(() => {
    if (content === '') return;
    for (let i = 0; i < question?.listQuestionChildren?.length; i++) {
      const questionId =
        question?.idChildQuestion || question?.idQuestion || 'unknown';
      const childQuestionId =
        question.listQuestionChildren[i].idChildQuestion || 'unknown';
      
      const ele = document.getElementById(
        `fillblank-${questionId}-${childQuestionId}`,
      ) as HTMLInputElement;
      autoResize(ele);
      const eleDefault = document.getElementById(
        `fillblank-default-${questionId}-${childQuestionId}`,
      ) as HTMLInputElement;
      autoResize(eleDefault);

      // Thêm sự kiện cho fillblank-default và fillblank (nếu checkUserAnswer = true)
      const listKeyword =
        question?.listQuestionChildren[i]?.listShortAnswer?.listKeyword;
      if (type === 'answer-detail') {
        setTimeout(() => {
          const questionId = question?.idChildQuestion || question?.idQuestion || 'unknown';
          const childQuestionId = question.listQuestionChildren[i].idChildQuestion || 'unknown';
          
          // Thêm sự kiện cho input thứ hai (fillblank-default)
          addInputEvents(
            `fillblank-default-${questionId}-${childQuestionId}`,
            listKeyword,
          );
          
          // Thêm sự kiện cho input đầu tiên (fillblank) nếu checkUserAnswer = true
          if (checkUserAnswer(question.listQuestionChildren[i].idChildQuestion)) {
            addInputEvents(
              `fillblank-${questionId}-${childQuestionId}`,
              listKeyword,
            );
          }
        }, 100);
      }
    }
  }, [content, question, page, type, listDataResult]);

  useEffect(() => {
    if (dataFillState.length > 0) {
      saveQuestion();
    }
  }, [dataFillState]);

  return (
    <div className={`mt-4`}>
      {question?.description && (
        <p className="question-desc">
          <MathJaxRender math={`${question?.description}`} />
        </p>
      )}
      <div className="question-table">
        <div className="flex item-center text-start" onInput={changeAnswerFill}>
          {pathname.includes('exercise') ? (
            <span className=" bg-ct-secondary-100 w-6 h-6 inline-flex flex-shrink-0 justify-center items-center rounded-full text-sm text-ct-secondary-500 mt-1 mr-2">
              {getIndexQuestion2(data, page, question.idChildQuestion)}
            </span>
          ) : (
            ''
          )}
          <MathJaxRender math={`${content}`} />
        </div>
      </div>
      <div className="mt-0">
        {question?.image && (
          <img
            className="mt-4 w-fit h-fit object-cover max-w-lg max-h-[512px]"
            src={question?.image}
            alt=""
          />
        )}
        {question?.audio && (
          <audio className="mt-4" src={question?.audio} controls></audio>
        )}
        {question?.video && (
          <video className="mt-4" src={question?.video} controls></video>
        )}
      </div>

      {type === 'answer-detail' && question?.solution && (
        <div>
          <Divider className="border-ct-neutral-300" my="sm" />
          {/* {question.listQuestionChildren.map((item: any, index: any) => (
            <div
              key={item.idChildQuestion}
              className={`flex items-center mt-2 ${
                checkUserAnswer(
                  question?.listQuestionChildren[index]?.idChildQuestion,
                ) && 'hidden'
              }`}
            >
              <span className="bg-ct-secondary-100 w-8 h-8 inline-flex justify-center items-center rounded-full text-sm text-ct-secondary-500">
                {indexFillQues + index + 1}{' '}
              </span>
              <p className="block ml-2">
                Answer:{' '}
                <span className="text-ct-true">
                  {Object.keys(
                    question?.listQuestionChildren[index]?.listShortAnswer,
                  ).length > 0
                    ? question?.listQuestionChildren[index]?.listShortAnswer
                        ?.listKeyword[0]
                    : ''}
                </span>
              </p>
            </div>
          ))} */}
          <div className="bg-white mt-2 sm:mt-3 rounded-2xl px-[6px] sm:px-3 py-2 sm:py-[10px]">
            <span className="text-ct-primary-400">Explain</span>
            <p
              dangerouslySetInnerHTML={{
                __html: question.solution || 'no data',
              }}
            ></p>
          </div>
        </div>
      )}

      {/* DropdownBox component */}
      <DropdownBox />
    </div>
  );
};

export default FillBlank;
