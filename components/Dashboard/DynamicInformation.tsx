import { Button, Checkbox, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { createUserApi, validateTokenApi } from '@/service/api/examConfig';
import { setStudentId, setIdMockContest, setContestType } from '@/store/slice/examInfo';
import { setAccessToken, setEmsToken, setEmsRefreshToken } from '@/store/slice/auth';
import { FormConfig } from '@/store/selector';
import { getRuntimeTenantCode } from '@/service/tenantDomains';
import { FormField } from '@/types';

interface DynamicInformationProps {
  onNext: (step: number) => void;
}

interface FormValues {
  [key: string]: string;
}

const DynamicInformation = ({ onNext }: DynamicInformationProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;
  const formConfig = useSelector(FormConfig, shallowEqual) as FormField[];

  // check xác nhận chính sách
  const [isTerms, setIsTerms] = useState(true);

  // Build initial values and validation rules from form config
  const buildFormConfig = () => {
    const initialValues: FormValues = {
      utm_source: (query?.utm_source as string) ?? '',
    };
    const validate: Record<string, (value: string) => string | null> = {};

    formConfig.forEach((field: FormField) => {
      // Use field.value as key (e.g. "name", "email", "phone")
      const fieldKey = field.key || field.value;
      
      // Set initial value
      initialValues[fieldKey] = '';

      // Add validation if required
      if (field.is_required) {
        if (field.input_type === 'email' || fieldKey === 'email') {
          validate[fieldKey] = (value: string) =>
            /^\S+@\S+$/.test(value) ? null : field.required_message || 'Email không đúng định dạng';
        } else if (fieldKey === 'phone' || field.input_type === 'tel') {
          validate[fieldKey] = (value: string) =>
            /(0[1|3|5|7|8|9])+([0-9]{8})\b/g.test(value)
              ? null
              : field.required_message || 'SĐT không đúng định dạng';
        } else {
          validate[fieldKey] = (value: string) =>
            value && value.trim() ? null : field.required_message || 'Trường này là bắt buộc';
        }
      }
    });

    return { initialValues, validate };
  };

  const { initialValues, validate } = buildFormConfig();

  // form info
  const form = useForm({
    initialValues,
    validate,
  });

  // submit form
  const onSubmit = form.onSubmit(async (values: FormValues) => {
    
    try {
      // Remove utm_source if empty
      const formData = { ...values };
      if (!formData.utm_source || formData.utm_source === '') {
        delete formData.utm_source;
      }
      
      const response = await createUserApi(formData);
      
      if (response.data) {
        const { student_id, access_token, contest_type, idMockContest } = response.data;
        
        // Save student_id to Redux
        if (student_id) {
          dispatch(setStudentId(String(student_id)));
        }
        
        // Save contest_type to Redux
        if (contest_type) {
          dispatch(setContestType(contest_type));
        }
        
        // Save idMockContest to Redux
        if (idMockContest) {
          dispatch(setIdMockContest(String(idMockContest)));
        }
        
        // Save access_token to Redux and localStorage
        if (access_token) {
          dispatch(setAccessToken(access_token));
          localStorage.setItem('ACCESS_TOKEN', access_token);
          
          // Call validate_token API to get EMS tokens
          try {
            // console.log('Calling validateTokenApi...');
            const tenantCode = getRuntimeTenantCode() || 'testsite';
            const validateResponse = await validateTokenApi(access_token);
            
            if (validateResponse.data && validateResponse.data.status === true) {
              const { 'x-api-key': xApiKey, 'x-api-key-refresh': xApiKeyRefresh } = validateResponse.data;
              
              // Save EMS tokens to Redux
              if (xApiKey) {
                dispatch(setEmsToken(xApiKey));
                localStorage.setItem('EMS_TOKEN', xApiKey);
              }
              
              if (xApiKeyRefresh) {
                dispatch(setEmsRefreshToken(xApiKeyRefresh));
                localStorage.setItem('EMS_REFRESH_TOKEN', xApiKeyRefresh);
              }
            }
          } catch (validateError) {
            console.error('Error validating token:', validateError);
            // Continue even if validate fails
          }
        }
        
        // Move to next step
        onNext(2);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!');
    }
  });

  // icon check box
  const CheckboxIcon = ({ indeterminate, className }: { indeterminate?: boolean; className?: string }) =>
    indeterminate && <IconCheck size={28} className={className} />;

  // Render field based on type
  const renderField = (field: FormField) => {
    // Use field.value as form key (e.g. "name", "email", "phone")
    const fieldKey = field.key || field.value;
    // Use field.key or field.field_name as display label (Vietnamese)
    const fieldLabel = field.field_name || fieldKey;
    
    const commonProps = {
      className: 'mt-4',
      classNames: {
        input: 'h-11 color-[#000] border-[#E0E0E0]',
        label: 'text-neutral font-bold text-lg mb-1',
      },
      radius: 12,
      label: fieldLabel,
      placeholder: field.placeholder || `Nhập ${fieldLabel}`,
      ...form.getInputProps(fieldKey),
    };

    return (
      <TextInput
        key={field.id}
        type={field.input_type}
        {...commonProps}
      />
    );
  };

  return (
    <div className="w-full sm:w-[550px] px-2 sm:px-24">
      <h2 className="font-bold text-2xl text-primary text-center">
        Thông tin đăng ký
      </h2>
      
      {formConfig.length > 0 ? (
        <form onSubmit={onSubmit}>
          {formConfig.map((field: FormField) => renderField(field))}

          <div className="flex w-full items-center justify-center content-center">
            <Checkbox
              classNames={{
                input: 'border-neutral',
              }}
              color="green"
              mt="md"
              size={24}
              radius={'xl'}
              icon={CheckboxIcon}
              indeterminate
              checked={isTerms}
              onChange={event => setIsTerms(event.currentTarget.checked)}
            />
            <p className="text-neutral text-sm mt-4 ml-2">
              Tôi đã đọc và đồng ý với{' '}
              <span
                className="text-primary hover:text-[#228be9] cursor-pointer"
                onClick={e => {
                  setIsTerms(true);
                  window.open(
                    'https://www.icanconnect.vn/article/dieu-khoan-and-chinh-sach',
                  );
                }}
              >
                Điều khoản & Chính sách
              </span>
            </p>
          </div>

          <Button
            className="bg-[#30A1E2] h-14 w-60 mt-8 block mx-auto"
            radius={'xl'}
            classNames={{
              label: 'text-base font-bold',
            }}
            type="submit"
            disabled={!isTerms}
          >
            Tiếp theo
          </Button>
        </form>
      ) : (
        <div className="text-center py-12">
          <div className="text-red-500 text-xl font-bold mb-4">
            Đường dẫn không hợp lệ
          </div>
          <p className="text-gray-600 mb-6">
            Không tìm thấy thông tin cấu hình cho đường dẫn này.
          </p>
          <Button
            className="bg-[#30A1E2] h-12 w-48"
            radius={'xl'}
            classNames={{
              label: 'text-base font-bold',
            }}
            onClick={() => onNext(0)}
          >
            Quay lại
          </Button>
        </div>
      )}
    </div>
  );
};

export default DynamicInformation;

