import React, { useEffect, useState, ReactNode, CSSProperties } from 'react';
import { useDrag } from 'react-dnd';
import styles from '../../styles/Draggable.module.css';
import HtmlToReact from 'html-to-react';

interface DraggableProps {
  children?: ReactNode;
  type: string;
  item: any; // TODO: refine type
  text?: string;
  style?: CSSProperties;
  hideWhenDrag?: boolean;
  state?: any; // TODO: refine type
  check_answer?: string | boolean;
}

const Draggable: React.FC<DraggableProps> = ({
  children,
  type,
  item,
  text,
  style,
  hideWhenDrag,
  state,
  check_answer,
}) => {
  let check_answer_class = 'drag_right_anwser';
  if (check_answer) {
    if (check_answer == 'false') {
      check_answer_class = 'drag_wrong_anwser';
    }
  }

  const [loadContent, setLoadContent] = useState<string | JSX.Element | JSX.Element[]>('');

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [state],
  );

  useEffect(() => {
    if (!text) return;
    const htmlParser = new HtmlToReact.Parser();
    setLoadContent(htmlParser.parse(text));
  }, [text]);

  if (isDragging && hideWhenDrag) {
    return <div ref={drag}></div>;
  }

  return (
    <span
      className={`${check_answer ? check_answer_class : ''} ${
        styles.draggable
      } ${isDragging ? styles.dragging : ''}`}
      style={style}
      ref={drag}
    >
      <span className="text-[14px]">{loadContent}</span>
      {children}
    </span>
  );
};

export default Draggable;

