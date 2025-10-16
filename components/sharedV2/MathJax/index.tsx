import { memo, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

type Props = {
  math?: string | any;
  styletext?: string;
  className?: string;
};

const MathJaxRender = ({ math, styletext, className }: Props) => {
  const id = uuid();
  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      const node = document.getElementById(`${id}`);
      if (node) {
        window.MathJax.typesetPromise([node]);
      }
    }
  }, [math]);

  return (
    <div id={id} className={className}>
      {' '}
      <div
        dangerouslySetInnerHTML={{ __html: math }}
        className={`${styletext}`}
      ></div>
    </div>
  );
};

export default memo(MathJaxRender);
