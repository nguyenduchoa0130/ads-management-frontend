import { Outlet } from 'react-router-dom';
import Header from './Header';

const CitizenLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default CitizenLayout;
