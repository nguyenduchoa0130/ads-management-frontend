import { Spin } from 'antd';

const LoadingSpinner = () => {
  return (
    <>
      <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
        <Spin tip='Loading...' size='large' />
      </div>
    </>
  );
};

export default LoadingSpinner;
