import { Button, Checkbox, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { submitContactApi } from '@/service/api/contest';
import { setStudentId } from '@/store/slice/examInfo';
import { CheckboxProps } from '@mantine/core';

interface InformationProps {
  onNext: (step: number) => void;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  utm_source: string | string[] | undefined;
}

const Information: React.FC<InformationProps> = ({ onNext }) => {
  const dispatch = useAppDispatch();
  const { query } = useRouter();

  // check xác nhận chính sách
  const [isTerms, setIsTerms] = useState(true);

  // form info
  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      utm_source: query?.utm_source ?? '',
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'Email không đúng định dạng',
      phone: (value) =>
        /(0[1|3|5|7|8|9])+([0-9]{8})\b/g.test(value)
          ? null
          : 'SĐT không đúng định dạng',
    },
  });

  // submit form
  const onSubmit = form.onSubmit(async (values) => {
    const response = await submitContactApi(values);
    if (response.data.message === 'OK') {
      dispatch(setStudentId(response.data?.metadata?.student_id));
      onNext(2);
    }
  });

  // icon check box
  const CheckboxIcon: CheckboxProps['icon'] = ({ indeterminate, className }) =>
    indeterminate ? <IconCheck size={28} className={className} /> : null;

  return (
    <div className="w-full sm:w-[550px] px-2 sm:px-24">
      <h2 className="font-bold text-2xl text-primary text-center">
        Thông tin đăng ký
      </h2>
      <form onSubmit={onSubmit}>
        <TextInput
          className="mt-6 [&_input]:h-11 [&_input]:color-[#000] [&_input]:border-[#E0E0E0] [&_label]:text-neutral [&_label]:font-bold [&_label]:text-lg [&_label]:mb-1"
          radius={12}
          label="Họ tên học sinh"
          placeholder="Nhập tên"
          {...form.getInputProps('name')}
        />
        <TextInput
          className="mt-4 [&_input]:h-11 [&_input]:color-[#000] [&_input]:border-[#E0E0E0] [&_label]:text-neutral [&_label]:font-bold [&_label]:text-lg [&_label]:mb-1"
          label="Email"
          radius={12}
          placeholder="Nhập email"
          {...form.getInputProps('email')}
        />
        <TextInput
          className="mt-4 [&_input]:h-11 [&_input]:color-[#000] [&_input]:border-[#E0E0E0] [&_label]:text-neutral [&_label]:font-bold [&_label]:text-lg [&_label]:mb-1"
          label="Số điện thoại"
          radius={12}
          placeholder="Nhập số điện thoại"
          {...form.getInputProps('phone')}
        />

        <div className="flex w-full items-center justify-center content-center">
          <Checkbox
            className="[&_input]:border-neutral mt-4"
            color="green"
            size={24}
            radius={'xl'}
            icon={CheckboxIcon}
            indeterminate
            checked={isTerms}
            onChange={(event) => setIsTerms(event.currentTarget.checked)}
          />
          <p className="text-neutral text-sm mt-4 ml-2">
            Tôi đã đọc và đồng ý với{' '}
            <span
              className="text-primary hover:text-[#228be9] cursor-pointer"
              onClick={(e) => {
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
          className="bg-[#30A1E2] h-14 w-60 mt-8 block mx-auto text-base font-bold"
          radius={'xl'}
          type="submit"
          disabled={!isTerms}
        >
          Tiếp theo
        </Button>
      </form>
    </div>
  );
};

export default Information;

