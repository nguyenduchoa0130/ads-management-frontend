import LazyLoadComponent from '@components/LazyLoadComponent';
import AdminLayout from '@layouts/admin/AdminLayout';
import ClientLayout from '@layouts/client/ClientLayout';
import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const Home = lazy(() => import('./pages/home'));

const App = () => {
  const routes = useRoutes([
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [],
    },
    {
      path: '/',
      element: <ClientLayout />,
      children: [
        {
          index: true,
          element: <LazyLoadComponent component={<Home />} />,
        },
      ],
    },
  ]);
  return <>{routes}</>;
};

export default App;
