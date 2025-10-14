import React, { ReactElement, CSSProperties } from 'react';
import { useDrop } from 'react-dnd';
import styles from '../../styles/Droppable.module.css';

interface DroppableProps {
  accept: string | string[];
  handleDrop: (item: any, monitor: any, state: any, idQuest?: any) => void;
  text?: string;
  children: ReactElement;
  state?: any; // TODO: refine type
  big?: boolean;
  style?: CSSProperties;
  idQuest?: any; // TODO: refine type
  answer_child?: boolean;
  isQuestion?: boolean;
}

function Droppable({ 
  accept, 
  handleDrop, 
  text, 
  children, 
  state, 
  big, 
  style, 
  idQuest, 
  answer_child, 
  isQuestion 
}: DroppableProps) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept,
      drop: (item, monitor) => handleDrop(item, monitor, state, idQuest),
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [state] // Dependency
  );
  const isActive = isOver && canDrop;

  return (
    <div
      className={`${isQuestion ? styles.droppable : styles.droppableAnswer} ${children.props.children.length == 0 ? '!pt-[6px]' : ''} ${isActive ? styles.over : ''} ${
        !isActive && canDrop ? styles.can : ''
      } ${big ? styles.big : ''} ${answer_child ? styles.answer_dropable : ''}`}
      style={style}
      ref={drop}
    >
      {children}
    </div>
  );
}

export default Droppable;

