import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import InitComponent from '../components/InitComponent';
import AppBootstrap from '../components/AppBootstrap';
import { persistor, store } from '../store';
import '../styles/globals.css';
import '../styles/style.css';
import '../components/Layouts/SplitLayout/style.css';
import '../components/Layouts/ContentTest/style.css';
import '../components/organisms/Exam/AnswerDetail/style.css';
import '../components/organisms/Exam/AnswerKey/style.css';
import '../components/organisms/Exam/BoardQuestion/style.css';
import '../components/organisms/Exam/BoardQuestionMobile/style.css';
import '../components/organisms/Exam/ModalAnswer/style.css';
import '../components/organisms/Exam/Question/style.css';
import '../components/organisms/Exam/SampleSpeaking/style.css';
import '../components/organisms/Exam/SampleWriting/style.css';
import '../components/template/Exam/Speaking/TestSpeaking/style.css';
import '../components/template/Exam/Speaking/AnswerDetail/style.css';
import '../components/template/Exam/Writing/AnswerTaskDetail/style.css';
import '../components/template/Exam/Writing/style.css';
import '../components/sharedV2/MathJax/style.css';
import '../components/sharedV2/Table/style.css';
import '../components/sharedV2/Loading/style.css';
import '../components/sharedV2/Ckeditor/style.css';
import { AppProps } from 'next/app';
import '../i18n'; // Initialize i18n

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <link rel="shortcut icon" href="/images/icon.png" />
        <title>Speakwell placement test</title>
        <meta name="google" content="notranslate"></meta>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        <AppBootstrap>
          <ToastContainer pauseOnFocusLoss={false} />
          <InitComponent />
          <Component {...pageProps} />
        </AppBootstrap>
      </PersistGate>
    </Provider>
  );
}

