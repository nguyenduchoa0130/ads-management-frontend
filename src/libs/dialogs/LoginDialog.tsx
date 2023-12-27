import AdsCheckbox from '@components/AdsCheckbox';
import AdsInput from '@components/AdsInput';
import { Button, Form, Typography } from 'antd';
import { useForm } from 'react-hook-form';

const LoginDialog = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '', isRemember: true } });

  const login = async (formValue) => {
    console.log(formValue);
  };

  return (
    <>
      <Form layout='vertical' className='pt-3' onFinish={handleSubmit(login)}>
        <AdsInput
          name='email'
          label='Email'
          control={control}
          error={errors.email}
          placeholder='Nhập email'
          rules={{
            required: 'Vui lòng nhập email',
            pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' },
          }}
        />
        <AdsInput
          isPassword
          name='password'
          label='Mật khẩu'
          control={control}
          error={errors.password}
          placeholder='Nhập mật khẩu'
          rules={{ required: 'Vui lòng nhập mật khẩu' }}
        />
        <div className='flex items-center justify-between'>
          <AdsCheckbox
            name='isRemember'
            label='Nhớ mật khẩu'
            control={control}
            error={errors.isRemember}
          />
          <Typography.Paragraph className='text-blue-500 cursor-pointer hover:opacity-75 transition-opacity'>
            Quên mật khẩu?
          </Typography.Paragraph>
        </div>
        <div className='py-2'>
          <Button size='large' type='primary' htmlType='submit' className='w-full'>
            Đăng Nhập
          </Button>
        </div>
      </Form>
    </>
  );
};

export default LoginDialog;
