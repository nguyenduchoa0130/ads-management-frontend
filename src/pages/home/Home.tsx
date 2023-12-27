import { CloseOutlined, MenuOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import AdsMap from '@components/AdsMap';
import { LayoutMenuItem } from '@interfaces/layout-menu-item';
import { Button, Drawer, Menu, Tooltip, Typography } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

const Home = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const menuItems = useMemo(
    (): LayoutMenuItem[] => [
      {
        path: '/dang-nhap',
        activeKey: 'dang-nhap',
        icon: <UserOutlined />,
        label: 'Đăng nhập',
      },
      {
        path: '/dang-ky',
        activeKey: 'dang-ky',
        icon: <PlusCircleOutlined />,
        label: 'Đăng ký tài khoản',
      },
    ],
    [],
  );

  return (
    <>
      <div className='h-screen w-screen relative'>
        <div className='absolute top-0 left-0 z-10  p-2'>
          <Tooltip title='Menu'>
            <Button
              size='large'
              icon={<MenuOutlined />}
              className='bg-white'
              onClick={openMenu}></Button>
          </Tooltip>
        </div>
        <AdsMap />
        <Drawer key='left' open={isOpen} placement='left' closable={false} onClose={closeMenu}>
          <div className='flex items-center justify-between'>
            <Typography.Text className='text-xl font-semibold'>MENU</Typography.Text>
            <Button
              size='large'
              type='text'
              icon={<CloseOutlined />}
              shape='circle'
              onClick={closeMenu}
            />
          </div>
          <hr />
          <Menu mode='vertical' style={{ borderInline: 'none' }}>
            {menuItems.map((item, idx) => (
              <Menu.Item key={`menu-item-${idx}`}>
                <NavLink to={item.path} className='flex items-center'>
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </Drawer>
      </div>
    </>
  );
};

export default Home;
