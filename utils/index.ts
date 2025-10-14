/* eslint-disable prefer-destructuring */
/* eslint-disable no-loop-func */
import { CursorType, TestType, questionEnumType } from 'enum';
import jwt_decode from 'jwt-decode';
import { setCursorCustom } from 'store/slice/examInfo';
import { isString } from 'lodash';

export interface decodeJWTType {
  email?: string;
  exp?: number;
  iat?: number;
  id?: string;
  type?: number;
}

export const decodeJWT = (token: string): any => {
  try {
    return jwt_decode(token);
  } catch (error) {
    return false;
  }
};

export const alphabet = (): string[] => {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map(x => String.fromCharCode(x));
  return alphabet;
};

export const formatTimeString = (dateISO: string) => {
  const dateConverted = new Date(dateISO);
  let hours = dateConverted.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursConvert = `0${dateConverted.getHours()}`.slice(-2);
  const minutes = `0${dateConverted.getMinutes()}`.slice(-2);
  const seconds = `0${dateConverted.getSeconds()}`.slice(-2);
  const date = `0${dateConverted.getDate()}`.slice(-2);
  const month = `0${dateConverted.getMonth() + 1}`.slice(-2);
  const year = dateConverted.getFullYear();
  const currentDay: number | string = dateConverted.getDay();
  const convertDay = (currentDay: number | string) => {
    switch (currentDay) {
      case 0:
        currentDay = 'Chủ nhật';
        break;
      case 1:
        currentDay = 'Thứ hai';
        break;
      case 2:
        currentDay = 'Thứ ba';
        break;
      case 3:
        currentDay = 'Thứ tư';
        break;
      case 4:
        currentDay = 'Thứ năm';
        break;
      case 5:
        currentDay = 'Thứ sáu';
        break;
      case 6:
        currentDay = 'Thứ bảy';
        break;
      default:
        break;
    }
    return currentDay;
  };
  const day = convertDay(currentDay);
  return {
    year,
    month,
    date,
    day,
    hours,
    ampm,
    minutes,
    seconds,
    hoursConvert,
  };
};
export const getDateFromNow = (day: number) => {
  const result = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
  const date = `0${result.getDate()}`.slice(-2);
  const month = `0${result.getMonth() + 1}`.slice(-2);
  const year = result.getFullYear();
  return `${year}-${month}-${date}`;
};

export const getTimeMoment = (dateISO: string) => {
  const dateConverted = new Date(dateISO);
  let hours = dateConverted.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = `0${dateConverted.getMinutes()}`.slice(-2);
  const seconds = `0${dateConverted.getSeconds()}`.slice(-2);
  const date = `0${dateConverted.getDate()}`.slice(-2);
  const month = `0${dateConverted.getMonth() + 1}`.slice(-2);
  const year = dateConverted.getFullYear();
  const currentDay: number | string = dateConverted.getDay();
  const convertDay = (currentDay: number | string) => {
    switch (currentDay) {
      case 1:
        currentDay = 'Thứ hai';
        break;
      case 2:
        currentDay = 'Thứ ba';
        break;
      case 3:
        currentDay = 'Thứ tư';
        break;
      case 4:
        currentDay = 'Thứ năm';
        break;
      case 5:
        currentDay = 'Thứ sáu';
        break;
      case 6:
        currentDay = 'Thứ bảy';
        break;
      case 7:
        currentDay = 'Chủ nhật';
        break;
      default:
        break;
    }
    return currentDay;
  };
  const day = convertDay(currentDay);
  return { year, month, date, day, hours, ampm, minutes, seconds };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateRoutePath = (
  url: string,
  params: any,
  pagination: any,
) => {
  let urlFormatted = url;
  if (urlFormatted[urlFormatted.length - 1] === '/') {
    urlFormatted = urlFormatted.slice(0, -1);
  }
  if (params && pagination) {
    const queryParams = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    const queryPagination = `limit=${pagination?.pageSize}&page=${pagination?.pageIndex}`;

    urlFormatted = `${urlFormatted}?${queryParams}&${queryPagination}`;
  } else if (params) {
    const queryParams = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    urlFormatted = `${urlFormatted}?${queryParams}`;
  } else if (pagination) {
    const queryPagination = `limit=${pagination?.pageSize}&page=${pagination?.pageIndex}`;
    urlFormatted = `${urlFormatted}?${queryPagination}`;
  }
  return urlFormatted;
};

export const slug = (str: string) => {
  // Đổi chữ hoa thành chữ thường
  str = str.toLowerCase();

  // Đổi ký tự có dấu thành không dấu
  str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  str = str.replace(/đ/gi, 'd');
  str = str.replace(/[^a-zA-Z ]/g, '');
  // Xóa các ký tự đặt biệt
  str = str.replace(
    // eslint-disable-next-line no-useless-escape
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    '',
  );
  // Đổi khoảng trắng thành ký tự gạch ngang
  str = str.replace(/ /gi, '-');
  // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/\-\-\-\-\-/gi, '-');
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/\-\-\-\-/gi, '-');
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/\-\-\-/gi, '-');
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/\-\-/gi, '-');
  // Xóa các ký tự gạch ngang ở đầu và cuối
  str = '@' + str + '@';
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/\@\-|\-\@|\@/gi, '');

  return str;
};

export const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export function stripHtml(html: string) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
export const convertObjToArrCustomKey = (arr: any) => {
  return arr.reduce((a: any, v: any) => ({ ...a, [v]: v }), {});
};

