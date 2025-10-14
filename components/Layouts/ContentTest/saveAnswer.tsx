import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
// import { resetAnswerChange } from '../store';

function SaveAnswer() {
  const dispatch = useDispatch();
  // const answer_change = useSelector(state => state.answer_change, shallowEqual);
  // const exam = useSelector(state => state.exam, shallowEqual);

  // useEffect(() => {
  //   if (answer_change && answer_change.length === 5) {
  //     axios.post('/api/v1/exam/save', {
  //       idHistory: exam.idHistory,
  //       listUserAnswer: answer_change,
  //     });
  //     dispatch(resetAnswerChange());
  //   }
  // }, [answer_change]);

  return null;
}

export default SaveAnswer;
