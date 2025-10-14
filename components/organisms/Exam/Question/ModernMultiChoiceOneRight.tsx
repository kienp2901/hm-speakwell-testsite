import MathJaxRender from '@/components/sharedV2/MathJax';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { postExamPartSave } from '@/service/api/examConfig';
import { CursorCustom, FontSize, ListUserAnswer } from '@/store/selector';
import { setListUserAnswer } from '@/store/slice/examInfo';
import {
  getCursorClass,
  getFontSize,
  getIndexQuestion,
  getListUserAnswer,
} from '@/utils';

interface ModernMultiChoiceOneRightProps {
  question: any;
  indexQuestion: number;
  type?: string;
  data: any;
  page: number;
  listDataResult?: any;
  idHistoryRound?: string | null;
  contestType: number
}

const ModernMultiChoiceOneRight = ({
  question,
  indexQuestion,
  type,
  data,
  page,
  listDataResult,
  idHistoryRound,
  contestType
}: ModernMultiChoiceOneRightProps) => {
  const fontSize = useSelector(FontSize, shallowEqual) || 16;
  const cursorCustom = useSelector(CursorCustom, shallowEqual) || 0;
  const listUserAnswerState = useSelector(ListUserAnswer, shallowEqual);
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>('');

  const indexFillQues = useMemo(() => {
    return getIndexQuestion(data, indexQuestion, page);
  }, [data]);

  const handleChange = async (selectedValue: string) => {
    setValue(selectedValue);
    const listUserAnswer = getListUserAnswer(
      listUserAnswerState,
      data,
      page,
      question,
      [Number(selectedValue)],
    );
    dispatch(setListUserAnswer(listUserAnswer));

    const response = await postExamPartSave({
      contest_type: contestType,
      idHistory: idHistoryRound,
      listUserAnswer: [...listUserAnswer],
    });
  };

  const checkUserAnswer = (item: any) => {
    if (type === 'answer-detail') {
      const index = listDataResult.findIndex(
        (i: any) => i.idChildQuestion === question?.idChildQuestion,
      );
      if (index === -1) {
        return false;
      } else {
        if (listDataResult[index].answer[0] === item.answer_id) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  useEffect(() => {
    const index = listUserAnswerState.findIndex(
      (i: any) => i.idQuestion === data[page - 1].idQuestion,
    );
    if (index !== -1) {
      const indexQues = listUserAnswerState[index]?.answer?.findIndex(
        (i: any) => i.idChildQuestion === question.idChildQuestion,
      );
      if (indexQues !== -1) {
        setValue(`${listUserAnswerState[index]?.answer[indexQues].answer[0]}`);
      }
    }
  }, [question, listUserAnswerState]);

  const getOptionLabel = (index: number) => {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return labels[index] || '';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Question Header with Number and Description */}
      <div className="flex items-start space-x-4 mb-6">
        <div
          className="bg-ct-secondary-100 w-10 h-10 flex justify-center items-center rounded-full text-ct-secondary-400 font-semibold select-none"
          id={`question-${indexFillQues + 1}`}
        >
          {indexFillQues + 1}
        </div>
        <div className="flex-1">
          {question?.description && (
            <div className="text-gray-600 mb-2">
              <MathJaxRender math={`${question?.description}`} />
            </div>
          )}
          <div className="text-gray-800 font-medium">
            <MathJaxRender
              math={`${question?.text?.replaceAll('&nbsp;', ' ')}`}
            />
          </div>
        </div>
      </div>

      {/* Question Media (Image/Audio/Video) */}
      {(question?.image || question?.audio || question?.video) && (
        <div className="mb-6">
          {question?.image && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img
                className="w-full h-auto object-cover max-h-[512px]"
                src={question?.image}
                alt="Question illustration"
              />
            </div>
          )}
          {question?.audio && (
            <div className="mt-4">
              <audio className="w-full" src={question?.audio} controls></audio>
            </div>
          )}
          {question?.video && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <video className="w-full" src={question?.video} controls></video>
            </div>
          )}
        </div>
      )}

      {/* Answer Options */}
      <div className="space-y-3">
        {type === 'answer-detail' ? (
          <>
            {question.listSelectOptions.map((item: any, index: any) => (
              <div
                key={index}
                className={`flex items-start p-4 rounded-lg transition-all cursor-pointer select-none ${
                  item.is_true
                    ? 'bg-green-50 border-2 border-green-500'
                    : checkUserAnswer(item)
                    ? 'bg-red-50 border-2 border-red-500'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 font-semibold ${
                    item.is_true
                      ? 'bg-green-100 text-green-700'
                      : checkUserAnswer(item)
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {getOptionLabel(index)}
                </div>
                <div
                  className={`flex-1 ${getFontSize(fontSize)} ${getCursorClass(
                    cursorCustom,
                  )} ${
                    item.is_true
                      ? 'text-green-700'
                      : checkUserAnswer(item)
                      ? 'text-red-700'
                      : 'text-gray-700'
                  }`}
                >
                  <MathJaxRender math={`${item?.answer_content}`} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {question.listSelectOptions.map((item: any, index: any) => (
              <div
                key={index}
                onClick={() => handleChange(`${item.answer_id}`)}
                className={`flex items-start p-4 rounded-lg transition-all cursor-pointer select-none hover:bg-blue-50 ${
                  value === `${item.answer_id}`
                    ? 'bg-blue-50 border border-blue-500'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 font-semibold ${
                    value === `${item.answer_id}`
                      ? 'bg-[#D7F0FF] text-ct-primary-400'
                      : 'bg-[#F2F2F2] text-[#000]'
                  }`}
                >
                  {getOptionLabel(index)}
                </div>
                <div
                  className={`flex-1 ${getFontSize(fontSize)} ${getCursorClass(
                    cursorCustom,
                  )} ${
                    value === `${item.answer_id}`
                      ? 'text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  <MathJaxRender math={`${item?.answer_content}`} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Solution/Explanation Section */}
      {type === 'answer-detail' && question.solution && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-blue-600 font-medium mb-2">Explanation</div>
          <div
            className="text-gray-700 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: question.solution }}
          />
        </div>
      )}
    </div>
  );
};

export default ModernMultiChoiceOneRight; 