export const processListQuestion = (data: any) => {
  let count = 1;
  data?.map((q: any) => {
    if (q?.listQuestionChildren?.length === 0) {
      q.position = count;
      count++;
    } else {
      q.position = count + '-' + (count + q?.listQuestionChildren.length - 1);
      q?.listQuestionChildren?.map((cq: any) => {
        cq.position = count;
        count++;
      });
    }
  });
  return data;
};

export const getTimeCountdown = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  let minute = 0;
  let second = 0;
  if (hours > 0) {
    minute = Math.floor((seconds - 3600 * hours) / 60);
  } else {
    minute = Math.floor(seconds / 60);
  }
  second = seconds - 3600 * hours - minute * 60;

  return `${hours > 9 ? hours : hours > 0 ? `0${hours}` : ''}${
    hours > 0 ? ':' : ''
  }${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`;
};

export const getIndexQuestion = (data: any, indexQuestion: any, page: any) => {
  let indexFill = 0;
  if (data?.length > 0) {
    if (indexQuestion !== 0 && page === 1) {
      for (let i = 0; i < indexQuestion; i++) {
        const indexQues =
          data[0]?.listQuestionChildren[i]?.quiz_type ===
          questionEnumType.ONE_RIGHT
            ? 1
            : data[0]?.listQuestionChildren[i]?.quiz_type ===
              questionEnumType.MULTIPLE_RIGHT
            ? data[0]?.listQuestionChildren[i]?.maxAnswerChoice || 1
            : data[0]?.listQuestionChildren[i]?.listQuestionChildren?.length;
        indexFill = indexFill + indexQues;
      }
    } else if (page > 1) {
      if (indexQuestion === 0) {
        for (let i = 0; i < page - 1; i++) {
          data[i]?.listQuestionChildren.map((item: any) => {
            const indexQues =
              item?.quiz_type === questionEnumType.ONE_RIGHT
                ? 1
                : item?.quiz_type === questionEnumType.MULTIPLE_RIGHT
                ? item?.maxAnswerChoice || 1
                : item?.listQuestionChildren?.length;
            indexFill = indexFill + indexQues;
          });
        }
      } else {
        for (let i = 0; i < page - 1; i++) {
          data[i]?.listQuestionChildren.map((item: any) => {
            const indexQues =
              item?.quiz_type === questionEnumType.ONE_RIGHT
                ? 1
                : item?.quiz_type === questionEnumType.MULTIPLE_RIGHT
                ? item?.maxAnswerChoice || 1
                : item?.listQuestionChildren?.length;
            indexFill = indexFill + indexQues;
          });
        }
        for (let i = 0; i < indexQuestion; i++) {
          const indexQues =
            data[page - 1]?.listQuestionChildren[i]?.quiz_type ===
            questionEnumType.ONE_RIGHT
              ? 1
              : data[page - 1]?.listQuestionChildren[i]?.quiz_type ===
                questionEnumType.MULTIPLE_RIGHT
              ? data[page - 1]?.listQuestionChildren[i]?.maxAnswerChoice || 1
              : data[page - 1]?.listQuestionChildren[i]?.listQuestionChildren
                  ?.length;
          indexFill = indexFill + indexQues;
        }
      }
    }
  }

  return indexFill;
};

export const getIndexQuestion2 = (
  listQuestion: any,
  page: number,
  idQuestion?: number,
) => {
  let indexQues = 0;
  let str = '';
  for (let i = 0; i < page; i++) {
    if (i < page) {
      if (listQuestion[i]?.quiz_type === questionEnumType.READING) {
        indexQues = indexQues + listQuestion[i]?.listQuestionChildren?.length;
      } else {
        indexQues = indexQues + 1;
      }
    } else {
    }
  }
  return indexQues;
};

export const getListUserAnswer = (
  listUserAnswerState: any,
  data: any,
  page: any,
  question: any,
  dataFill: any,
) => {
  let listAnswerArr = listUserAnswerState || [];
  let listUserAnswer: any[] = [...listAnswerArr];
  const index: any = listUserAnswer.findIndex(
    (i: any) => i.idQuestion === data[page - 1].idQuestion,
  );
  if (index === -1) {
    if (data[page - 1].quiz_type === questionEnumType.READING) {
      listUserAnswer.push({
        idQuestion: data[page - 1].idQuestion,
        quizType: data[page - 1].quiz_type,
        answer: [
          {
            idChildQuestion: question.idChildQuestion,
            quizType: question.quiz_type,
            answer: isString(dataFill) ? dataFill : [...dataFill],
          },
        ],
      });
    } else {
      listUserAnswer.push({
        idQuestion: data[page - 1].idQuestion,
        quizType: data[page - 1].quiz_type,
        answer: isString(dataFill) ? dataFill : [...dataFill],
      });
    }
  } else {
    if (data[page - 1].quiz_type === questionEnumType.READING) {
      const indexChildQS: any = listUserAnswer[index]?.answer?.findIndex(
        (i: any) => i.idChildQuestion === question.idChildQuestion,
      );
      let listAnswer = [...listAnswerArr[index]?.answer];
      if (indexChildQS === -1) {
        listAnswer.push({
          idChildQuestion: question.idChildQuestion,
          quizType: question.quiz_type,
          answer: [...dataFill],
        });
        listUserAnswer.splice(index, 1, {
          idQuestion: data[page - 1].idQuestion,
          quizType: data[page - 1].quiz_type,
          answer: [...listAnswer],
        });
      } else {
        let answer = { ...listAnswer[indexChildQS] };
        answer = {
          ...answer,
          answer: isString(dataFill) ? dataFill : [...dataFill],
        };
        listAnswer.splice(indexChildQS, 1, answer);
        listUserAnswer.splice(index, 1, {
          idQuestion: data[page - 1].idQuestion,
          quizType: data[page - 1].quiz_type,
          answer: [...listAnswer],
        });
      }
    } else {
      listUserAnswer.splice(index, 1, {
        idQuestion: data[page - 1].idQuestion,
        quizType: data[page - 1].quiz_type,
        answer: isString(dataFill) ? dataFill : [...dataFill],
      });
    }
  }
  return listUserAnswer;
};

