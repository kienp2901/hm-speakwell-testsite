import React from 'react';
import { CloseCircle, Check } from 'iconsax-react';
import i18n, { t } from 'i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  languages: Language[];
  onLanguageSelect: (language: Language) => void;
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  languages,
  onLanguageSelect,
}) => {
  const currentLanguage = i18n.language;

  const handleLanguageSelect = (language: Language) => {
    onLanguageSelect(language);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('header.choseLanguage')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CloseCircle size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Language List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
          <div className="space-y-2">
            {languages.map(language => (
              <div
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                  currentLanguage === language.code
                    ? 'bg-blue-100 border-2 border-blue-300'
                    : 'bg-gray-50 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <span className="text-gray-800 font-medium">
                    {language.name}
                  </span>
                </div>
                {currentLanguage === language.code && (
                  <Check size={20} className="text-blue-600" variant="Bold" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            {t('header.applyLanguage')} 
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
