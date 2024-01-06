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
  hasCustomFooter?: boolean;
}

const AdsFormModal: FC<AdsFormModalProps> = ({
  width,
  title,
  isOpen,
  children,
  cancelBtnText,
  confirmBtnText,
  hasCustomFooter,
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
        {!hasCustomFooter && (
          <>
            <hr />
            <div className='flex items-center justify-between mt-3'>
              <Button danger htmlType='button' onClick={onCancel} size='large'>
                {cancelBtnText || 'Đóng'}
              </Button>
              <Button type='primary' size='large' htmlType='submit' onClick={onSubmit}>
                {confirmBtnText || 'Ok'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default AdsFormModal;