export const getTestFormat = (test_format: any) => {
  let type = 'listening';
  switch (test_format) {
    case TestType.Listening:
      type = 'listening';
      break;
    case TestType.Reading:
      type = 'reading';
      break;
    case TestType.Writing:
      type = 'writing';
      break;
    case TestType.Speaking:
      type = 'speaking';
      break;
    default:
      break;
  }
  return type;
};

export const getScore = (numberTrue: number) => {
  let score = '0';
  switch (numberTrue) {
    case 1:
      score = '1.0';
      break;
    case 2:
    case 3:
      score = '2.0';
      break;
    case 4:
    case 5:
      score = '2.5';
      break;
    case 6:
    case 7:
      score = '3.0';
      break;
    case 8:
    case 9:
      score = '3.5';
      break;
    case 10:
    case 11:
    case 12:
      score = '4.0';
      break;
    case 13:
    case 14:
      score = '4.5';
      break;
    case 15:
    case 16:
    case 17:
    case 18:
      score = '5.0';
      break;
    case 19:
    case 20:
    case 21:
    case 22:
      score = '5.5';
      break;
    case 23:
    case 24:
    case 25:
    case 26:
      score = '6.0';
      break;
    case 27:
    case 28:
    case 29:
      score = '6.5';
      break;
    case 30:
    case 31:
    case 32:
      score = '7.0';
      break;
    case 33:
    case 34:
      score = '7.5';
      break;
    case 35:
    case 36:
      score = '8.0';
      break;
    case 37:
    case 38:
      score = '8.5';
      break;
    case 39:
    case 40:
      score = '9.0';
      break;
    default:
      score = '0';
      break;
  }
  return score;
};

export const getCursorClass = (numberType: number) => {
  let cursor = 'cursor-auto';
  switch (numberType) {
    case CursorType.Default:
      cursor = 'cursor-auto';
      break;
    case CursorType.Eraser:
      cursor = 'cursor-eraser';
      break;
    case CursorType.BrushYellow:
      cursor = 'cursor-yellow';
      break;
    case CursorType.BrushGreen:
      cursor = 'cursor-green';
      break;
    case CursorType.BrushBlue:
      cursor = 'cursor-blue';
      break;
    case CursorType.Comment:
      cursor = 'cursor-comment';
      break;
    default:
      cursor = 'cursor-auto';
      break;
  }
  return cursor;
};

export const getFontSize = (fontSize: number) => {
  let font = 'text-base';
  switch (fontSize) {
    case 16:
      font = 'text-base';
      break;
    case 18:
      font = 'text-lg';
      break;
    case 20:
      font = 'text-xl';
      break;

    default:
      font = 'text-base';
      break;
  }
  return font;
};

export const listIDException = [7, 13, 127];

// Highlight + Comment

export function captureClick(e: any) {
  e.stopPropagation(); // Stop the click from being propagated.
  document.removeEventListener('click', captureClick, true); // cleanup
}

const getInputComment = (e: any) => {
  const listInputComment: any = document.querySelectorAll('.input-comment');
  const listBtnComment: any = document.querySelectorAll('.btn-comment');
  if (listBtnComment.length > 0 && listBtnComment.length > 0) {
    for (const item of listInputComment) {
      const indexBtn = [...listBtnComment].findIndex(
        (i: any) => i.dataset.highlight === item.dataset.highlight,
      );

      if (!item.contains(e.target)) {
        if (listBtnComment[indexBtn]?.contains(e.target)) {
          item.style.display = 'block';
          listBtnComment[indexBtn].style.pointerEvents = 'none';
        } else if (e.target.classList.contains('btn-add-comment')) {
          break;
        } else {
          const eleTextarea = item.getElementsByTagName('textarea')[0];
          if (eleTextarea.value === '') {
            item.remove();
            listBtnComment[indexBtn].parentElement?.removeAttribute('style');
            listBtnComment[indexBtn].remove();
            document.removeEventListener('click', (e: any) => {
              getInputComment(e);
            });
          } else {
            item.style.display = 'none';
            listBtnComment[indexBtn].style.pointerEvents = 'auto';
          }
        }
      }
    }
  }
};

function getDescendantNodes(node: any, all: any = []) {
  if (node) {
    all.push(...node.childNodes);
    for (const child of node.childNodes) getDescendantNodes(child, all);
  }

  return all;
}

