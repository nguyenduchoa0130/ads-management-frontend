import { Form, Select } from 'antd';
import { FC } from 'react';
import { Controller } from 'react-hook-form';

interface FormControlDropdownProps {
  error: any;
  rules?: any;
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  isShowSearch?: boolean;
  options: any[];
}

const FormControlDropdown: FC<FormControlDropdownProps> = ({
  name,
  rules,
  control,
  options = [],
  error = null,
  isShowSearch,
  label = 'Form Control Label',
  placeholder = 'Dropdown placeholder',
}) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Select
              {...field}
              placeholder={placeholder}
              options={options}
              showSearch={isShowSearch}
              size='large'
            />
          )}
        />
      </Form.Item>
    </>
  );
};

export default FormControlDropdown;
