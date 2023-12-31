import AdsInput from "@components/AdsInput";
import AlertType from "@enums/alert-type";
import AlertService from "@services/alert.service";
import { AuthService } from "@services/auth.service";
import { Button, Form } from "antd";
import { useForm } from "react-hook-form";

const RegisterDialog = ({ handleOpenDialog }) => {
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "", passwordConfirm: "" },
  });

  const register = async (formValue) => {
    const res = await AuthService.verifyUsername(formValue);
    const msg = res?.message;
    AlertService.showMessage(AlertType.Success, msg);
    handleOpenDialog(formValue);
  };

  return (
    <>
      <Form
        layout="vertical"
        className="pt-3"
        onFinish={handleSubmit(register)}
      >
        <AdsInput
          name="username"
          label="Username"
          control={control}
          error={errors.username}
          placeholder="Nhập username"
          rules={{
            required: "Vui lòng nhập email",
            // pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' },
          }}
        />
        {/* <AdsInput
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
        /> */}
        <Button
          type="primary"
          size="large"
          className="w-full"
          htmlType="submit"
        >
          Xác nhận
        </Button>
      </Form>
    </>
  );
};

export default RegisterDialog;
