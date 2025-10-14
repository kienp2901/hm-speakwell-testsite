import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExamInfoState, UserAnswer } from '@/types';

const initialState: ExamInfoState = {
  numberListen: 2,
  isModalInfo: false,
  studentId: '',
  idMockContest: null,
  idHistoryContest: '',
  idBaikiemtraListening: null,
  idBaikiemtraRW: null,
  idHistory: null,
  listUserAnswer: [],
  listUserAnswerDraft: [],
  listUserAudio: [],
  contestType: undefined,
  formConfig: [],
  dataExam: undefined,
  idHistoryRoundExam: null,
  cursorCustom: 0,
  fontSize: 16,
  userData: undefined,
};

export const examInfoSlice = createSlice({
  name: 'examInfo',
  initialState,
  reducers: {
    setNumberListen(state, action: PayloadAction<number>) {
      state.numberListen = action.payload;
    },
    setIsModalInfo(state, action: PayloadAction<boolean>) {
      state.isModalInfo = action.payload;
    },
    setStudentId(state, action: PayloadAction<string>) {
      state.studentId = action.payload;
    },
    setIdMockContest(state, action: PayloadAction<string | null>) {
      state.idMockContest = action.payload;
    },
    setIdHistoryContest(state, action: PayloadAction<string>) {
      state.idHistoryContest = action.payload;
    },
    setIdBaikiemtraListening(state, action: PayloadAction<string | null>) {
      state.idBaikiemtraListening = action.payload;
    },
    setIdBaikiemtraRW(state, action: PayloadAction<string | null>) {
      state.idBaikiemtraRW = action.payload;
    },
    setIdHistory(state, action: PayloadAction<string | null>) {
      state.idHistory = action.payload;
    },
    setListUserAnswer(state, action: PayloadAction<UserAnswer[]>) {
      state.listUserAnswer = action.payload;
    },
    setListUserAnswerDraft(state, action: PayloadAction<UserAnswer[]>) {
      state.listUserAnswerDraft = action.payload;
    },
    setListUserAudio(state, action: PayloadAction<any[]>) {
      state.listUserAudio = action.payload;
    },
    setContestType(state, action: PayloadAction<number | undefined>) {
      state.contestType = action.payload;
    },
    setFormConfig(state, action: PayloadAction<any[]>) {
      state.formConfig = action.payload;
    },
    setDataExam(state, action: PayloadAction<any>) {
      state.dataExam = action.payload;
    },
    setIdHistoryRoundExam(state, action: PayloadAction<string | number | null>) {
      state.idHistoryRoundExam = action.payload;
    },
    setCursorCustom(state, action: PayloadAction<number>) {
      state.cursorCustom = action.payload;
    },
    setFontSize(state, action: PayloadAction<number>) {
      state.fontSize = action.payload;
    },
    setUserData(state, action: PayloadAction<any>) {
      state.userData = action.payload;
    },
    refresh(state) {
      state.numberListen = 2;
      state.isModalInfo = false;
      state.studentId = '';
      state.idMockContest = null;
      state.idHistoryContest = '';
      state.idBaikiemtraListening = null;
      state.idBaikiemtraRW = null;
      state.idHistory = null;
      state.listUserAnswer = [];
      state.listUserAnswerDraft = [];
      state.listUserAudio = [];
      state.contestType = undefined;
      state.formConfig = [];
      state.dataExam = undefined;
      state.idHistoryRoundExam = null;
      state.cursorCustom = 0;
      state.fontSize = 16;
      state.userData = undefined;
    },
  },
});

export const {
  setNumberListen,
  setIsModalInfo,
  setStudentId,
  setIdMockContest,
  setIdHistoryContest,
  setIdBaikiemtraListening,
  setIdBaikiemtraRW,
  setIdHistory,
  setListUserAnswer,
  setListUserAnswerDraft,
  setListUserAudio,
  setContestType,
  setFormConfig,
  setDataExam,
  setIdHistoryRoundExam,
  setCursorCustom,
  setFontSize,
  setUserData,
  refresh,
} = examInfoSlice.actions;

