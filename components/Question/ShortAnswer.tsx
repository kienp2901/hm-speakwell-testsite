import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { examSaveApi } from '@/service/api/contest';
import { IdHistory, ListUserAnswer, StudentId } from '@/store/selector';
import { setListUserAnswer, setListUserAnswerDraft } from '@/store/slice/examInfo';
import { QuestionData } from '@/types/question';

interface ShortAnswerProps {
  dataQuestion: QuestionData;
  idQuestion: string | number;
}

const ShortAnswer: React.FC<ShortAnswerProps> = ({ dataQuestion, idQuestion }) => {
  const dispatch = useAppDispatch();
  // listUserAnswer store
  const listUserAnswer = useAppSelector(ListUserAnswer, shallowEqual);

  const [content, setContent] = useState('');

  const changeAnswerShort = async () => {
    const inputEle = document.getElementById(
      `shortAnswer-${dataQuestion?.idChildQuestion}`,
    ) as HTMLInputElement | null;
    
    if (!inputEle) return;
    
    let listUserAnswerTemp = [...listUserAnswer];
    const indexUserAnswer = listUserAnswer.findIndex(
      (item) => item.idQuestion === idQuestion,
    );
    if (indexUserAnswer === -1) {
      listUserAnswerTemp.push({
        idQuestion: idQuestion,
        quiz_type: dataQuestion?.quiz_type,
        answer: [
          {
            idChildQuestion: dataQuestion.idChildQuestion,
            answer: inputEle.value,
          },
        ],
      });
    } else {
      let listUserAnswerChild = [...listUserAnswer[indexUserAnswer].answer];
      const indexUserAnswerChild = listUserAnswer[
        indexUserAnswer
      ].answer.findIndex(
        (item: any) => item.idChildQuestion === dataQuestion.idChildQuestion,
      );
      if (indexUserAnswerChild === -1) {
        listUserAnswerChild.push({
          idChildQuestion: dataQuestion.idChildQuestion,
          answer: inputEle.value,
        });
      } else {
        listUserAnswerChild.splice(indexUserAnswerChild, 1, {
          idChildQuestion: dataQuestion.idChildQuestion,
          answer: inputEle.value,
        });
      }
      listUserAnswerTemp.splice(indexUserAnswer, 1, {
        idQuestion: idQuestion,
        quiz_type: dataQuestion?.quiz_type,
        answer: [...listUserAnswerChild],
      });
    }

    dispatch(setListUserAnswerDraft(listUserAnswerTemp));
    dispatch(setListUserAnswer(listUserAnswerTemp));
  };

  useEffect(() => {
    let contentQuestion = `${dataQuestion?.text}`;
    const regex = /___/gi;
    let result;
    const indices: number[] = [];
    while ((result = regex.exec(dataQuestion?.text || ''))) {
      indices.push(result.index);
    }
    indices?.map((item, index) => {
      contentQuestion = contentQuestion.replace(
        '___',
        `<input
        id='shortAnswer-${dataQuestion?.idChildQuestion}'
        type='text'
        autocomplete='off'
        spellcheck="false"
        class="input-shortAnswer w-1/2 min-w-[15rem] max-w-[28rem] mx-2 px-2 bg-[#E9F5FC] h-12 rounded-lg focus:outline-none"
      />`,
      );
    });
    setContent(contentQuestion);
  }, []);

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
        if (indexUserAnswerChild !== -1) {
          const inputEle = document.getElementById(
            `shortAnswer-${dataQuestion?.idChildQuestion}`,
          ) as HTMLInputElement | null;
          if (inputEle) {
            inputEle.value =
              listUserAnswer[indexUserAnswer].answer[
                indexUserAnswerChild
              ].answer;
          }
        }
      }
    }
  }, [content, listUserAnswer]);

  useEffect(() => {
    if (content !== '') {
      const listInputEle = document.querySelectorAll('.input-shortAnswer');
      Array.from(listInputEle).forEach((item: any) => {
        item?.parentElement?.classList.add('input-shortAnswer-parent');
      });
    }
  }, [content]);

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
    <div className=''>
      <div
        className="p-6 border-2 rounded-3xl border-support_Blue mb-6"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        onInput={changeAnswerShort}
      ></div>
    </div>
  );
};

export default ShortAnswer;

