import AdminLayout from '@layouts/admin/AdminLayout';
import ClientLayout from '@layouts/client/ClientLayout';
import { useRoutes } from 'react-router-dom';

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
      children: [],
    },
  ]);
  return <>{routes}</>;
};

export default App;
