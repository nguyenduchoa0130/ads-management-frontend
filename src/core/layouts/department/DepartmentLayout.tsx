import { Outlet } from 'react-router-dom';
import Header from './Header';

const DepartmentLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default DepartmentLayout;
