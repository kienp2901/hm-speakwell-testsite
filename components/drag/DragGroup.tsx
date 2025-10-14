import React, { ReactNode } from 'react';
import styles from '../../styles/DragGroup.module.css';

interface DragGroupProps {
  children: ReactNode[] | ReactNode;
  answer?: boolean;
}

function DragGroup({ children, answer }: DragGroupProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  let check_empty = childrenArray.length == 0 ? 'min-w-[80px]' : '';
  
  return (
    <div className={`flex justify-center ${check_empty} flex-wrap ${styles.group} ${answer ? styles.drag_group_answer : ''}`}>
      {childrenArray.length == 0 ? (<>&nbsp;</>) : children}
    </div>
  );
}

export default DragGroup;