function getSafeRanges(dangerous: any) {
  const a = dangerous.commonAncestorContainer;
  let eleStart: any;
  let eleEnd: any;

  const listEleMid = new Array(0);
  const response = new Array(0);

  if (dangerous.startContainer !== a) {
    for (let i = dangerous.startContainer; i !== a; i = i.parentNode) {
      if (i.parentNode === a) {
        eleStart = i;
      }
    }
  }
  if (dangerous.endContainer !== a) {
    for (let i = dangerous.endContainer; i !== a; i = i.parentNode) {
      if (i.parentNode === a) {
        eleEnd = i;
      }
    }
  }

  if (dangerous.endContainer === a && dangerous.startContainer === a) {
    response.push(dangerous);
    return response;
  } else {
    for (let e = eleStart.nextSibling; e !== eleEnd; e = e?.nextSibling) {
      listEleMid.push(e);
    }

    // listNodeStart
    let listNodeStart: any[] = [];
    listNodeStart = [...getDescendantNodes(eleStart)].filter(
      (i: any) => i.nodeName === '#text',
    );

    if (eleStart.nodeName === '#text') {
      const r = document.createRange();
      r.setStart(eleStart, dangerous.startOffset);
      r.setEndAfter(eleStart);
      response.push(r);
    } else {
      const indexStart = eleStart?.innerText?.indexOf(
        dangerous.startContainer.textContent,
      );

      listNodeStart.map((item: any) => {
        const r = document.createRange();

        if (eleStart?.innerText?.indexOf(item.textContent) === indexStart) {
          r.setStart(item, dangerous.startOffset);
          r.setEndAfter(item);
          response.push(r);
        } else if (
          eleStart?.innerText?.indexOf(item.textContent) > indexStart &&
          !item.parentNode.classList.contains('select-none')
        ) {
          r.selectNode(item);
          response.push(r);
        }
      });
    }

    // listNodeEnd
    // console.log([...getDescendantNodes(eleEnd)]);

    let listNodeEnd: any[] = [];
    listNodeEnd = [...getDescendantNodes(eleEnd)].filter(
      (i: any) => i.nodeName === '#text' && i.nodeValue !== '',
    );

    if (eleEnd?.nodeName === '#text') {
      const r = document.createRange();
      r.setStartBefore(eleEnd);
      r.setEnd(eleEnd, dangerous.endOffset);
      response.push(r);
    } else {
      const indexNodeEnd = listNodeEnd.findIndex(
        (item: any) => item.parentNode === dangerous.endContainer.parentNode,
      );

      listNodeEnd.map((item: any, index: number) => {
        const r = document.createRange();

        // xs.selectNode(item);
        if (item.parentNode === dangerous.endContainer.parentNode) {
          if (index === indexNodeEnd) {
            r.setStartBefore(item);
            r.setEnd(item, dangerous.endOffset);
            response.push(r);
          }
        } else {
          if (
            index < indexNodeEnd &&
            !item.parentNode.classList.contains('select-none')
          ) {
            r.selectNode(item);
            response.push(r);
          }
        }
      });
    }

    // listEleMid
    listEleMid.length > 0 &&
      listEleMid.map((item: any) => {
        let listNodeMid: any[] = [];

        listNodeMid = [...getDescendantNodes(item)].filter(
          (i: any) => i.nodeName === '#text',
        );
        listNodeMid.map((i: any) => {
          const r = document.createRange();
          r.selectNode(i);
          response.push(r);
        });
      });
    return response;
  }
}

