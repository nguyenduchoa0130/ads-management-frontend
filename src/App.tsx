import LazyLoadComponent from "@components/LazyLoadComponent";
import LoadingSpinner from "@components/LoadingSpinner";
import { AdminRole } from "@enums/admin-role";
import { User } from "@interfaces/user";
import AdminLayout from "@layouts/AdminLayout";
import ClientLayout from "@layouts/ClientLayout";
import AdReports from "@pages/officers/departments/AdReports";
import { lazy, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";

// Client
const Home = lazy(() => import("./pages/Home"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

// Admin
const Dashboard = lazy(() => import("./pages/officers/Dashboard"));

// Admin/Department
const Areas = lazy(() => import("./pages/officers/departments/Areas"));
const AdTypes = lazy(() => import("./pages/officers/departments/AdTypes"));
const Accounts = lazy(() => import("./pages/officers/departments/Accounts"));
const AdBoards = lazy(() => import("./pages/officers/departments/AdBoards"));
const Statistics = lazy(
  () => import("./pages/officers/departments/Statistics")
);
const AdPlacements = lazy(
  () => import("./pages/officers/departments/AdPlacements")
);
const AreaAssignment = lazy(
  () => import("./pages/officers/departments/AreaAssignment")
);
const AdApprovalCRList = lazy(
  () => import("./pages/officers/departments/AdApprovalCRList")
);
const AdPermitApprovalList = lazy(
  () => import("./pages/officers/departments/AdPermitApprovalList")
);

const App = () => {
  const user = {
    username: localStorage.getItem("username"),
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
    access_token: localStorage.getItem("access_token"),
  };

  
  


  const routes = useRoutes([
    {
      path: "/can-bo-phuong",
      element: <AdminLayout adminRole={AdminRole.WardOfficer} user={user} />,
      children: [
        {
          path: "thong-tin-ca-nhan",
          element: <LazyLoadComponent component={<MyProfile />} />,
        },
        {
          path: "ql-bao-cao",
          element: <LazyLoadComponent component={<AdReports />} />,
        },
        {
          path: "ql-diem-dat-quang-cao",
          element: <LazyLoadComponent component={<AdPlacements />} />,
        },
        {
          path: "ql-bang-quang-cao",
          element: <LazyLoadComponent component={<AdBoards />} />,
        },
        {
          path: "yc-chinh-sua",
          element: <LazyLoadComponent component={<AdApprovalCRList />} />,
        },
        {
          path: "yc-cap-phep",
          element: <LazyLoadComponent component={<AdPermitApprovalList />} />,
        },
      ],
    },

    {
      path: "/can-bo-quan",
      element: <AdminLayout adminRole={AdminRole.DistrictOfficer} user={user} />,
      children: [
        {
          path: "ql-bao-cao",
          element: <LazyLoadComponent component={<AdReports />} />,
        },
        {
          path: "thong-tin-ca-nhan",
          element: <LazyLoadComponent component={<MyProfile />} />,
        },
        {
          path: "ql-diem-dat-quang-cao",
          element: <LazyLoadComponent component={<AdPlacements />} />,
        },
        {
          path: "ql-bang-quang-cao",
          element: <LazyLoadComponent component={<AdBoards />} />,
        },
        {
          path: "yc-chinh-sua",
          element: <LazyLoadComponent component={<AdApprovalCRList />} />,
        },
        {
          path: "yc-cap-phep",
          element: <LazyLoadComponent component={<AdPermitApprovalList />} />,
        },
      ],
    },
    {
      path: "/can-bo-so-vh-tt",
      element: <AdminLayout adminRole={AdminRole.DepartmentOfficer} user={user} />,
      children: [
        {
          index: true,
          element: <LazyLoadComponent component={<Dashboard />} />,
        },
        {
          path: "thong-ke",
          element: <LazyLoadComponent component={<Statistics />} />,
        },
        {
          path: "ql-khu-vuc",
          element: <LazyLoadComponent component={<Areas />} />,
        },
        {
          path: "ql-danh-sach-loai",
          element: <LazyLoadComponent component={<AdTypes />} />,
        },
        {
          path: "ql-diem-dat-quang-cao",
          element: <LazyLoadComponent component={<AdPlacements />} />,
        },
        {
          path: "ql-bang-quang-cao",
          element: <LazyLoadComponent component={<AdBoards />} />,
        },
        {
          path: "ql-tai-khoan",
          element: <LazyLoadComponent component={<Accounts />} />,
        },
        {
          path: "yc-chinh-sua",
          element: <LazyLoadComponent component={<AdApprovalCRList />} />,
        },
        {
          path: "yc-cap-phep",
          element: <LazyLoadComponent component={<AdPermitApprovalList />} />,
        },
        {
          path: "phan-cong-khu-vuc",
          element: <LazyLoadComponent component={<AreaAssignment />} />,
        },
        {
          path: "ql-bao-cao",
          element: <LazyLoadComponent component={<AdReports />} />,
        },
        {
          path: "thong-tin-ca-nhan",
          element: <LazyLoadComponent component={<MyProfile />} />,
        },
      ],
    },
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        {
          index: true,
          element: <LazyLoadComponent component={<Home />} />,
        },
        // {
        //   path: "thong-tin-ca-nhan",
        //   element: <LazyLoadComponent component={<MyProfile />} />,
        // },
      ],
    },
    {
      path: "*",
      element: <LazyLoadComponent component={<PageNotFound />} />,
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
