import { Form, Input } from 'antd';
import { FC } from 'react';
import { Controller } from 'react-hook-form';

interface AdsInputProps {
  error: any;
  rules?: any;
  control: any;
  name: string;
  label?: string;
  isPassword?: boolean;
  placeholder?: string;
}

const AdsInput: FC<AdsInputProps> = ({
  name,
  rules,
  control,
  error = null,
  placeholder = '',
  isPassword = false,
  label = 'Form Control Label',
}) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          rules={rules}
          control={control}
          render={({ field }) =>
            isPassword ? (
              <Input.Password placeholder={placeholder} {...field} size='large' />
            ) : (
              <Input placeholder={placeholder} {...field} size='large' />
            )
          }
        />
      </Form.Item>
    </>
  );
};

export default AdsInput;