const getContextMenu = (
  range: any,
  e: any,
  dispatch: any,
  countComment: number,
) => {
  const eleContextMenu: any = document.querySelector('.context-menu');
  if (!eleContextMenu?.contains(e.target)) {
    if (eleContextMenu !== null) {
      eleContextMenu?.remove();
    }

    if (
      window.getSelection()?.toString() !== '' &&
      range === window.getSelection()?.getRangeAt(0)
    ) {
      const ctxMenuElem = document.createElement('div');
      ctxMenuElem.classList.add('context-menu');
      ctxMenuElem.style.display = 'block';
      ctxMenuElem.style.left = e.clientX + 8 + 'px';
      ctxMenuElem.style.top = e.clientY + 'px';
      const ulElem = document.createElement('ul');
      let liElemHighlight = document.createElement('li');
      const image1 = document.createElement('img');
      image1.setAttribute(
        'src',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMjEuODEgMy45MzhjLTEuMzEgMy4yNy00LjMgNy41NC03LjE1IDEwLjMzYTUuOTYyIDUuOTYyIDAgMCAwLTUuMDctNC45NmMyLjgtMi44NiA3LjEtNS44OSAxMC4zOC03LjIxLjU4LS4yMiAxLjE2LS4wNSAxLjUyLjMxLjM4LjM4LjU2Ljk1LjMyIDEuNTNaIiBmaWxsPSIjZmY5OTAwIj48L3BhdGg+PHBhdGggZD0iTTEzLjc4IDE1LjA5Yy0uMi4xNy0uNC4zNC0uNi41bC0xLjc5IDEuNDNjMC0uMDMtLjAxLS4wNy0uMDEtLjExLS4xNC0xLjA3LS42NC0yLjA2LTEuNDUtMi44N2E1LjAyOSA1LjAyOSAwIDAgMC0yLjk2LTEuNDZjLS4wMyAwLS4wNy0uMDEtLjEtLjAxbDEuNDUtMS44M2MuMTQtLjE4LjI5LS4zNS40NS0uNTNsLjY4LjA5YzIuMTUuMyAzLjg4IDEuOTkgNC4yMiA0LjEzbC4xMS42NloiIGZpbGw9IiNmZjk5MDAiPjwvcGF0aD48cGF0aCBkPSJNMTAuNDMgMTcuNjJjMCAxLjEtLjQyIDIuMTUtMS4yMiAyLjk0LS42MS42Mi0xLjQzIDEuMDQtMi40MyAxLjE2bC0yLjQ1LjI3Yy0xLjM0LjE1LTIuNDktMS0yLjM0LTIuMzVsLjI3LTIuNDZjLjI0LTIuMTkgMi4wNy0zLjU5IDQuMDEtMy42My4xOS0uMDEuNCAwIC42LjAyLjg1LjExIDEuNjcuNSAyLjM2IDEuMTguNjcuNjcgMS4wNSAxLjQ2IDEuMTYgMi4yOS4wMi4yLjA0LjM5LjA0LjU4WiIgZmlsbD0iI2ZmOTkwMCI+PC9wYXRoPjwvc3ZnPg==',
      );
      liElemHighlight.appendChild(image1);
      liElemHighlight.insertAdjacentText('beforeend', 'Highlight');

      let liElemComment = document.createElement('li');
      const image2 = document.createElement('img');
      image2.setAttribute(
        'src',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMTYgMkg4QzQgMiAyIDQgMiA4djEzYzAgLjU1LjQ1IDEgMSAxaDEzYzQgMCA2LTIgNi02VjhjMC00LTItNi02LTZabS0yIDEzLjI1SDdjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWg3Yy40MSAwIC43NS4zNC43NS43NXMtLjM0Ljc1LS43NS43NVptMy01SDdjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWgxMGMuNDEgMCAuNzUuMzQuNzUuNzVzLS4zNC43NS0uNzUuNzVaIiBmaWxsPSIjMDA2N2M1Ij48L3BhdGg+PC9zdmc+',
      );
      image2.classList.add('btn-add-comment');
      liElemComment.appendChild(image2);
      liElemComment.insertAdjacentText('beforeend', 'Comment');
      liElemComment.classList.add('btn-add-comment');
      ulElem.appendChild(liElemHighlight);
      ulElem.appendChild(liElemComment);

      ctxMenuElem.appendChild(ulElem);
      document.body.appendChild(ctxMenuElem);

      liElemComment.onclick = () => {
        highlightComment(range, dispatch, countComment);
        // ctxMenuElem.remove();
      };

      liElemHighlight.onclick = () => {
        highlightColor(range, CursorType.BrushYellow, countComment);
        // ctxMenuElem.remove();
        window.getSelection()?.removeAllRanges();
      };
    }

    if (
      window.getSelection()?.toString() === '' &&
      e.target?.classList?.contains('clear-context')
    ) {
      getMenuClear(e);
    }
  }
};

