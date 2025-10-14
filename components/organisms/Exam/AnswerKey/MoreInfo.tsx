/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */

import Button from '@/components/sharedV2/Button';
import { TestType } from 'enum';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { t } from 'i18next';

interface CustomizedState {
  idHistory?: number;
  allowed_mark_request?: boolean;
  part_history_id?: number;
  isPart?: boolean;
}

type MoreInfoProp = {
  testFormat?: number;
  state?: CustomizedState;
  className?: string;
  metadataAnswer?: any;
};

const MoreInfo = ({
  testFormat,
  state,
  className,
  metadataAnswer,
}: MoreInfoProp) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className={`bg-white my-6 py-4 sm:py-6 sm:rounded-2xl ${className}`}>
      {/* <div className="score-explained">
        <span className="text-white inline-block bg-ct-secondary-500 p-[10px] rounded-lg text-sm font-medium mb-3">
          Your score explained
        </span>
        <div
          dangerouslySetInnerHTML={{
            __html: metadataAnswer?.explained,
          }}
        ></div>
      </div> */}
      <div className="mt-6 advice-for-improvement">
        <span className="text-white inline-block bg-ct-tertiary-600 p-[10px] rounded-lg text-sm font-medium mb-3">
          {t('more_info.advice_for_improvement')}
        </span>
        <div
          dangerouslySetInnerHTML={{
            __html: metadataAnswer?.comment,
          }}
        ></div>
      </div>
      {(testFormat == TestType.Writing || testFormat === TestType.Speaking) && (
        <Button
          className="mx-auto mt-6"
          onClick={() => {
            navigate(`${pathname.replace('/answer-key', '/answer-detail')}`);
          }}
        >
          {t('more_info.review')}
        </Button>
      )}
    </div>
  );
};

export default React.memo(MoreInfo);
