import { useAppDispatch } from '@appHook/hooks';
import AdsCheckbox from '@components/AdsCheckbox';
import AdsInput from '@components/AdsInput';
import AlertType from '@enums/alert-type';
import AlertService from '@services/alert.service';
import { AuthService } from '@services/auth.service';
import { sharedActions } from '@slices/shared.slice';
import { Button, Form, Typography } from 'antd';
import { useForm } from 'react-hook-form';

const LoginDialog = ({handleClose = (isOpen, user)=> {},  resetPassword = () => {}}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '', isRemember: true } });
  
  const login = async (formValue) => {
    try {
      console.log(formValue);
      const res = await AuthService.login(formValue);
      const msg = res?.message;
      AlertService.showMessage(AlertType.Success, msg);
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('username', res.responseData.username);
      localStorage.setItem('email', res.responseData?.email);
      localStorage.setItem('role', res.responseData?.role);
      localStorage.setItem('name', res.responseData?.name);

      

      handleClose(false, res.responseData);
      
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    }
   
   
  };

  return (
    <>
      <Form layout='vertical' className='pt-3' onFinish={handleSubmit(login)}>
        <AdsInput
          name='username'
          label='Email'
          control={control}
          error={errors.email}
          placeholder='Nhập tên đăng nhập'
          rules={{
            required: 'Vui lòng nhập tên đăng nhập',
            // pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' },
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
          <Typography.Paragraph onClick={resetPassword} className='text-blue-500 cursor-pointer hover:opacity-75 transition-opacity' >
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
