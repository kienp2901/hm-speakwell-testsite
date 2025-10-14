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
  const { query } = useRouter();
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
    console.log('Dynamic form submission - raw values:', values);
    
    try {
      // Remove utm_source if empty
      const formData = { ...values };
      if (!formData.utm_source || formData.utm_source === '') {
        delete formData.utm_source;
      }
      
      console.log('Payload keys:', Object.keys(formData));
      console.log('Calling createUserApi with formData:', formData);
      console.log('Payload as JSON:', JSON.stringify(formData));
      const response = await createUserApi(formData);
      
      console.log('createUserApi response:', response);
      
      if (response.data) {
        const { student_id, access_token, contest_type, idMockContest } = response.data;
        
        console.log('Student ID:', student_id);
        console.log('Access Token:', access_token);
        console.log('Contest Type:', contest_type);
        console.log('ID Mock Contest:', idMockContest);
        
        // Save student_id to Redux
        if (student_id) {
          dispatch(setStudentId(String(student_id)));
        }
        
        // Save contest_type to Redux
        if (contest_type) {
          dispatch(setContestType(contest_type));
          console.log('Contest type saved:', contest_type);
        }
        
        // Save idMockContest to Redux
        if (idMockContest) {
          dispatch(setIdMockContest(String(idMockContest)));
          console.log('idMockContest saved:', idMockContest);
        }
        
        // Save access_token to Redux and localStorage
        if (access_token) {
          dispatch(setAccessToken(access_token));
          localStorage.setItem('ACCESS_TOKEN', access_token);
          console.log('Access token saved to Redux and localStorage');
          
          // Call validate_token API to get EMS tokens
          try {
            console.log('Calling validateTokenApi...');
            const tenantCode = getRuntimeTenantCode() || 'testsite';
            const validateResponse = await validateTokenApi(access_token);
            
            console.log('validateTokenApi response:', validateResponse);
            
            if (validateResponse.data && validateResponse.data.status === true) {
              const { 'x-api-key': xApiKey, 'x-api-key-refresh': xApiKeyRefresh } = validateResponse.data;
              
              console.log('EMS Token (x-api-key):', xApiKey?.substring(0, 30) + '...');
              console.log('EMS Refresh Token (x-api-key-refresh):', xApiKeyRefresh?.substring(0, 30) + '...');
              
              // Save EMS tokens to Redux
              if (xApiKey) {
                dispatch(setEmsToken(xApiKey));
                localStorage.setItem('EMS_TOKEN', xApiKey);
                console.log('EMS token saved to Redux and localStorage');
              }
              
              if (xApiKeyRefresh) {
                dispatch(setEmsRefreshToken(xApiKeyRefresh));
                localStorage.setItem('EMS_REFRESH_TOKEN', xApiKeyRefresh);
                console.log('EMS refresh token saved to Redux and localStorage');
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
      <form onSubmit={onSubmit}>
        {formConfig.length > 0 ? (
          <>
            {formConfig.map((field: FormField) => renderField(field))}
          </>
        ) : (
          // Fallback to default form if no config
          <>
            <TextInput
              className="mt-6"
              classNames={{
                input: 'h-11 color-[#000] border-[#E0E0E0]',
                label: 'text-neutral font-bold text-lg mb-1',
              }}
              radius={12}
              label="Họ tên học sinh"
              placeholder="Nhập tên"
              {...form.getInputProps('name')}
            />
            <TextInput
              className="mt-4"
              classNames={{
                input: 'h-11 color-[#000] border-[#E0E0E0]',
                label: 'text-neutral font-bold text-lg mb-1',
              }}
              label="Email"
              radius={12}
              placeholder="Nhập email"
              {...form.getInputProps('email')}
            />
            <TextInput
              className="mt-4"
              classNames={{
                input: 'h-11 color-[#000] border-[#E0E0E0]',
                label: 'text-neutral font-bold text-lg mb-1',
              }}
              label="Số điện thoại"
              radius={12}
              placeholder="Nhập số điện thoại"
              {...form.getInputProps('phone')}
            />
          </>
        )}

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
    </div>
  );
};

export default DynamicInformation;

