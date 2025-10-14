import { Modal } from '@mantine/core';
import Button from '@/components/sharedV2/Button';
import { CloseCircle } from 'iconsax-react';
import { t } from 'i18next';

interface ResultSummaryModalProps {
  opened: boolean;
  onClose: () => void;
  onViewDetail: () => void;
  onBackToCourse: () => void;
  score: number;
  maxScore: number;
  status: boolean; // true = Đạt, false = Chưa đạt
  testName?: string;
}

const ResultSummaryModal = ({
  opened,
  onClose,
  onViewDetail,
  onBackToCourse,
  score,
  maxScore,
  status,
  testName = t('result_modal_exercise.practice_test')
}: ResultSummaryModalProps) => {
  const handleClose = () => {
    onClose();
    onBackToCourse(); // Mặc định quay về khóa học khi đóng popup
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      withCloseButton={false}
      size={1200}
      radius="lg"
      className="z-[1203]"
    >
      <div className="relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <CloseCircle size={20} color="#6B7280" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('result_modal_exercise.test_result')}
          </h2>
          <div className="space-y-1">
            <p className="text-gray-700">
              {status 
                ? t('result_modal_exercise.congratulations_completed') 
                : t('result_modal_exercise.sorry_not_completed')
              }
            </p>
            <p className="text-gray-600 text-sm">
              {status 
                ? t('result_modal_exercise.keep_up_good_work') 
                : t('result_modal_exercise.try_again_better')
              }
            </p>
          </div>
        </div>

        {/* Result Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <p className="text-gray-700 font-medium">{testName}</p>
            </div>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <div className="flex-1 text-center">
              <p className="text-gray-700 font-medium">
                {t('result_modal_exercise.score_achieved')}: {score}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <div className="flex-1 text-center">
              <p className={`font-medium ${status ? 'text-green-600' : 'text-red-600'}`}>
                {status ? t('result_modal_exercise.passed') : t('result_modal_exercise.failed')}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <div className="flex-1 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetail}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {t('result_modal_exercise.review_exam')}
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <Button
            onClick={onBackToCourse}
            className="py-[10px]"
          >
            {t('result_modal_exercise.back_to_course')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ResultSummaryModal;
