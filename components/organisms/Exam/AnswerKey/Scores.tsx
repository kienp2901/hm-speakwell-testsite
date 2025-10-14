import { Badge, RingProgress, Text } from '@mantine/core';
import { t } from 'i18next';

type ScoresProps = {
  mark: any;
  correctAnswer?: number;
  totalQuestion?: number;
};

const Scores = ({ mark, correctAnswer, totalQuestion }: ScoresProps) => {
  // const [answerTrue, setAnswerTrue] = useState(0);

  // useEffect(() => {
  //   let numberTrue = 0;
  //   Array.from(new Set(listDataQuestion)).map((item: any) => {
  //     listDataResult.map((i: any) => {
  //       if (i.idChildQuestion === item.idChildQuestion) {
  //         if (item.quiz_type === 2) {
  //           i.answer.map((it: any) => {
  //             const index = item?.listSelectOptions.findIndex(
  //               (id: any) => id.answer_id === it,
  //             );
  //             if (index !== -1) {
  //               if (item?.listSelectOptions[index].is_true) {
  //                 numberTrue = numberTrue + 1;
  //               }
  //             }
  //           });
  //         } else {
  //           if (i.isTrue) {
  //             numberTrue = numberTrue + 1;
  //           }
  //         }
  //       }
  //     });
  //   });
  //   setAnswerTrue(numberTrue);
  // }, [listDataResult, listDataQuestion]);

  return (
    <div className="flex sm:justify-center flex-col sm:flex-row mx-4 mt-10">
      <div className="h-[88px] flex items-center justify-between bg-white px-4 rounded-xl">
        <p className="text-2xl mr-6">{t('scores.correct_answers')}</p>
        <Badge
          size="xl"
          radius="lg"
          className="bg-ct-secondary-500 text-white text-xl py-6 px-4"
        >
          {correctAnswer}/{totalQuestion}
        </Badge>
      </div>
      <div className="h-[88px] flex items-center justify-between bg-white px-4 rounded-xl mt-4 sm:mt-0 sm:ml-6">
        <p className="text-2xl mr-6">{t('scores.ielts_score')}</p>
        <RingProgress
          size={72}
          thickness={8}
          roundCaps
          label={
            <Text
              size="xs"
              align="center"
              className="font-extrabold text-lg text-ct-primary-400"
            >
              {mark?.score}
            </Text>
          }
          sections={[
            {
              value: (mark?.score / mark?.score_max) * 100,
              color: '#0067C5',
            },
          ]}
          rootColor="#E2EBF3"
        />
      </div>
    </div>
  );
};

export default Scores;
