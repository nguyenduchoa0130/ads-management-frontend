import { useRoutes } from 'react-router-dom';
import LazyLoadComponent from '@components/LazyLoadComponent';

// Layouts
import CitizenLayout from '@layouts/citizen';
import DepartmentLayout from '@layouts/department';
import NonAuthLayout from '@layouts/non-auth';
import WardLayout from '@layouts/ward';
import { lazy } from 'react';

// Lazy components
const Home = lazy(() => import('./pages/home'));

const App = () => {
  const routes = useRoutes([
    {
      path: '',
      element: <NonAuthLayout />,
      children: [
        {
          path: '',
          index: true,
          element: <LazyLoadComponent component={<Home />} />,
        },
      ],
    },
    {
      path: '/citizen',
      element: <CitizenLayout />,
      children: [],
    },
    {
      path: '/ward',
      element: <WardLayout />,
      children: [],
    },
    {
      path: 'department',
      element: <DepartmentLayout />,
      children: [],
    },
  ]);
  return <>{routes}</>;
};

export default App;
