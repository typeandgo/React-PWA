import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Layout, Menu, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Logo from 'components/Logo';

const Header = () => {

  const { Header } = Layout;
  const history = useHistory();
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };  

  return (
    <Header className='header'>

      <Button className='menu-button' type='link' icon={ <MenuOutlined /> } onClick={showDrawer}></Button>

      <Logo />

      <Drawer placement="left" closable={false} onClose={onClose} visible={visible}>
        <Menu mode="vertical">
        <Menu.Item key="1" onClick={ () => history.replace('/') }>Home</Menu.Item>
        <Menu.Item key="3" onClick={ () => history.replace('/about') }>About</Menu.Item>
        { 
          'Notification' in window // Support PN
          &&
          <Menu.Item key="4">
            <Button onClick={ null }>Enable Notifications</Button>
          </Menu.Item>
        }
      </Menu>
      </Drawer>
    </Header>
  );
};

export default Header;

