import LazyLoadComponent from '@components/LazyLoadComponent';
import LoadingSpinner from '@components/LoadingSpinner';
import { AdminRole } from '@enums/admin-role';
import AdminLayout from '@layouts/AdminLayout';
import ClientLayout from '@layouts/ClientLayout';
import PageNotFound from '@pages/page-not-found';
import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// Client
const Home = lazy(() => import('./pages/home'));

// Admin/Department
const Areas = lazy(() => import('./pages/officers/departments/Areas'));
const AdTypes = lazy(() => import('./pages/officers/departments/AdTypes'));
const Accounts = lazy(() => import('./pages/officers/departments/Accounts'));
const AdBoards = lazy(() => import('./pages/officers/departments/AdBoards'));
const Statistics = lazy(() => import('./pages/officers/departments/Statistics'));
const AdPlacements = lazy(() => import('./pages/officers/departments/AdPlacements'));
const AreaAssignment = lazy(() => import('./pages/officers/departments/AreaAssignment'));
const AdApprovalCRList = lazy(() => import('./pages/officers/departments/AdApprovalCRList'));
const AdPermitApprovalList = lazy(
  () => import('./pages/officers/departments/AdPermitApprovalList'),
);

const App = () => {
  const routes = useRoutes([
    {
      path: '/can-bo-phuong',
      element: <AdminLayout adminRole={AdminRole.WardOfficer} />,
      children: [],
    },
    {
      path: '/can-bo-quan',
      element: <AdminLayout adminRole={AdminRole.DistrictOfficer} />,
      children: [],
    },
    {
      path: '/can-bo-so-vh-tt',
      element: <AdminLayout adminRole={AdminRole.DepartmentOfficer} />,
      children: [
        {
          path: 'thong-ke',
          element: <LazyLoadComponent component={<Statistics />} />,
        },
        {
          path: 'ql-khu-vuc',
          element: <LazyLoadComponent component={<Areas />} />,
        },
        {
          path: 'ql-danh-sach-loai',
          element: <LazyLoadComponent component={<AdTypes />} />,
        },
        {
          path: 'ql-diem-dat-quang-cao',
          element: <LazyLoadComponent component={<AdPlacements />} />,
        },
        {
          path: 'ql-bang-quang-cao',
          element: <LazyLoadComponent component={<AdBoards />} />,
        },
        {
          path: 'ql-tai-khoan',
          element: <LazyLoadComponent component={<Accounts />} />,
        },
        {
          path: 'yc-chinh-sua',
          element: <LazyLoadComponent component={<AdApprovalCRList />} />,
        },
        {
          path: 'yc-cap-phep',
          element: <LazyLoadComponent component={<AdPermitApprovalList />} />,
        },
        {
          path: 'phan-cong-khu-vuc',
          element: <LazyLoadComponent component={<AreaAssignment />} />,
        },
      ],
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
    {
      path: '*',
      element: <PageNotFound />,
    },
  ]);
  return (
    <>
      {routes}
      <LoadingSpinner />
    </>
  );
};

export default App;
