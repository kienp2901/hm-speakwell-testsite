import { RootState } from './index';

// auth
export const DataSignature = (state: RootState) => state.auth.dataSignature;
export const UserToken = (state: RootState) => state.auth.userToken;
export const AccessToken = (state: RootState) => state.auth.accessToken;
export const EmsToken = (state: RootState) => state.auth.emsToken;
export const EmsRefreshToken = (state: RootState) => state.auth.emsRefreshToken;

// examInfo
export const NumberListen = (state: RootState) => state.examInfo.numberListen;
export const IsModalInfo = (state: RootState) => state.examInfo.isModalInfo;
export const StudentId = (state: RootState) => state.examInfo.studentId;
export const IdMockContest = (state: RootState) => state.examInfo.idMockContest;
export const IdHistoryContest = (state: RootState) => state.examInfo.idHistoryContest;
export const IdBaikiemtraListening = (state: RootState) => state.examInfo.idBaikiemtraListening;
export const IdBaikiemtraRW = (state: RootState) => state.examInfo.idBaikiemtraRW;
export const IdHistory = (state: RootState) => state.examInfo.idHistory;
export const ListUserAnswer = (state: RootState) => state.examInfo.listUserAnswer;
export const ListUserAnswerDraft = (state: RootState) => state.examInfo.listUserAnswerDraft;
export const ListUserAudio = (state: RootState) => state.examInfo.listUserAudio;
export const ContestType = (state: RootState) => state.examInfo.contestType;
export const FormConfig = (state: RootState) => state.examInfo.formConfig;
export const ExamInfo = (state: RootState) => state.examInfo.dataExam;
export const IdHistoryRound = (state: RootState) => state.examInfo.idHistoryRoundExam;
export const CursorCustom = (state: RootState) => state.examInfo.cursorCustom;
export const FontSize = (state: RootState) => state.examInfo.fontSize;
export const UserData = (state: RootState) => state.examInfo.userData;

