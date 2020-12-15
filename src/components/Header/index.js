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

  const displayConfirmNotification = () => {
    const title = 'Successfully subscribed';
    const options = {
      body: 'You successfully subscribed to our notification service.',
      icon: '/images/icons/favicon-96x96.png',
      image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
      dir: 'ltr',
      lang: 'en-US',
      vibrate: [100, 50, 100, 50],
      badge: '/images/icons/favicon-96x96.png'
    };

    // 1- JS Way
    // new Notification(title, options);

    // 2- SW Way
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(swreq => {
          swreq.showNotification(title, options)
        })
    }
  }

  const askForNotificationPermission = () => {
    Notification.requestPermission(result => {
      console.log('User choice: ', result);
      if (result !== 'granted') {
        console.log('No notification permission granted!');
      } else {
        displayConfirmNotification();
      };
    });
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
            <Button onClick={ askForNotificationPermission }>Enable Notifications</Button>
          </Menu.Item>
        }
      </Menu>
      </Drawer>
    </Header>
  );
};

export default Header;

