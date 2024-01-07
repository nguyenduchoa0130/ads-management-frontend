import {
  CloseOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "@appHook/hooks";
import AdsFormModal from "@components/AdsFormModal";
import AdsMap from "@components/AdsMap";
import LoginDialog from "@dialogs/LoginDialog";
import RegisterDialog from "@dialogs/Register";
import ResetPassword from "@dialogs/ResetPassword";
import AlertType from "@enums/alert-type";
import { selectCurrentUser } from "@selectors/shared.selectors";
import AlertService from "@services/alert.service";

import { sharedActions } from "@slices/shared.slice";
import { Button, Drawer, Menu, Tooltip, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const Home = () => {
  const [dialogDetail, setDialogDetail] = useState({
    isOpen: false,
    dialogName: null,
    dialogTitle: "",
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = {
    username: localStorage.getItem("username"),
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
    token: localStorage.getItem("access_token"),
  };

  const [user, setUser] = useState(currentUser);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openActionDialog = (dialogName: string) => {
    let dialogTitle = "";
    if (dialogName === "login") {
      dialogTitle = "ĐĂNG NHẬP";
    }
    if (dialogName === "register") {
      dialogTitle = "XÁC NHẬN TÀI KHOẢN";
    }
    if (dialogName === "reset-password") {
      dialogTitle = "THAY ĐỔI MẬT KHẨU";
    }
    setIsOpen(false);
    setDialogDetail({ isOpen: true, dialogTitle, dialogName });
  };

  const closeActionDialog = () => {
    setDialogDetail({ isOpen: false, dialogTitle: null, dialogName: null });
  };

  const logout = () => {
    // dispatch(sharedActions.setCurrentUser(null));
    localStorage.clear();
    setMenuItems([
      {
        action: "openDialog",
        dialogName: "login",
        isLoggedIn: false,
        icon: <LoginOutlined />,
        label: "Đăng nhập",
      },

      {
        isLoggedIn: true,
        action: "function",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
      },
    ]);
    if (user.username)
      AlertService.showMessage(AlertType.Success, "ĐĂNG XUẤT THÀNH CÔNG");
    navigate("/");
  };

  const [menuItems, setMenuItems] = useState(() => {
    let nav = [];
    if (currentUser.username) {
      nav = [
        {
          action: "navigate",
          path: "/thong-tin-ca-nhan",
          isLoggedIn: true,
          icon: <UserOutlined />,
          label: "Thông tin tài khoản",
        },
        // {
        //   action: 'openDialog',
        //   dialogName: 'register',
        //   isLoggedIn: false,
        //   icon: <PlusCircleOutlined />,
        //   label: 'Đăng ký tài khoản',
        // },

        {
          isLoggedIn: true,
          action: "function",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
        },
      ];
    } else {
      nav = [
        {
          action: "openDialog",
          dialogName: "login",
          isLoggedIn: false,
          icon: <LoginOutlined />,
          label: "Đăng nhập",
        },
        // {
        //   action: "navigate",
        //   path: "/thong-tin-ca-nhan",
        //   isLoggedIn: true,
        //   icon: <UserOutlined />,
        //   label: "Thông tin tài khoản",
        // },
        // {
        //   action: 'openDialog',
        //   dialogName: 'register',
        //   isLoggedIn: false,
        //   icon: <PlusCircleOutlined />,
        //   label: 'Đăng ký tài khoản',
        // },

        {
          isLoggedIn: true,
          action: "function",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
        },
      ];
    }

    return nav;
  });

  return (
    <>
      <div className="h-screen w-screen relative">
        <div className="absolute top-0 left-0 z-10  p-2">
          <Tooltip title="Menu">
            <Button
              size="large"
              icon={<MenuOutlined />}
              className="bg-white"
              onClick={openMenu}
            ></Button>
          </Tooltip>
        </div>
        <AdsMap isHomePage={true} />
        <Drawer
          key="left"
          open={isOpen}
          placement="left"
          closable={false}
          onClose={closeMenu}
        >
          <div className="flex items-center justify-between">
            <Typography.Text className="text-xl font-semibold">
              MENU
            </Typography.Text>
            <Button
              danger
              size="large"
              type="text"
              icon={<CloseOutlined />}
              shape="circle"
              onClick={closeMenu}
            />
          </div>
          <hr className="my-2" />
          <Menu mode="vertical" style={{ borderInline: "none" }}>
            {menuItems.map((item, idx) => {
              switch (item.action) {
                case "openDialog": {
                  return (
                    <Menu.Item
                      key={`menu-item-${idx}`}
                      onClick={() => openActionDialog(item.dialogName)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Menu.Item>
                  );
                }
                case "navigate": {
                  return (
                    <Menu.Item key={`menu-item-${idx}`}>
                      <NavLink to={item.path}>
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </Menu.Item>
                  );
                }
                case "function": {
                  return (
                    <Menu.Item key={`menu-item-${idx}`} onClick={logout}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Menu.Item>
                  );
                }
              }
            })}
          </Menu>
        </Drawer>
      </div>
      <AdsFormModal
        width={"40vw"}
        hasCustomFooter
        isOpen={dialogDetail.isOpen}
        title={dialogDetail.dialogTitle}
        onCancel={closeActionDialog}
      >
        <>
          {dialogDetail.dialogName === "login" && (
            <LoginDialog
              handleClose={(isOpen, user) => {
                setDialogDetail({
                  isOpen: isOpen,
                  dialogTitle: null,
                  dialogName: null,
                });
                setUser(user);

                setMenuItems([
                  {
                    action: "navigate",
                    path: "/thong-tin-ca-nhan",
                    isLoggedIn: true,
                    icon: <UserOutlined />,
                    label: "Thông tin tài khoản",
                  },

                  {
                    isLoggedIn: true,
                    action: "function",
                    icon: <LogoutOutlined />,
                    label: "Đăng xuất",
                  },
                ]);
              }}
              resetPassword = {() => {
                openActionDialog('register')
              }}
              
            />
          )}
          {dialogDetail.dialogName === "register" && <RegisterDialog handleOpenDialog={(user) => (
                openActionDialog('reset-password')
          )} />}
          {dialogDetail.dialogName === "reset-password" && <ResetPassword handleClose={(isOpen) => {
                openActionDialog('login')

          }} />}
        </>
      </AdsFormModal>
    </>
  );
};

export default Home;
