import {
  HomeOutlined,
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  {
    path: '',
    label: 'Trang chủ',
    activeKey: 'admin',
    icon: <HomeOutlined />,
  },
];

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState('admin');
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  useEffect(() => {
    const segment = location.pathname.split('/').pop();
    setCurrentPage(segment);
  }, [location.pathname]);

  return (
    <>
      <div className='min-h-screen'>
        <Layout hasSider className='bg-white min-h-screen'>
          <div>
            <Layout.Sider
              trigger={null}
              collapsible
              collapsed={isCollapsed}
              className='bg-transparent h-full'>
              <div className='pt-3 h-full bg-white border-r'>
                <div className='flex items-center justify-center pb-2'>
                  <Tooltip title='Menu' placement='right' arrow={true}>
                    <Button
                      type={!isCollapsed ? 'primary' : 'default'}
                      danger={!isCollapsed}
                      onClick={() => setIsCollapsed(!isCollapsed)}>
                      {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>
                  </Tooltip>
                </div>
                <Menu mode='inline' className='p-2'>
                  {menuItems.map((item, idx) => (
                    <Menu.Item
                      key={`menu-item-${idx}`}
                      className={currentPage === item.activeKey ? 'ant-menu-item-selected' : ''}>
                      <NavLink to={item.path} className='flex items-center'>
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
            <div className='h-100'>
              <div className='flex item-center justify-between border-b py-3 px-4'>
                <Typography.Title className='text-capitalize m-0'></Typography.Title>
                <Tooltip title='Đăng xuất' arrow={true}>
                  <Button type='primary' danger size='large' onClick={handleLogout}>
                    <LoginOutlined /> Đăng xuất
                  </Button>
                </Tooltip>
              </div>
              <div className='p-4'>
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
