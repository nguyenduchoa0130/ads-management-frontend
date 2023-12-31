import {
  AppstoreOutlined,
  BarChartOutlined,
  DownOutlined,
  EditOutlined,
  FlagOutlined,
  FormOutlined,
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { AdminRole } from "@enums/admin-role";
import { LayoutMenuItem } from "@interfaces/layout-menu-item";
import { User } from "@interfaces/user";
import titleMap from "@utils/title-map.util";
import { Button, Dropdown, Layout, Menu, Tooltip, Typography } from "antd";
import { FC, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const DEPARTMENT_OFFICER_MENU: LayoutMenuItem[] = [
  {
    path: "thong-ke",
    label: "Thống kê",
    activeKey: "thong-ke",
    icon: <BarChartOutlined />,
  },
  {
    path: "ql-tai-khoan",
    label: "Quản lý tài khoản",
    activeKey: "ql-tai-khoan",
    icon: <TeamOutlined />,
  },
  {
    path: "ql-bao-cao",
    label: "Quản lý báo cáo",
    activeKey: "ql-bao-cao",
    icon: <WarningFilled />,
  },
  {
    path: "ql-khu-vuc",
    label: "Quản lý khu vực",
    activeKey: "ql-khu-vuc",
    icon: <PieChartOutlined />,
  },
  {
    path: "phan-cong-khu-vuc",
    label: "Phân công khu vực",
    activeKey: "phan-cong-khu-vuc",
    icon: <FormOutlined />,
  },
  {
    path: "ql-danh-sach-loai",
    label: "Quản lý danh sách loại",
    activeKey: "ql-danh-sach-loai",
    icon: <UnorderedListOutlined />,
  },
  {
    path: "ql-diem-dat-quang-cao",
    label: "Quản lý điểm đặt quảng cáo",
    activeKey: "ql-diem-dat-quang-cao",
    icon: <FlagOutlined />,
  },
  {
    path: "ql-bang-quang-cao",
    label: "Quản lý bảng quảng cáo",
    activeKey: "ql-bang-quang-cao",
    icon: <AppstoreOutlined />,
  },
  {
    path: "yc-chinh-sua",
    label: "Yêu cầu chỉnh sửa quảng cáo",
    activeKey: "yc-chinh-sua",
    icon: <EditOutlined />,
  },
  {
    path: "yc-cap-phep",
    label: "Yêu cầu cấp phép quảng cáo",
    activeKey: "yc-cap-phep",
    icon: <QuestionCircleOutlined />,
  },
];
const WARD_OFFICER_MENU: LayoutMenuItem[] = [
  {
    path: "ql-bao-cao",
    label: "Quản lý báo cáo",
    activeKey: "ql-bao-cao",
    icon: <WarningFilled />,
  },

  {
    path: "ql-diem-dat-quang-cao",
    label: "Quản lý điểm đặt quảng cáo",
    activeKey: "ql-diem-dat-quang-cao",
    icon: <FlagOutlined />,
  },
  {
    path: "ql-bang-quang-cao",
    label: "Quản lý bảng quảng cáo",
    activeKey: "ql-bang-quang-cao",
    icon: <AppstoreOutlined />,
  },
  // {
  //   path: "yc-chinh-sua",
  //   label: "Yêu cầu chỉnh sửa quảng cáo",
  //   activeKey: "yc-chinh-sua",
  //   icon: <EditOutlined />,
  // },
   {
    path: "yc-cap-phep",
    label: "Yêu cầu cấp phép quảng cáo",
    activeKey: "yc-cap-phep",
    icon: <QuestionCircleOutlined />,
  },
];
const DISTRICT_OFFICER_MENU: LayoutMenuItem[] = [
  {
    path: "ql-bao-cao",
    label: "Quản lý báo cáo",
    activeKey: "ql-bao-cao",
    icon: <WarningFilled />,
  },

  {
    path: "ql-diem-dat-quang-cao",
    label: "Quản lý điểm đặt quảng cáo",
    activeKey: "ql-diem-dat-quang-cao",
    icon: <FlagOutlined />,
  },
  {
    path: "ql-bang-quang-cao",
    label: "Quản lý bảng quảng cáo",
    activeKey: "ql-bang-quang-cao",
    icon: <AppstoreOutlined />,
  },
  // {
  //   path: "yc-chinh-sua",
  //   label: "Yêu cầu chỉnh sửa quảng cáo",
  //   activeKey: "yc-chinh-sua",
  //   icon: <EditOutlined />,
  // },
   {
    path: "yc-cap-phep",
    label: "Yêu cầu cấp phép quảng cáo",
    activeKey: "yc-cap-phep",
    icon: <QuestionCircleOutlined />,
  },
];
interface AdminLayoutProps {
  adminRole: AdminRole;
  user: any;
}

const AdminLayout: FC<AdminLayoutProps> = ({ adminRole, user }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState("admin");
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const handleInfo = () => {
    
    switch (Number.parseInt(user.role)) {
      case 1: {
        navigate("/can-bo-phuong/thong-tin-ca-nhan");
        break;
      }
      case AdminRole.DistrictOfficer: {
        navigate("/can-bo-quan/thong-tin-ca-nhan");
        break;
      }
      case AdminRole.DepartmentOfficer: {
        navigate("/can-bo-so-vh-tt/thong-tin-ca-nhan");
        break;
      }
    }
  };
  const menuItems = useMemo((): LayoutMenuItem[] => {
    switch (adminRole) {
      case AdminRole.WardOfficer: {
        return WARD_OFFICER_MENU;
      }
      case AdminRole.DistrictOfficer: {
        return DISTRICT_OFFICER_MENU;
      }
      case AdminRole.DepartmentOfficer: {
        return DEPARTMENT_OFFICER_MENU;
      }
    }
  }, []);

  const dropdownMenuItems = useMemo(() => {
    return [
      {
        key: "1",
        label: (
          <Tooltip title="Đăng xuất" arrow={true}>
            <Button
              type="primary"
              danger
              size="large"
              onClick={handleLogout}
              className="w-full"
            >
              <LoginOutlined /> Đăng xuất
            </Button>
          </Tooltip>
        ),
      },
      {
        key: "2",
        label: (
          <Tooltip arrow={true}>
            <Button
              type="primary"
              size="large"
              onClick={handleInfo}
              className="w-full btn"
            >
              <UserOutlined /> Thông tin cá nhân
            </Button>
          </Tooltip>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    if (!user?.role || !(user?.role == adminRole)) {
      navigate("/not-found");
    }
    const segment = location.pathname.split("/").pop();
    setCurrentPage(segment);
  }, [location.pathname]);

  return (
    <>
      <div className="min-h-screen">
        <Layout hasSider className="bg-white min-h-screen">
          <div>
            <Layout.Sider
              trigger={null}
              collapsible
              collapsed={isCollapsed}
              className={`bg-transparent h-full !w-fit ${
                !isCollapsed ? "!max-w-fit" : null
              }`}
            >
              <div
                className="py-4 h-full bg-white"
                style={{ borderRight: "1px solid #ddd" }}
              >
                <div className="flex items-center justify-center pb-3">
                  <Tooltip title="Menu" placement="right" arrow={true}>
                    <Button
                      size="large"
                      type={!isCollapsed ? "primary" : "default"}
                      danger={!isCollapsed}
                      onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                      {isCollapsed ? (
                        <MenuUnfoldOutlined />
                      ) : (
                        <MenuFoldOutlined />
                      )}
                    </Button>
                  </Tooltip>
                </div>
                <Menu
                  mode="inline"
                  className="p-2"
                  style={{ borderInlineEnd: "none" }}
                >
                  {menuItems.map((item, idx) => (
                    <Menu.Item
                      key={`menu-item-${idx}`}
                      className={
                        currentPage === item.activeKey
                          ? "ant-menu-item-selected"
                          : ""
                      }
                    >
                      <NavLink to={item.path} className="flex items-center">
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </Menu.Item>
                  ))}
                </Menu>
              </div>
            </Layout.Sider>
          </div>
          <Layout.Content>
            <div className="h-100">
              <div className="flex item-center justify-between border-b py-3 px-4 h-[69px]">
                <Typography.Title className="!m-0 uppercase">
                  {titleMap.get(currentPage)}
                </Typography.Title>
                <div className="flex items-center justify-center">
                  <Dropdown
                    arrow
                    menu={{
                      items: dropdownMenuItems,
                    }}
                    placement="bottom"
                  >
                    <Button
                      type="text"
                      size="large"
                      icon={<DownOutlined />}
                      className="flex  flex-row-reverse items-center justify-center gap-2"
                    >
                      <span className="font-medium text-green-500">
                        {user.name}
                      </span>
                      <span>Xin chào,</span>
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <div className="p-4">
                <Outlet />
              </div>
            </div>
          </Layout.Content>
        </Layout>
      </div>
    </>
  );
};

export default AdminLayout;
