/* eslint-disable prefer-const */
/* eslint-disable camelcase */
import { Drawer, Pagination } from '@mantine/core';
import ContentTestLayout from '@/components/Layouts/ContentTest';
import MySlpit from '@/components/Layouts/SplitLayout';
import AnswerDragDrop from '@/components/organisms/Exam/AnswerQuestion/AnswerDragDrop';
import Audio from '@/components/organisms/Exam/Audio';
import DropDown from '@/components/organisms/Exam/Question/DropDown';
import FillBlank from '@/components/organisms/Exam/Question/FillBlank';
import MultiChoiceMultiRight from '@/components/organisms/Exam/Question/MultiChoiceMultiRight';
import MultiChoiceOneRight from '@/components/organisms/Exam/Question/MultiChoiceOneRight';
import Button from '@/components/sharedV2/Button';
import MathJaxRender from '@/components/sharedV2/MathJax';
import { TestType, questionEnumType } from '@/enum';
import { DocumentText } from 'iconsax-react';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getHistoryDetail, getHistoryPartDetail } from '@/service/api/examConfig';
import { CursorCustom, FontSize } from '@/store/selector';
import { setCursorCustom, setFontSize } from '@/store/slice/examInfo';
import {
  captureClick,
  getCursorClass,
  getFontSize,
  highlightRange,
} from '@/utils';

