import { Button, Modal } from 'antd';
import { FC, ReactElement } from 'react';

interface AdsFormModalProps {
  isOpen: boolean;
  title?: string;
  children?: ReactElement;
  width?: number | string;
  cancelBtnText?: string;
  confirmBtnText?: string;
  onSubmit?: () => any;
  onCancel?: () => any;
}

const AdsFormModal: FC<AdsFormModalProps> = ({
  width,
  title,
  isOpen,
  children,
  cancelBtnText,
  confirmBtnText,
  onCancel,
  onSubmit,
}) => {
  return (
    <>
      <Modal
        open={isOpen}
        title={title || 'Modal title'}
        footer={null}
        onCancel={onCancel}
        centered
        width={width || 520}>
        <hr />
        <div className='p-1'>{children}</div>
        <hr />
        <div className='flex items-center justify-between mt-2'>
          <Button danger htmlType='button' onClick={onCancel} size='large'>
            {cancelBtnText || 'Cancel'}
          </Button>
          <Button size='large' htmlType='submit' onClick={onSubmit}>
            {confirmBtnText || 'Ok'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AdsFormModal;
