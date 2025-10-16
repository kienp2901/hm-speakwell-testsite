import React from 'react';
import { useTranslation } from 'react-i18next';
interface LoadingProps {
  message?: string;
  className?: string;
  showMessage?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'fullscreen';
}

const Loading: React.FC<LoadingProps> = ({
  message,
  className = '',
  showMessage = true,
  size = 'medium',
  variant = 'default',
}) => {
  const { t } = useTranslation();

  const defaultMessage = t('loading.loading') + '... ' + t('loading.waiting');

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'px-4 py-6',
      logo: 'scale-75',
      text: 'text-xs',
    },
    medium: {
      container: 'px-6 py-8 md:px-28 md:py-20',
      logo: 'scale-100',
      text: 'text-sm md:text-base',
    },
    large: {
      container: 'px-8 py-12 md:px-32 md:py-24',
      logo: 'scale-125',
      text: 'text-base md:text-lg',
    },
  };

  // Variant configurations
  const variantConfig = {
    default:
      'w-screen h-screen flex justify-center items-center bg-[#F9F9F9] overflow-hidden',
    minimal: 'w-full h-full flex justify-center items-center p-4',
    fullscreen:
      'fixed inset-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50 z-50',
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  return (
    <div className={`${currentVariant} ${className}`}>
      <div
        className={`${currentSize.container} bg-white rounded-lg shadow-lg flex flex-col justify-center items-center`}
      >
        <div className="flex justify-center items-center mb-6 md:mb-10">
          <div className={`loading-logo ${currentSize.logo}`}>
            {/* Animated Loading Logo */}
            <svg
              width="78"
              height="69"
              viewBox="0 0 78 69"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Green L - with rotation animation */}
              <path
                d="M38.7714 29.6296C38.5872 29.4433 38.3417 29.3191 38.0962 29.1329C37.7893 28.8845 37.4211 28.6982 37.0528 28.5119C35.9481 27.953 34.7206 27.7046 33.4317 27.7046H9.1881C8.75846 27.7046 8.32884 27.7046 7.8992 27.7667C7.6537 27.8288 7.34679 27.8909 7.10128 27.953C6.05789 28.2635 5.07586 28.6982 4.2166 29.3812C4.03247 29.5675 3.78698 29.6917 3.60285 29.878C3.4801 29.9401 3.41875 30.0643 3.296 30.1885C1.82297 31.6789 0.840942 33.7902 0.840942 36.0879V40.6211V42.6703V60.12V60.6168C0.840942 61.424 0.963666 62.1692 1.14779 62.9144C1.20917 63.1007 1.27054 63.287 1.33192 63.4733C1.51604 63.9701 1.70021 64.4048 1.94571 64.8395C2.12984 65.15 2.31395 65.3983 2.49808 65.6467C2.80496 66.0193 3.11186 66.3919 3.48012 66.7645C3.72562 67.0129 3.9711 67.1992 4.2166 67.3855C4.76898 67.7581 5.32136 68.1307 5.93512 68.3791C6.242 68.5033 6.54891 68.6275 6.91716 68.6896C7.16267 68.7517 7.46953 68.8138 7.71503 68.8759C7.96054 68.938 8.26745 68.9379 8.51295 69C8.69708 69 8.88119 69 9.06532 69H31.4063H33.3089C34.5364 69 35.7639 68.6896 36.8073 68.1928C37.1755 68.0065 37.4824 67.8202 37.7893 67.6339C38.0962 67.4476 38.4031 67.1992 38.7099 66.9508C39.0168 66.7024 39.2623 66.454 39.5079 66.1435C39.5079 66.1435 39.5079 66.1435 39.5693 66.0814C39.8148 65.7709 40.0602 65.5225 40.2443 65.212C40.2443 65.212 40.2444 65.1499 40.3058 65.1499C40.3671 65.0257 40.4899 64.8395 40.5512 64.7153V64.6532C40.6126 64.4669 40.7354 64.3427 40.7968 64.1564C40.7968 64.0943 40.7968 64.0943 40.8581 64.0943C40.9195 63.9701 40.9809 63.7838 41.0423 63.6596L41.1037 63.5975C41.1651 63.4112 41.2264 63.287 41.2878 63.1007V63.0386C41.3492 62.8523 41.3491 62.7281 41.4105 62.6039V62.4797C41.4719 62.2934 41.4719 62.1071 41.5333 61.9208V61.8587C41.5333 61.6724 41.5946 61.5482 41.5946 61.3619C41.5946 61.2998 41.5946 61.2998 41.5946 61.2377C41.5946 61.0514 41.5946 60.8652 41.5946 60.6789V50.9915V36.15C41.7787 33.5418 40.6127 31.1821 38.7714 29.6296Z"
                fill="#88C340"
                className="loading-letter-l"
              />

              {/* Blue M - with pulse animation */}
              <path
                d="M45.2727 13.566V4.72944C45.2727 2.1158 43.1569 0 40.5433 0H31.7067C29.0931 0 26.9773 2.1158 26.9773 4.72944V13.566C26.9773 16.1797 29.0931 18.2955 31.7067 18.2955H40.5433C43.1569 18.2955 45.2727 16.1797 45.2727 13.566Z"
                fill="#0058A1"
                className="loading-letter-m"
              />

              {/* Pink S - with bounce animation */}
              <path
                d="M69.1965 16.7272H55.3255C50.9091 16.7272 47.3636 20.2728 47.3636 24.6893V38.5606C47.3636 42.9771 50.9091 46.5227 55.3255 46.5227H69.1965C73.6128 46.5227 77.1583 42.9771 77.1583 38.5606V24.6893C77.2205 20.335 73.6128 16.7272 69.1965 16.7272Z"
                fill="#D9218E"
                className="loading-letter-s"
              />
            </svg>
          </div>
        </div>
        {showMessage && (
          <p className={`text-center ${currentSize.text}`}>
            {message || defaultMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;
