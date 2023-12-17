import { Form, Select } from 'antd';
import { FC } from 'react';
import { Controller } from 'react-hook-form';

interface FormControlDropdownProps {
  error: any;
  rules?: any;
  control: any;
  name: string;
  label?: string;
  options: any[];
  isMultiple?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  isShowSearch?: boolean;
  isAllowClear?: boolean;
}

const FormControlDropdown: FC<FormControlDropdownProps> = ({
  name,
  rules,
  control,
  options = [],
  error = null,
  isShowSearch,
  isDisabled = false,
  isMultiple = false,
  isAllowClear = true,
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
              size='large'
              options={options}
              disabled={isDisabled}
              placeholder={placeholder}
              showSearch={isShowSearch}
              allowClear={isAllowClear}
              mode={isMultiple ? 'multiple' : null}
            />
          )}
        />
      </Form.Item>
    </>
  );
};

export default FormControlDropdown;
