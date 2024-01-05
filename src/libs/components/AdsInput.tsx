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
  isDisabled?: boolean;
  isHidden?: boolean;
}

const AdsInput: FC<AdsInputProps> = ({
  name,
  rules,
  control,
  error = null,
  placeholder = '',
  isDisabled = false,
  isPassword = false,
  isHidden = false,
  label = 'Form Control Label',
}) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message} hidden={isHidden}>
        <Controller
          name={name}
          rules={rules}
          control={control}
          render={({ field }) =>
            isPassword ? (
              <Input.Password
                {...field}
                size='large'
                disabled={isDisabled}
                placeholder={placeholder}
              />
            ) : (
              <Input {...field} size='large' disabled={isDisabled} placeholder={placeholder} />
            )
          }
        />
      </Form.Item>
    </>
  );
};

export default AdsInput;
