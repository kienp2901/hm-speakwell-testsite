import { LoadingOverlay, Table as TableMantine } from '@mantine/core';
import { memo } from 'react';

type columns = {
  title: string | JSX.Element | any;
  centered?: boolean;
  size?: number;
  hidden?: boolean;
  sort?: boolean;
  showItem?: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowItem?: () => void | any;
  optionSort?: any[];
};
type data = {
  [key: string]: any;
};
interface TableProps {
  dataSource: { columns: columns[]; data: data[any] };
  // className?: string;
  // style?: CSSProperties;
  loading?: boolean;
  isDragable?: boolean;
  handleResultDrag?: any;
  isBorder?: boolean;
  heightRow?: number;
}

const Table = (props: TableProps) => {
  const { dataSource, loading, isBorder, heightRow } = props;
  const centerColumn: number[] = [];
  const hiddenColumnIndex: number[] = [];

  if (!dataSource.data || dataSource.data.length === 0) {
    return <p className="p-10 w-fit mx-auto">You have not taken any exams</p>;
  }

  return (
    <>
      <div className="w-full relative overflow-x-auto">
        {loading ? <LoadingOverlay visible={true} /> : ''}
        <TableMantine verticalSpacing="md" className="w-full overflow-x-auto">
          <thead
            className={`p-2 w-full mb-3 ${isBorder && 'divider-custom-th'}`}
          >
            <tr>
              {dataSource.columns.map((column: any, index: number) => {
                if (column.centered) {
                  centerColumn.push(index);
                }
                if (column.hidden) {
                  hiddenColumnIndex.push(index);
                }

                return (
                  <th
                    className={`p-0 ${index !== 0 ? 'thead' : ''}`}
                    key={index}
                    style={{
                      display: column.hidden ? 'none' : '',
                      width: `${column.size}` ? `${column.size}px` : '',
                      borderColor: '#7893B0',
                    }}
                  >
                    <div
                      className={`whitespace-nowrap flex justify-between items-center`}
                      style={{
                        width: `${column.size}` ? `${column.size}px` : '',
                        display: column.hidden ? 'none' : '',
                      }}
                    >
                      <div
                        className={`px-2 ${column.centered ? 'mx-auto' : ''}`}
                      >
                        {column.title}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="w-full">
            {dataSource.data.map((item: any, index: number) => (
              <tr key={index}>
                {Object.keys(item).map((key: string, index2) => {
                  const isCenter = centerColumn.includes(index2);
                  const isHidden = hiddenColumnIndex.includes(index2);
                  if (key !== 'centered' && !isHidden) {
                    return (
                      <td
                        className={`${index2 !== 0 ? 'thead' : ''}`}
                        key={index2}
                      >
                        <div
                          className={`item-border bg-ct-neutral-200 ${
                            isBorder && 'divider-custom'
                          }`}
                        >
                          <div
                            className={`px-4 py-1 w-full  h-full flex items-center flex-1 ${
                              isCenter
                                ? 'mx-auto text-center justify-center'
                                : ''
                            }`}
                            style={{
                              minHeight: `${heightRow || 56}px`,
                            }}
                          >
                            {item[key] || <>&nbsp;</>}
                          </div>
                        </div>
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </TableMantine>
      </div>
    </>
  );
};

export default memo(Table);
