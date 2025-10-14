import { Box, Drawer } from '@mui/material';
import { createTheme, styled } from '@mui/material/styles';
import BoardQuestion from '@/components/organisms/Exam/BoardQuestion';
import BoardQuestionMobile from '@/components/organisms/Exam/BoardQuestionMobile';
import HeaderTest from '@/components/organisms/Exam/HeaderTest';
import { Category } from 'iconsax-react';
const arrow_icon = '/images/arrow_icon.svg';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setListUserAnswer } from '@/store/slice/examInfo';
import { t } from 'i18next';

import SaveAnswer from './saveAnswer';

const drawerWidth = 240;

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; // adds the `mobile` breakpoint
    tablet: true;
    laptop: true;
    desktop: true;
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1280,
    },
  },
});

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })<{
  open?: boolean;
}>(({ open }) => ({
  flexGrow: 1,

  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('mobile')]: {
      marginRight: 0,
    },
    [theme.breakpoints.up('tablet')]: {
      marginRight: 195,
    },
    [theme.breakpoints.up('laptop')]: {
      marginRight: 210,
    },
    [theme.breakpoints.up('desktop')]: {
      marginRight: drawerWidth,
    },
  }),
}));

const ContentTestLayout = ({
  childrenContent,
  childrenHeader,
  total,
  page,
  type,
  showOpenDraw,
  showSubmitBtn,
  submitAnswer,
  exitCurrentPage,
  listQuestion,
  listGraded,
  stayCurrentPage,
  showSendExamBtn,
  showInfoSendExamBtn,
  setPage,
  contentRef,
  redoStatus,
  isPauseAllow,
  isDisabledSubmit,
  metadata,
}: any) => {
  const [open, setOpen] = useState(false);
  const [isDrawerMobile, setIsDrawerMobile] = useState<boolean>(false);
  const router = useRouter();
  const pathname = router.asPath;
  const dispatch = useDispatch();

  const showDrawer = () => {
    setOpen(prv => !prv);
  };

  useEffect(() => {
    if (pathname.includes('/listening') || pathname.includes('/reading')) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (
      (pathname.includes('/listening') || pathname.includes('/reading')) &&
      listGraded?.length > 0
    ) {
      const arrUserAnswer: any[] = [];

      listGraded?.map((item: any) => {
        const arrItemAnswer: any[] = [];
        item?.userAnswer.map((i: any) => {
          arrItemAnswer.push({
            idChildQuestion: i.idChildQuestion,
            answer: i.answer,
          });
        });
        arrUserAnswer.push({
          idQuestion: item.idQuestion,
          answer: arrItemAnswer,
        });
      });
      dispatch(setListUserAnswer(arrUserAnswer));
    }
  }, [listGraded]);

  return (
    <div id="content-click" className="w-screen fixed h-full">
      <Box>
        <Main open={open} className="fixed top-0 bottom-0 left-0 right-0">
          <HeaderTest
            showSendExamBtn={showSendExamBtn}
            showInfoSendExamBtn={showInfoSendExamBtn}
            total={total}
            page={page}
            type={type}
            submitAnswer={submitAnswer}
            childrenHeader={childrenHeader}
            showDrawer={showDrawer}
            isOpenDrawer={open}
            showOpenDraw={showOpenDraw}
            showSubmitBtn={showSubmitBtn}
            exitCurrentPage={exitCurrentPage}
            stayCurrentPage={stayCurrentPage}
            redoStatus={redoStatus}
            isPauseAllow={isPauseAllow}
            isDisabledSubmit={isDisabledSubmit}
            metadata={metadata}
          />
          {(pathname.includes('/listening') ||
            pathname.includes('/reading')) && (
            <div className="flex items-center justify-between sm:hidden px-4 py-2 absolute w-full top-[62px] bg-ct-neutral-400 z-50">
              <div className="flex items-center">
                <Category size={'18'} color="#000000" variant="Bold" />
                <p className="ml-2">{t('content_test.question_palette')}</p>
              </div>
              <img
                onClick={() => setIsDrawerMobile(true)}
                className="cursor-pointer rotate-90"
                src={arrow_icon}
                alt=""
              />
            </div>
          )}

          <div className="h-full">{childrenContent()}</div>
        </Main>
        {(pathname.includes('/listening') || pathname.includes('/reading')) && (
          <Drawer
            // sx={{
            //   width: { xs: 0, sm: 190, md: 210, lg: drawerWidth },
            //   flexShrink: 0,
            //   '& .MuiDrawer-paper': {
            //     width: { xs: 0, sm: 190, md: 210, lg: drawerWidth },
            //   },
            // }}
            variant="persistent"
            anchor="right"
            open={open}
            className="board-question hidden sm:block"
          >
            <BoardQuestion
              showDrawer={showDrawer}
              listQuestion={listQuestion}
              setPage={setPage}
              contentRef={contentRef}
            />
          </Drawer>
        )}
        {(pathname.includes('/listening') || pathname.includes('/reading')) && (
          <div>
            <Drawer
              sx={{
                '& .MuiDrawer-paper': {
                  borderRadius: '16px 16px 0 0',
                },
              }}
              anchor="bottom"
              open={isDrawerMobile}
              className="block sm:hidden"
              onClose={() => setIsDrawerMobile(false)}
            >
              <BoardQuestionMobile
                onCloseDrawer={() => setIsDrawerMobile(false)}
                listQuestion={listQuestion}
                setPage={setPage}
                contentRef={contentRef}
              />
            </Drawer>
          </div>
        )}
      </Box>
      {/* <SaveAnswer /> */}
    </div>
  );
};

export default ContentTestLayout;
