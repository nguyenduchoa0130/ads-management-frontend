import { Outlet } from 'react-router-dom';
import Header from './Header';

const DistrictLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default DistrictLayout;
