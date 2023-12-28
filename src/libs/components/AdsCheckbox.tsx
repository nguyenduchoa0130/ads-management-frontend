import { Checkbox, Form } from 'antd';
import { FC } from 'react';
import { Controller } from 'react-hook-form';

interface AdsCheckboxProps {
  label: string;
  error: any;
  control: any;
  name: string;
}

const AdsCheckbox: FC<AdsCheckboxProps> = ({ name, control, label, error }) => {
  return (
    <>
      <Form.Item validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox {...field} checked={field.value}>
              {label}
            </Checkbox>
          )}
        />
      </Form.Item>
    </>
  );
};

export default AdsCheckbox;
