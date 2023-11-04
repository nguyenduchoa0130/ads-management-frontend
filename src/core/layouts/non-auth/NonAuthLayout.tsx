import { Outlet } from 'react-router-dom';
import Header from './Header';

const NonAuthLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default NonAuthLayout;