const getMenuClear = (e: any) => {
  if (window.getSelection()?.toString() === '') {
    const eleClearMenu: any = document.querySelector('.clear-menu');
    if (eleClearMenu !== null && !eleClearMenu?.contains(e.target)) {
      eleClearMenu?.remove();
    }

    if (!eleClearMenu?.contains(e.target)) {
      const ctxMenuElem = document.createElement('div');
      ctxMenuElem.classList.add('clear-menu');
      ctxMenuElem.style.display = 'block';
      ctxMenuElem.style.left = e.clientX + 8 + 'px';
      ctxMenuElem.style.top = e.clientY + 'px';
      const ulElem = document.createElement('ul');
      let liElemClear = document.createElement('li');
      const image1 = document.createElement('img');
      image1.setAttribute(
        'src',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxLjgwOTggMy45NDAwOUMyMC40OTk4IDcuMjEwMDkgMTcuNTA5OCAxMS40ODAxIDE0LjY1OTggMTQuMjcwMUMxNC4yNDk4IDExLjY5MDEgMTIuMTg5OCA5LjY3MDA5IDkuNTg5ODQgOS4zMTAwOUMxMi4zODk4IDYuNDUwMDkgMTYuNjg5OCAzLjQyMDA5IDE5Ljk2OTggMi4xMDAwOUMyMC41NDk4IDEuODgwMDkgMjEuMTI5OCAyLjA1MDA5IDIxLjQ4OTggMi40MTAwOUMyMS44Njk4IDIuNzkwMDkgMjIuMDQ5OCAzLjM2MDA5IDIxLjgwOTggMy45NDAwOVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xMy43NzkxIDE1LjA5QzEzLjU3OTEgMTUuMjYgMTMuMzc5MSAxNS40MyAxMy4xNzkxIDE1LjU5TDExLjM4OTEgMTcuMDJDMTEuMzg5MSAxNi45OSAxMS4zNzkxIDE2Ljk1IDExLjM3OTEgMTYuOTFDMTEuMjM5MSAxNS44NCAxMC43MzkxIDE0Ljg1IDkuOTI5MTQgMTQuMDRDOS4xMDkxNCAxMy4yMiA4LjA4OTE0IDEyLjcyIDYuOTY5MTQgMTIuNThDNi45MzkxNCAxMi41OCA2Ljg5OTE0IDEyLjU3IDYuODY5MTQgMTIuNTdMOC4zMTkxNCAxMC43NEM4LjQ1OTE0IDEwLjU2IDguNjA5MTQgMTAuMzkgOC43NjkxNCAxMC4yMUw5LjQ0OTE0IDEwLjNDMTEuNTk5MSAxMC42IDEzLjMyOTEgMTIuMjkgMTMuNjY5MSAxNC40M0wxMy43NzkxIDE1LjA5WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTEwLjQyOTggMTcuNjE5OEMxMC40Mjk4IDE4LjcxOTggMTAuMDA5OCAxOS43Njk4IDkuMjA5NzYgMjAuNTU5OEM4LjU5OTc2IDIxLjE3OTggNy43Nzk3NyAyMS41OTk4IDYuNzc5NzcgMjEuNzE5OEw0LjMyOTc2IDIxLjk4OThDMi45ODk3NiAyMi4xMzk4IDEuODM5NzYgMjAuOTg5OCAxLjk4OTc2IDE5LjYzOThMMi4yNTk3NiAxNy4xNzk4QzIuNDk5NzYgMTQuOTg5OCA0LjMyOTc2IDEzLjU4OTggNi4yNjk3NiAxMy41NDk4QzYuNDU5NzYgMTMuNTM5OCA2LjY2OTc2IDEzLjU0OTggNi44Njk3NiAxMy41Njk4QzcuNzE5NzYgMTMuNjc5OCA4LjUzOTc2IDE0LjA2OTggOS4yMjk3NiAxNC43NDk4QzkuODk5NzYgMTUuNDE5OCAxMC4yNzk4IDE2LjIwOTggMTAuMzg5OCAxNy4wMzk4QzEwLjQwOTggMTcuMjM5OCAxMC40Mjk4IDE3LjQyOTggMTAuNDI5OCAxNy42MTk4WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yLjI5Mjg5IDIuMjkyODlDMi42ODM0MiAxLjkwMjM3IDMuMzE2NTggMS45MDIzNyAzLjcwNzExIDIuMjkyODlMMjEuNzA3MSAyMC4yOTI5QzIyLjA5NzYgMjAuNjgzNCAyMi4wOTc2IDIxLjMxNjYgMjEuNzA3MSAyMS43MDcxQzIxLjMxNjYgMjIuMDk3NiAyMC42ODM0IDIyLjA5NzYgMjAuMjkyOSAyMS43MDcxTDIuMjkyODkgMy43MDcxMUMxLjkwMjM3IDMuMzE2NTggMS45MDIzNyAyLjY4MzQyIDIuMjkyODkgMi4yOTI4OVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=',
      );
      liElemClear.appendChild(image1);
      liElemClear.insertAdjacentText('beforeend', 'Clear');

      let liElemClearAll = document.createElement('li');
      const image2 = document.createElement('img');
      image2.setAttribute(
        'src',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMjEuMDMgMjJoLTcuMDRhLjc0OS43NDkgMCAxIDEgMC0xLjVoNy4wNGEuNzQ5Ljc0OSAwIDEgMSAwIDEuNVpNMTMuNjQgMTYuNjljLjM5LjM5LjM5IDEuMDIgMCAxLjQybC0yLjk4IDIuOThhMy4wMjcgMy4wMjcgMCAwIDEtNC4wNy4xOGMtLjA3LS4wNi0uMTMtLjEyLS4xOS0uMThsLS44Ny0uODctMS43OS0xLjc5LS44Ni0uODZjLS4wNy0uMDctLjEzLS4xNC0uMTktLjIxYTMuMDEgMy4wMSAwIDAgMSAuMTktNC4wNGwyLjk4LTIuOThhLjk5Ni45OTYgMCAwIDEgMS40MSAwbDYuMzcgNi4zNVpNMjEuMTIgMTAuNjQxbC01IDVhLjk5Ni45OTYgMCAwIDEtMS40MSAwbC02LjM3LTYuMzVjLS4zOS0uMzktLjM5LTEuMDIgMC0xLjQybDUtNC45OWEzLjAyNCAzLjAyNCAwIDAgMSA0LjI2IDBsMy41MiAzLjUxYTMuMDEyIDMuMDEyIDAgMCAxIDAgNC4yNVoiIGZpbGw9IiMwMDY3YzUiPjwvcGF0aD48L3N2Zz4=',
      );
      liElemClearAll.appendChild(image2);
      liElemClearAll.insertAdjacentText(
        'beforeend',
        'Clear all Highlight and Comment',
      );
      ulElem.appendChild(liElemClear);
      ulElem.appendChild(liElemClearAll);

      ctxMenuElem.appendChild(ulElem);
      document.body.appendChild(ctxMenuElem);

      liElemClear.onclick = (ev: any) => {
        ev.stopImmediatePropagation();
        const eleInputComment = document.querySelectorAll('.input-comment');
        const eleClearContexts = document.querySelectorAll('.clear-context');
        eleClearContexts.forEach((item: any) => {
          if (item.dataset.highlight === e.target.dataset.highlight) {
            if (e.target.classList.contains('btn-comment')) {
              const eleInput = [...eleInputComment].find(
                (i: any) => i.dataset.highlight === e.target.dataset.highlight,
              );
              eleInput?.remove();
            }

            const newText = document.createTextNode(item.textContent);
            item?.parentNode.replaceChild(newText, item);
            ctxMenuElem.remove();
          }
        });
      };

      liElemClearAll.onclick = (ev: any) => {
        ev.stopImmediatePropagation();
        const eleInputComment = document.querySelectorAll('.input-comment');
        const eleClearContexts = document.querySelectorAll('.clear-context');
        eleClearContexts.forEach((item: any) => {
          const newText = document.createTextNode(item.textContent);
          item?.parentNode.replaceChild(newText, item);
          ctxMenuElem.remove();
        });
        eleInputComment?.forEach((item: any) => {
          item.remove();
        });
      };
    }
  }

  document.addEventListener('click', (ev: any) => {
    const eleClear: any = document.querySelector('.clear-menu');

    if (eleClear && !eleClear?.contains(ev.target)) {
      eleClear?.remove();
    }
  });
};