const AnswerDetail = () => {
  const router = useRouter();
  const pathname = router.asPath;
  
  const params = router.query;
  const { idHistory } = params;

  const cursorCustom = useSelector(CursorCustom, shallowEqual) || 0;
  const fontSize = useSelector(FontSize, shallowEqual) || 16;

  const [page, setPage] = useState(() => {
    return localStorage.getItem('page')
      ? Number(localStorage.getItem('page'))
      : 1;
  });
  const [listAudio, setListAudio] = useState<any[]>([]);
  const [listDataResult, setListDataResult] = useState<any[]>([]);
  const [listGraded, setListGraded] = useState<any>([]);
  const [listQuestion, setListQuestion] = useState<any>([]);
  const [metadata, setMetadata] = useState<any>();
  const [srcAudio, setSrcAudio] = useState();
  const [redoStatus, setRedoStatus] = useState(true);
  const [countComment, setCountComment] = useState<number>(1);
  const [isDrawerRead, setIsDrawerRead] = useState<boolean>(false);
  const [isScrollMobile, setIsScrollMobile] = useState<boolean>(false);
  const [isReadHere, setIsReadHere] = useState<boolean>(true);
  const [stateWidth, setStateWidth] = useState(window.innerWidth);

  const dispatch = useDispatch();

  const leftRef = useRef<any>();
  const rightRef = useRef<any>();

  const getHistoryExam = async (idHistory: string) => {
    const response = await getHistoryDetail(idHistory);
    if (response.status === 200) {
      const index = response?.data?.data?.rounds?.findIndex(
        (item: any) => item.test_format === TestType.Listening,
      );
      setMetadata(response?.data?.data?.rounds[index]);
      setListGraded(response?.data?.data?.rounds[index].listQuestionGraded);
      setListQuestion(response?.data?.data?.rounds[index].listQuestion);
      setRedoStatus(response?.data?.data?.redo_status);
    }
  };

  const getHistoryPart = async (idHistory: string) => {
    const response = await getHistoryDetail(idHistory);
    if (response.status === 200) {
      setListGraded(response?.data?.data?.listQuestionGraded);
      setListQuestion(response?.data?.data?.listQuestion);
    }
  };

  const getContentQuestion = (itemQues: any, numberPage: number) => {
    let listItemQuestion: any = [];
    itemQues?.listQuestionChildren.map((item: any, index: any) => {
      let itemQuestion: any = <></>;
      switch (item.quiz_type) {
        case questionEnumType.ONE_RIGHT:
          itemQuestion = (
            <MultiChoiceOneRight
              question={item}
              indexQuestion={index}
              key={index}
              type="answer-detail"
              page={numberPage}
              data={listQuestion}
              listDataResult={listDataResult}
            />
          );
          break;
        case questionEnumType.MULTIPLE_RIGHT:
          itemQuestion = (
            <MultiChoiceMultiRight
              type="answer-detail"
              question={item}
              indexQuestion={index}
              key={index}
              data={listQuestion}
              page={numberPage}
              listDataResult={listDataResult}
            />
          );
          break;
        case questionEnumType.FILL_BLANK:
          itemQuestion = (
            <FillBlank
              key={index}
              indexQuestion={index}
              question={item}
              type="answer-detail"
              page={numberPage}
              data={listQuestion}
              listDataResult={listDataResult}
            />
          );
          break;
        case questionEnumType.DROPDOWN:
          itemQuestion = (
            <DropDown
              key={index}
              indexQuestion={index}
              question={item}
              type="answer-detail"
              page={numberPage}
              data={listQuestion}
              listDataResult={listDataResult}
            />
          );
          break;
        case questionEnumType.DRAG_DROP:
          itemQuestion = (
            <AnswerDragDrop
              type="answer-detail"
              key={index}
              indexQuestion={index}
              question={item}
              page={numberPage}
              data={listQuestion}
              listDataResult={listDataResult}
            />
          );
          break;
        default:
          break;
      }

      listItemQuestion.push(itemQuestion);
    });
    return listItemQuestion;
  };

  const nextPage = () => {
    const index = listAudio.findIndex((item: any) => item === srcAudio);
    setSrcAudio(listAudio[index + 1]);
    setPage(index + 2);
    localStorage.setItem('page', `${index + 2}`);
    sessionStorage.setItem('current-time', '0');
  };

  const previousPart = () => {
    const index = listAudio.findIndex((item: any) => item === srcAudio);
    setSrcAudio(listAudio[index - 1]);
    setPage(index);
    localStorage.setItem('page', `${index}`);
    sessionStorage.setItem('current-time', '0');
  };

  const onMouseUp = (e: any) => {
    if (e.button == 0) {
      const s = window.getSelection()?.toString();
      const userSelection = window.getSelection()?.getRangeAt(0);
      if (s === '') {
        return;
      }
      setCountComment((prev: number) => prev + 1);
      highlightRange(userSelection, cursorCustom, dispatch, countComment);
      document.addEventListener('click', captureClick, true);
    }
  };

  const onScroll = (e: any) => {
    setIsReadHere(true);
    if (e?.target?.scrollTop > 0) {
      setIsScrollMobile(true);
    } else {
      setIsScrollMobile(false);
    }
  };

  useEffect(() => {
    let timerScroll: any;
    if (isScrollMobile) {
      clearTimeout(timerScroll);
      timerScroll = setTimeout(() => {
        setIsScrollMobile(false);
        setIsReadHere(false);
      }, 3000);
    } else {
      clearTimeout(timerScroll);
    }
    return () => {
      clearTimeout(timerScroll);
    };
  }, [isScrollMobile]);

  useEffect(() => {
    if (pathname.includes('/exam')) getHistoryPart(`${idHistory}`);
    else getHistoryExam(`${idHistory}`);
  }, [idHistory]);

  useEffect(() => {
    const listSrcAudio = listQuestion?.map((item: any) => {
      return item.audio;
    });
    setListAudio(listSrcAudio);
    setSrcAudio(listSrcAudio[page - 1]);
  }, [listQuestion]);

  useEffect(() => {
    let arrDataResult: any[] = [];
    listGraded?.map((item: any) => {
      item.userAnswer.map((i: any) => {
        if (i.answer[0]?.idChildQuestion) {
          arrDataResult = [...arrDataResult, ...i.answer];
        } else {
          arrDataResult.push(i);
        }
      });
    });
    arrDataResult = arrDataResult.filter((it: any) => it.answer !== '');
    setListDataResult(arrDataResult);
  }, [listGraded]);

  useEffect(() => {
    leftRef.current.scrollTop = 0;
    rightRef.current.scrollTop = 0;
  }, [page]);

  useEffect(() => {
    dispatch(setCursorCustom(0));
    dispatch(setFontSize(16));
    document.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
    window.addEventListener('resize', () => {
      setStateWidth(window.innerWidth);
    });
    let timerRotate: any;

    window.screen?.orientation?.addEventListener('change', (e: any) => {
      timerRotate = setTimeout(() => {
        setStateWidth(window.innerWidth);
      }, 100);
    });
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.keyCode === 65 || //key a
          e.keyCode === 67 || //key c
          e.keyCode === 70 || //key f
          e.keyCode === 80 || //key p
          e.keyCode === 82 || //key r
          e.keyCode === 83 || //key s
          e.keyCode === 86 || //key v
          e.keyCode === 117) //key F6
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', event => {
        event.preventDefault();
      });
      window.screen?.orientation?.removeEventListener('change', () => {
        timerRotate = setTimeout(() => {
          setStateWidth(window.innerWidth);
        }, 100);
      });
      clearTimeout(timerRotate);
    };
  }, []);

  const headerContent = () => {
    return (
      <div className="flex items-center space-x-4 text-ct-primary-500">
        <span>{'Part'}</span>
        <Pagination
          page={page}
          total={listQuestion?.length}
          withControls={false}
          className="!gap-0 space-x-2"
          classNames={{
            item: 'bg-white min-w-[24px] h-6 w-6 lg:min-w-[32px] lg:h-8 lg:w-8',
          }}
          styles={() => ({
            item: {
              '&[data-active]': {
                backgroundColor: '#FF3BAF !important',
              },
            },
          })}
          onChange={(page: number) => {
            setPage(page);
          }}
        />
      </div>
    );
  };

  const leftContainer = () => {
    return (
      <div
        className="h-full overflow-y-auto px-6 relative flex flex-col justify-between"
        ref={leftRef}
      >
        <div className="pb-[160px]">
          {stateWidth > 1023 && (
            <div className="sticky top-0 z-10 pt-6 ">
              <Audio
                listAudio={listAudio}
                setPage={setPage}
                setCheckAudioEnd={() => {}}
                setIsShowButtonSubmit={() => {}}
                srcAudio={srcAudio}
                setSrcAudio={setSrcAudio}
              />
            </div>
          )}
          {listQuestion.length > 0 &&
            listQuestion.map((item: any, index: number) => (
              <div
                key={index}
                dangerouslySetInnerHTML={{
                  __html: item?.solution || item?.text,
                }}
                className={`mt-4 ${
                  page === index + 1 ? 'block' : 'hidden'
                } ${getFontSize(fontSize)}`}
              ></div>
            ))}
        </div>
        <div className="bg-ct-neutral-200 w-full py-3 px-6 sticky bottom-0 hidden items-center justify-between select-none">
          <Button
            className="bg-white"
            variant="outline"
            disabled={
              listAudio.findIndex((item: any) => item === srcAudio) === 0
            }
            onClick={previousPart}
          >
            Previous Part
          </Button>
          <Button
            disabled={
              listAudio.findIndex((item: any) => item === srcAudio) ===
              listAudio.length - 1
            }
            onClick={nextPage}
          >
            Next Part
          </Button>
        </div>
      </div>
    );
  };
  const rightContainer = () => {
    return (
      <div className="h-full bg-[#F9F9F9] relative pb-[62px] sm:pb-[64px] lg:pb-0">
        <div
          className="h-full overflow-y-auto scroll-smooth px-4"
          ref={rightRef}
          onScroll={onScroll}
        >
          <div className="">
            {stateWidth < 1024 && (
              <div className="lg:hidden sticky top-0 z-10 pt-6 bg-ct-neutral-200">
                <Audio
                  listAudio={listAudio}
                  setPage={setPage}
                  setCheckAudioEnd={() => {}}
                  setIsShowButtonSubmit={() => {}}
                  srcAudio={srcAudio}
                  setSrcAudio={setSrcAudio}
                />
              </div>
            )}
            {listQuestion.length > 0 &&
              listQuestion.map((item: any, index: any) => (
                <React.Fragment key={index}>
                  <p
                    className={`mt-4 text-xl ${
                      page === index + 1 ? 'block' : 'hidden'
                    }`}
                  >
                    <MathJaxRender math={`${item?.text}`} />
                  </p>
                  <div
                    className={`${
                      page === index + 1 ? 'flex' : 'hidden'
                    } flex-col space-y-6 ${getFontSize(fontSize)}`}
                  >
                    {getContentQuestion(item, index + 1)}
                  </div>
                </React.Fragment>
              ))}
          </div>

          <div
            className={`cursor-pointer transition-all duration-500 ease-linear ${
              isReadHere ? 'w-[126px] sm:w-[134px]' : 'w-[40px] sm:w-[48px]'
            } h-[40px] sm:h-[48px] px-2 sm:px-3 bg-ct-tertiary-600 rounded-full inline-flex flex-nowrap items-center justify-center sticky bottom-8 float-right lg:hidden`}
            onClick={() => setIsDrawerRead(true)}
          >
            <span className="flex items-center justify-center">
              <DocumentText color="#ffffff" variant="Bold" />
            </span>
            <span className="read-here text-white font-medium text-sm">
              &nbsp;See solution
            </span>
          </div>
        </div>

        <div className="bg-white w-full py-3 px-6 absolute bottom-0 hidden items-center justify-between select-none">
          <Button
            className="bg-white"
            variant="outline"
            disabled={
              listAudio.findIndex((item: any) => item === srcAudio) === 0
            }
            onClick={previousPart}
          >
            Previous Part
          </Button>
          <Button
            disabled={
              listAudio.findIndex((item: any) => item === srcAudio) ===
              listAudio.length - 1
            }
            onClick={nextPage}
          >
            Next Part
          </Button>
        </div>
      </div>
    );
  };

  const testContent = () => {
    return (
      <div className="flex h-full w-full">
        <div
          className={`h-full overflow-hidden w-full pt-[100px] sm:pt-[60px] ${getCursorClass(
            cursorCustom,
          )}`}
          onMouseUp={onMouseUp}
        >
          <MySlpit leftContent={leftContainer} rightContent={rightContainer} />
          <Drawer
            opened={isDrawerRead}
            className="lg:hidden"
            onClose={() => setIsDrawerRead(false)}
            zIndex={1201}
            withCloseButton={false}
            size={'100%'}
            classNames={{
              drawer: 'overflow-y-auto',
            }}
          >
            <div className="p-4 pb-8">
              {listQuestion.length > 0 &&
                listQuestion.map((item: any, index: number) => (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{
                      __html: item?.solution || item?.text,
                    }}
                    className={`mt-4 ${
                      page === index + 1 ? 'block' : 'hidden'
                    } ${getFontSize(fontSize)}`}
                  ></div>
                ))}
            </div>
            <div className="sticky bottom-0 w-full bg-white py-2">
              <Button
                className="mx-auto "
                variant="solid"
                onClick={() => setIsDrawerRead(false)}
              >
                See questions
              </Button>
            </div>
          </Drawer>
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <ContentTestLayout
        page={page}
        total={4}
        type={'answer-detail'}
        childrenHeader={headerContent}
        childrenContent={testContent}
        listGraded={listGraded}
        listQuestion={listQuestion}
        setPage={setPage}
        contentRef={rightRef}
        redoStatus={redoStatus}
        metadata={metadata}
      />
    </div>
  );
};

export default AnswerDetail;
