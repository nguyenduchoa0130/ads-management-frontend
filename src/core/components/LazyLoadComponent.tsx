import { FC, ReactElement, Suspense } from 'react';

interface LazyLoadComponentProps {
  component: ReactElement;
}

const LazyLoadComponent: FC<LazyLoadComponentProps> = ({ component }) => {
  return <Suspense fallback={<div>Loading....</div>}>{component}</Suspense>;
};

export default LazyLoadComponent;