const highlightColor = (range: any, cursor: number, countComment: number) => {
  const listClass = [
    'highlighted-yellow',
    'highlighted-green',
    'highlighted-blue',
    'highlighted-eraser',
  ];
  let className = '';
  switch (cursor) {
    case CursorType.BrushYellow:
      className = 'highlighted-yellow clear-context';
      break;
    case CursorType.BrushGreen:
      className = 'highlighted-green clear-context';
      break;
    case CursorType.BrushBlue:
      className = 'highlighted-blue clear-context';
      break;
    case CursorType.Eraser:
      className = 'highlighted-eraser';
      break;

    default:
      className = '';
      break;
  }

  const listRange = getSafeRanges(range);

  listRange.map((item: any) => {
    if (item.toString() !== '') {
      const newNode = document.createElement('span');
      newNode.setAttribute('class', `${className}`);
      newNode.textContent = item.toString();
      newNode.dataset.highlight = `${countComment}`;

      if (listRange.length === 1) {
        const nodeOne = item.commonAncestorContainer.parentNode;
        if (
          nodeOne.classList.contains(listClass[0]) ||
          nodeOne.classList.contains(listClass[1]) ||
          nodeOne.classList.contains(listClass[2]) ||
          nodeOne.classList.contains(listClass[3])
        ) {
          if (className !== '' && nodeOne.classList.contains(className)) {
            return;
          } else {
            const newNode1 = document.createElement('span');
            const newNode2 = document.createElement('span');
            newNode1.setAttribute('class', `${nodeOne.className}`);
            newNode2.setAttribute('class', `${nodeOne.className}`);
            newNode1.textContent = nodeOne.textContent.slice(
              0,
              range.startOffset,
            );
            newNode2.textContent = nodeOne.textContent.slice(range.endOffset);
            nodeOne.replaceWith(newNode1, newNode, newNode2);
          }
        } else {
          item.deleteContents();
          item.insertNode(newNode);
        }
      } else {
        if (
          item.endContainer?.classList?.contains(listClass[0]) ||
          item.endContainer?.classList?.contains(listClass[1]) ||
          item.endContainer?.classList?.contains(listClass[2]) ||
          item.endContainer?.classList?.contains(listClass[3])
        ) {
          item.deleteContents();
          item.commonAncestorContainer.insertAdjacentElement(
            'afterend',
            newNode,
          );
        } else if (
          item.startContainer?.classList?.contains(listClass[0]) ||
          item.startContainer?.classList?.contains(listClass[1]) ||
          item.startContainer?.classList?.contains(listClass[2]) ||
          item.startContainer?.classList?.contains(listClass[3])
        ) {
          item.deleteContents();
          item.commonAncestorContainer.insertAdjacentElement(
            'beforebegin',
            newNode,
          );
        } else {
          item.deleteContents();
          item.insertNode(newNode);
        }
      }

      setTimeout(() => {
        window.getSelection()?.removeRange(range);
      }, 100);
    }
  });
};

