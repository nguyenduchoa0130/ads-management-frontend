import AdsInput from '@components/AdsInput';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';

const RegisterDialog = () => {
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '', passwordConfirm: '' } });

  const register = async (formValue) => {
    console.log(formValue);
  };

  return (
    <>
      <Form layout='vertical' className='pt-3' onFinish={handleSubmit(register)}>
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
          rules={{
            required: 'Vui lòng nhập mật khẩu',
            minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
          }}
        />
        <AdsInput
          isPassword
          name='passwordConfirm'
          label='Nhập lại mật khẩu'
          control={control}
          error={errors.passwordConfirm}
          placeholder='Vui lòng nhập lại mật khẩu'
          rules={{
            validate: (value) => {
              if (value !== watch('password')) {
                return 'Mật khẩu nhập lại không đúng';
              }
            },
          }}
        />
        <Button type='primary' size='large' className='w-full' htmlType='submit'>
          Đăng ký
        </Button>
      </Form>
    </>
  );
};

export default RegisterDialog;
