import React from 'react';

const listBg = ['#ff7575', '#FFA775', '#FFEFB8', '#B0F390', '#55E87E'];

const Discussion = ({ score_ielts, teacher_review }: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="mt-6 w-full rating">
        <thead>
          <tr>
            <th rowSpan={2} className="w-2/12 rounded-tl-xl">
              Criterion
            </th>
            <th rowSpan={2} className="w-5/12">
              Comment
            </th>
            <th colSpan={5} className="rounded-tr-xl">
              Rating
            </th>
          </tr>
          <tr className="text-sm">
            <th className="w-1/12">Falling</th>
            <th className="w-1/12">Needs improvement</th>
            <th className="w-1/12">Satisfactory</th>
            <th className="w-1/12">Good</th>
            <th className="w-1/12">Very Good</th>
          </tr>
        </thead>

        {teacher_review?.reviews[0]?.criterions.map(
          (itemReview: any, index: number) => {
            return (
              <tbody key={`reviewChild_${index}`}>
                <td
                  rowSpan={10}
                  className="text-center"
                  dangerouslySetInnerHTML={{
                    __html: itemReview?.title,
                  }}
                ></td>
                {itemReview?.items.map((itemChild: any, indexChild: number) => {
                  return (
                    <tr key={`reviewChild_${indexChild}`}>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: itemChild?.title,
                        }}
                      ></td>
                      {listBg.map((itemBg, indexBg) => {
                        return (
                          <td
                            key={`check_${indexBg}`}
                            // className={`bg-[${itemBg}] !important`}
                            style={{ backgroundColor: itemBg }}
                          >
                            <div
                              className={`w-6 h-6 bg-white ${
                                itemChild?.score == indexBg + 1
                                  ? 'border-ct-primary-400 flex justify-center items-center'
                                  : 'border-ct-neutral-500'
                              } border rounded-full mx-auto`}
                            >
                              {itemChild?.score == indexBg + 1 && (
                                <div className="w-3 h-2 border-l-[3px] border-b-[3px] border-ct-primary-400 -rotate-45"></div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            );
          },
        )}
      </table>
      <table className="mt-6 w-full score">
        <thead>
          <tr className="text-sm">
            <th className="w-1/5 py-3 rounded-tl-2xl"></th>
            {teacher_review?.reviews[1]?.criterions[0]?.items?.map(
              (itemScore: any, index: number) => {
                return (
                  <th
                    className={`w-1/5 py-3 ${
                      index ==
                      teacher_review?.reviews[1]?.criterions[0]?.items?.length
                        ? 'rounded-tr-2xl'
                        : ''
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: itemScore?.title,
                    }}
                  ></th>
                );
              },
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Criterion score</td>
            {teacher_review?.reviews[1]?.criterions[0]?.items?.map(
              (itemScore: any, index: number) => {
                return (
                  <td key={`score_${index}`}>
                    <p className="bg-white h-full rounded text-base font-bold text-ct-primary-500 flex items-center justify-center">
                      {itemScore?.score}
                    </p>
                  </td>
                );
              },
            )}
          </tr>
          <tr>
            <td>Suggestions</td>
            {teacher_review?.reviews[1]?.criterions[0]?.items?.map(
              (itemScore: any, index: number) => {
                return (
                  <td key={`suggest_${index}`}>
                    <p className="bg-white h-full rounded p-2 text-left">
                      {itemScore?.suggestions}
                    </p>
                  </td>
                );
              },
            )}
          </tr>
          <tr>
            <td className="rounded-bl-2xl">Final score</td>
            <td colSpan={4} className="rounded-br-2xl">
              <p className="bg-white h-full rounded text-base font-bold text-ct-primary-500 inline-block px-20 py-[3px]">
                {score_ielts || 0}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Discussion);
