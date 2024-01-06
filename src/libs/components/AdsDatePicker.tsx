
import { DatePicker, Form } from 'antd';
import { FC } from 'react';
import { Controller } from 'react-hook-form';

interface AdsDatePickerProps {
  error: any;
  rules?: any;
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;

}

const AdsDatePicker: FC<AdsDatePickerProps> = ({
  name,
  rules,
  control,
  error = null,
  label = 'Form Control Label',
  placeholder = 'Calendar placeholder',
  isDisabled = false,
}) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message} >
        
        <Controller
          name={name}
          control={control}
          rules={rules}
          disabled={isDisabled}
          render={({ field }) => (
            <DatePicker
              {...field}
              size='large'
              className='w-100'
              style={{width: "100%"}}
              format='DD/MM/YYYY'
              placeholder={placeholder}
            />
          )}
        />
      </Form.Item>
    </>
  );
};

export default AdsDatePicker;
