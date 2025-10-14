import { memo, useEffect } from 'react';
import { validateData } from '@/ultils/configMathjax';
import { v4 as uuid } from 'uuid';

interface MathJaxRenderProps {
  math?: string;
  styletext?: string;
  className?: string;
}

const MathJaxRender: React.FC<MathJaxRenderProps> = ({ math, styletext, className }) => {
  const id = uuid();
  const v = validateData(math);

  useEffect(() => {
    if (window.MathJax) {
      const node = document.getElementById(`${id}`);
      if (typeof window.MathJax.typesetPromise === "function" && node) {
        window.MathJax.typesetPromise([node]);
      }
    }
  }, [id, math]);

  return (
    <div id={id} className={className}>
      <div
        dangerouslySetInnerHTML={{ __html: v || '' }}
        className={`${styletext || ''}`}
      ></div>
    </div>
  );
};

export default memo(MathJaxRender);

