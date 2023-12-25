import { selectIsLoading } from '@selectors/shared.selectors';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';

const LoadingSpinner = () => {
  const isLoading = useSelector(selectIsLoading);
  return (
    <>
      {isLoading && (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
          <Spin tip='Loading...' size='large' />
        </div>
      )}
    </>
  );
};

export default LoadingSpinner;