const highlightComment = (range: any, dispatch: any, countComment: number) => {
  dispatch(setCursorCustom(CursorType.Default));

  const image = document.createElement('img');
  image.setAttribute(
    'src',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMTYgMkg4QzQgMiAyIDQgMiA4djEzYzAgLjU1LjQ1IDEgMSAxaDEzYzQgMCA2LTIgNi02VjhjMC00LTItNi02LTZabS0yIDEzLjI1SDdjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWg3Yy40MSAwIC43NS4zNC43NS43NXMtLjM0Ljc1LS43NS43NVptMy01SDdjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWgxMGMuNDEgMCAuNzUuMzQuNzUuNzVzLS4zNC43NS0uNzUuNzVaIiBmaWxsPSIjMDA1NmE0Ij48L3BhdGg+PC9zdmc+',
  );
  image.classList.add('btn-comment', 'clear-context');
  image.style.display = 'inline';
  image.style.cursor = 'pointer';
  image.style.marginTop = '-6px';
  image.style.marginLeft = '-2px';
  image.style.position = 'absolute';
  image.style.pointerEvents = 'none';
  image.dataset.highlight = `${countComment}`;

  const listRange: any[] = getSafeRanges(range);

  const rangeEnd = listRange[listRange.length - 1];
  const myRange2 = rangeEnd.cloneRange();
  myRange2.collapse(false);
  myRange2.insertNode(image);

  image.parentElement?.setAttribute('style', 'position:relative');

  const commentNode = document.createElement('div');
  commentNode.classList.add('input-comment');
  commentNode.style.top = `${image.getBoundingClientRect().top + 24}px`;
  commentNode.style.left = `${image.getBoundingClientRect().left - 20}px`;
  commentNode.style.display = 'block';
  commentNode.dataset.highlight = `${countComment}`;
  const titleComment = document.createElement('p');
  titleComment.style.color = '#0067C5';
  titleComment.textContent = 'Comment';

  const inputComment = document.createElement('div');
  inputComment.classList.add('box-input-comment');
  const textareaNode = document.createElement('textarea');
  textareaNode.setAttribute('rows', '2');
  textareaNode.setAttribute('placeholder', 'Add a comment');
  textareaNode.value = '';
  inputComment.appendChild(textareaNode);

  const btnComment = document.createElement('div');
  btnComment.classList.add('box-button');
  const btnDelete = document.createElement('button');
  btnDelete.classList.add('btn-delete');
  btnDelete.textContent = 'Delete comment';
  const btnSave = document.createElement('button');
  btnSave.setAttribute('disabled', 'true');
  btnSave.style.opacity = '0.5';
  btnSave.classList.add('btn-save');
  btnSave.textContent = 'Save';
  btnComment.appendChild(btnDelete);
  btnComment.appendChild(btnSave);

  commentNode.appendChild(titleComment);
  commentNode.appendChild(inputComment);
  commentNode.appendChild(btnComment);
  document.body?.appendChild(commentNode);

  textareaNode.oninput = (e: any) => {
    if (e.target.value !== '') {
      btnSave.removeAttribute('disabled');
      btnSave.style.opacity = '1';
    } else {
      btnSave.setAttribute('disabled', 'true');
      btnSave.style.opacity = '0.5';
    }
  };

  btnSave.onclick = () => {
    if (textareaNode.value !== '') {
      commentNode.style.display = 'none';
      image.style.pointerEvents = 'auto';
    } else {
      commentNode.remove();
      image.parentElement?.removeAttribute('style');
      image.remove();
    }
  };
  btnDelete.onclick = () => {
    commentNode.remove();
    image.parentElement?.removeAttribute('style');
    image.remove();
    document.removeEventListener('click', (e: any) => {
      getInputComment(e);
    });
  };
  image.onclick = (e: any) => {
    e.preventDefault();
    commentNode.style.display = 'block';
    image.style.pointerEvents = 'none';
    commentNode.style.top = `${image.getBoundingClientRect().top + 24}px`;
    commentNode.style.left = `${image.getBoundingClientRect().left - 20}px`;
  };

  setTimeout(() => {
    commentNode.style.display = 'block';
    image.style.pointerEvents = 'none';

    document.addEventListener('click', (e: any) => {
      getInputComment(e);
    });
    // window.getSelection()?.removeAllRanges();
  }, 100);
};

export function highlightRange(
  range: any,
  cursor: number,
  dispatch: any,
  countComment: number,
) {
  if (cursor !== CursorType.Comment && cursor !== CursorType.Default) {
    highlightColor(range, cursor, countComment);
  }

  if (cursor === CursorType.Comment) {
    highlightComment(range, dispatch, countComment);
  }

  if (cursor === CursorType.Default) {
    const listRange = getSafeRanges(range);
    if (listRange.length > 0) {
      document.addEventListener('contextmenu', (e: any) => {
        getContextMenu(range, e, dispatch, countComment);
      });
      document.addEventListener('click', (e: any) => {
        const eleContextMenu: any = document.querySelector('.context-menu');
        if (eleContextMenu && !eleContextMenu?.contains(e.target)) {
          eleContextMenu?.remove();
        }
      });
    }
  }

  const eleClearContexts = document.querySelectorAll('.clear-context');

  if (eleClearContexts && eleClearContexts.length > 0) {
    eleClearContexts.forEach((item: any) => {
      item?.addEventListener('contextmenu', (e: any) => {
        getMenuClear(e);
      });
    });
  }
}

export const removeEleComment = () => {
  const listInputComment: any = document.querySelectorAll('.input-comment');
  const listBtnComment: any = document.querySelectorAll('.btn-comment');
  listInputComment.length > 0 &&
    listInputComment.forEach((item: any) => item.remove());
  listBtnComment.length > 0 &&
    listBtnComment.forEach((item: any) => item.remove());
  document.removeEventListener('click', (e: any) => {
    getInputComment(e);
  });
  document.removeEventListener('click', (e: any) => {
    const eleContextMenu: any = document.querySelector('.context-menu');
    if (eleContextMenu && !eleContextMenu?.contains(e.target)) {
      eleContextMenu?.remove();
    }
  });
};

// export function highlightSelection(cursor: number) {
//   const userSelection = window.getSelection()?.getRangeAt(0);
//   highlightRange(userSelection, cursor);
//   // const safeRanges = getSafeRanges(userSelection);
//   // for (let i = 0; i < safeRanges.length; i++) {
//   //   highlightRange(safeRanges[i], cursor, s);
//   // }
// }

export const wordCount = (text: string) => {
  const words = text.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
};

export const getUserChoice = (index: number) => {
  switch (index) {
    case 0:
      return '<p>A</p>';
    case 1:
      return '<p>B</p>';
    case 2:
      return '<p>C</p>';
    case 3:
      return '<p>D</p>';
    case 4:
      return '<p>E</p>';
    case 5:
      return '<p>F</p>';
    case 6:
      return '<p>G</p>';
    case 7:
      return '<p>H</p>';
    case 8:
      return '<p>I</p>';

    default:
      break;
  }
};

export const scaleIeltsScore = (score: number) => Math.round(score * 2) / 2;

export const setColor = (score: number) => {
  if (score >= 0 && score < 33) {
    return '#F0776D';
  } else if (score >= 33 && score < 67) {
    return '#F2BF3B';
  } else {
    return '#599F44';
  }
};

export const convertFileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = error => {
      reject(error);
    };
  });
};
