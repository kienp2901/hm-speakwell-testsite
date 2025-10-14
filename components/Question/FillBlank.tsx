import Image from '@/components/shared/Image';
import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ListUserAnswer } from '@/store/selector';
import {
  setListUserAnswer,
  setListUserAnswerDraft,
} from '@/store/slice/examInfo';

interface FillBlankProps {
  dataQuestion: any;
  idQuestion: string | number;
  isCustom?: boolean;
  quizType?: number;
  part?: number;
}

const FillBlank: React.FC<FillBlankProps> = ({ dataQuestion, idQuestion, isCustom, quizType, part }) => {
  const dispatch = useAppDispatch();
  const listUserAnswer = useAppSelector(ListUserAnswer, shallowEqual);

  const [content, setContent] = useState('');
  const [indexForcus, setIndexForcus] = useState(0);

  const changeAnswerFill = async () => {
    let listUserAnswerTemp = [...listUserAnswer];
    const indexUserAnswer = listUserAnswer.findIndex(
      (item) => item.idQuestion === idQuestion,
    );
    const dataFill: any[] = [];
    for (let i = 0; i < dataQuestion?.listQuestionChildren.length; i++) {
      const ele = document.getElementById(
        `fillblank-${idQuestion}-${dataQuestion?.idChildQuestion ?? ''}-${i}`,
      ) as HTMLInputElement | null;
      let item = null;
      if (ele != null && ele.value != '') {
        item = {
          idChildQuestion:
            dataQuestion?.listQuestionChildren[i].idChildQuestion,
          answer: `${ele?.value}`,
          weight: 1,
        };
        dataFill.push(item);
      }
    }
    if (indexUserAnswer === -1) {
      if (quizType == 6) {
        listUserAnswerTemp.push({
          idQuestion: idQuestion,
          answer: [
            {
              idChildQuestion: dataQuestion.idChildQuestion,
              answer: [...dataFill],
            },
          ],
        });
      } else {
        listUserAnswerTemp.push({
          idQuestion: idQuestion,
          answer: [...dataFill],
        });
      }
    } else {
      if (quizType == 6) {
        let listUserAnswerChild = [...listUserAnswer[indexUserAnswer].answer];
        const indexUserAnswerChild = listUserAnswer[
          indexUserAnswer
        ].answer.findIndex(
          (item: any) => item.idChildQuestion === dataQuestion.idChildQuestion,
        );
        if (indexUserAnswerChild === -1) {
          listUserAnswerChild.push({
            idChildQuestion: dataQuestion.idChildQuestion,
            answer: [...dataFill],
          });
        } else {
          listUserAnswerChild.splice(indexUserAnswerChild, 1, {
            idChildQuestion: dataQuestion.idChildQuestion,
            answer: [...dataFill],
          });
        }
        listUserAnswerTemp.splice(indexUserAnswer, 1, {
          idQuestion: idQuestion,
          quiz_type: dataQuestion?.quiz_type,
          answer: [...listUserAnswerChild],
        });
      } else {
        let listUserAnswerChild = [...listUserAnswer[indexUserAnswer].answer];
        const indexUserAnswerChild = listUserAnswer[
          indexUserAnswer
        ].answer.findIndex(
          (item: any) => item.idChildQuestion === dataQuestion.idChildQuestion,
        );
        if (indexUserAnswerChild === -1) {
          listUserAnswerTemp.splice(indexUserAnswer, 1, {
            idQuestion: idQuestion,
            quiz_type: dataQuestion?.quiz_type,
            answer: [...dataFill],
          });
        } else {
          listUserAnswerChild.splice(indexUserAnswerChild, 1, {
            idChildQuestion: dataQuestion.idChildQuestion,
            answer: [...dataFill],
          });
          listUserAnswerTemp.splice(indexUserAnswer, 1, {
            idQuestion: idQuestion,
            quiz_type: dataQuestion?.quiz_type,
            answer: [...listUserAnswerChild],
          });
        }
      }
    }

    dispatch(setListUserAnswerDraft(listUserAnswerTemp));
    dispatch(setListUserAnswer(listUserAnswerTemp));
  };

  useEffect(() => {
    let contentQuestion = `${dataQuestion?.text}`;
    const regex = /___/gi;
    let result;
    const indices: number[] = [];
    while ((result = regex.exec(dataQuestion?.text))) {
      indices.push(result.index);
    }
    indices?.map((item, index) => {
      contentQuestion = contentQuestion.replace(
        '___',
        `<input
          id='fillblank-${idQuestion}-${
          dataQuestion?.idChildQuestion ?? ''
        }-${index}'
          type='text'
          maxLength="${isCustom ? 1 : null}"
          autocomplete='off'
          list='autocompleteOff'
          spellcheck="false"
          class="input-fillblank ${isCustom ? `text-center` : ''} ${
          indices?.length > 1 ? `w-[50px]` : part == 2 ? `w-4/5` : `w-2/5`
        } max-w-[28rem] mx-2 px-2 bg-[#E9F5FC] h-12 rounded-lg focus:outline-none"
        />`,
      );
    });
    setContent(contentQuestion);
  }, [dataQuestion]);

  // fill answer đã làm
  useEffect(() => {
    if (content !== '' && listUserAnswer.length > 0) {
      const indexUserAnswer = listUserAnswer.findIndex(
        (item) => item.idQuestion === idQuestion,
      );
      if (indexUserAnswer !== -1) {
        const indexUserAnswerChild = listUserAnswer[
          indexUserAnswer
        ].answer.findIndex(
          (item: any) => item.idChildQuestion === dataQuestion.idChildQuestion,
        );
        if (quizType == 6) {
          if (indexUserAnswerChild !== -1) {
            for (
              let i = 0;
              i < dataQuestion?.listQuestionChildren.length;
              i++
            ) {
              const inputEle = document.getElementById(
                `fillblank-${idQuestion}-${
                  dataQuestion?.idChildQuestion ?? ''
                }-${i}`,
              ) as HTMLInputElement | null;
              if (inputEle) {
                inputEle.value =
                  listUserAnswer[indexUserAnswer].answer[
                    indexUserAnswerChild
                  ].answer[i].answer;
              }
            }
          }
        } else {
          for (let i = 0; i < dataQuestion?.listQuestionChildren.length; i++) {
            const ele = document.getElementById(
              `fillblank-${idQuestion}-${
                dataQuestion?.idChildQuestion ?? ''
              }-${i}`,
            ) as HTMLInputElement | null;
            if (ele) {
              ele.value = listUserAnswer[indexUserAnswer].answer[i].answer;
            }
          }
        }
      }
    }
  }, [content]);

  useEffect(() => {
    if (isCustom) {
      document.onkeydown = (e: any) => {
        if (e.keyCode === 37) {
          //left
          let ele = document.getElementById(
            `fillblank-${idQuestion}-${dataQuestion?.idChildQuestion ?? ''}-${
              indexForcus - 1
            }`,
          ) as HTMLInputElement | null;
          if (ele) {
            ele.focus();
            setIndexForcus(indexForcus - 1);
          }
        } else if (e.keyCode == 39) {
          // right
          let ele = document.getElementById(
            `fillblank-${idQuestion}-${dataQuestion?.idChildQuestion ?? ''}-${
              indexForcus + 1
            }`,
          ) as HTMLInputElement | null;
          if (ele) {
            ele.focus();
            setIndexForcus(indexForcus + 1);
          }
        } else if ( e.keyCode == 8) {
          let ele = document.getElementById(
            `fillblank-${idQuestion}-${
              dataQuestion?.idChildQuestion ?? ''
            }-${indexForcus}`,
          ) as HTMLInputElement | null;
          if (ele?.value?.length == 1) {
            ele.value = '';
          } else {
            let elePrv = document.getElementById(
              `fillblank-${idQuestion}-${dataQuestion?.idChildQuestion ?? ''}-${
                indexForcus - 1
              }`,
            ) as HTMLInputElement | null;
            if (elePrv) {
              elePrv.value = '';
              elePrv.focus();
            }
          }
        }
      };
    }
  }, [indexForcus, isCustom]);

  useEffect(() => {
    if (isCustom) {
      const addListener = (input: any, index: number) => {
        input.addEventListener('focus', () => {
          setIndexForcus(index);
        });
        input.addEventListener('input', () => {
          if (input.value.length == 1) {
            const eleNext = document.getElementById(
              `fillblank-${idQuestion}-${dataQuestion?.idChildQuestion ?? ''}-${
                index + 1
              }`,
            ) as HTMLInputElement | null;
            if (eleNext) {
              eleNext.focus();
            }
          }
        });
      };
      
      for (let i = 0; i < dataQuestion?.listQuestionChildren.length; i++) {
        const ele = document.getElementById(
          `fillblank-${idQuestion}-${dataQuestion?.idChildQuestion ?? ''}-${i}`,
        );
        if (ele) addListener(ele, i);
      }
    }
  }, [isCustom, content]);

  useEffect(() => {
    const handleCopyPaste = (event: Event) => {
      event.preventDefault();
      console.log('Copying and pasting is disabled.');
    };

    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, []);

  return (
    <div className={`${isCustom ? 'h-full' : ''}`}>
      <div className="flex justify-center items-center w-full">
        {dataQuestion?.image && (
          <Image
            height={200}
            width={200}
            loader={() => dataQuestion?.image}
            src={dataQuestion?.image}
            alt="image_one_right_question"
          />
        )}
      </div>
      <div
        className="p-6 border-2 rounded-3xl border-support_Blue mb-6"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        onInput={changeAnswerFill}
      ></div>
    </div>
  );
};

export default FillBlank;
