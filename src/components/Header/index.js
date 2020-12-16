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
      badge: '/images/icons/favicon-96x96.png',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        {
          action: 'confirm',
          title: 'Okay',
          icon: '/images/icons/favicon-96x96.png'
        },
        {
          action: 'cancel',
          title: 'Cancel',
          icon: '/images/icons/favicon-96x96.png'
        }
      ]
    };

    // 1- JS Way
    // new Notification(title, options);

    // 2- SW Way
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(swreg => {
          swreg.showNotification(title, options)
        })
    }
  }

  const configurePushSubscription = () => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    let reg;

    navigator.serviceWorker.ready
      .then(function(swreg) {

        reg = swreg;

        return swreg.pushManager.getSubscription();
      })
      .then(function(sub) {
        if (sub === null) { 
          // Create a new subscription
          
          const vapidPublicKey = 'BD2k_zhm8yAPvG2Egzxf6t_PMeXEmhkbQSZK8e5NDV6Zca6GJbZ75-tefkRj7IVATLQtGAp8Ufdp8NH9dyleGC8';
          const convertedVapidPublicKey = window.urlBase64ToUint8Array(vapidPublicKey);

          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidPublicKey
          });

        } else { 
          // We have a subscription
          // So do nothing
        }
      })
      .then(function(newSub) {
        return fetch('http://localhost:3004/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(newSub)
        })
      })
      .then(function(res) {
        if (res.ok) {
          displayConfirmNotification();
        }
      })
      .catch(function(err) {
        console.log('Subscription error: ', err);
      });
  };

  const askForNotificationPermission = () => {
    Notification.requestPermission(result => {

      console.log('User choice: ', result);

      if (result !== 'granted') {

        console.log('No notification permission granted!');

      } else {

        configurePushSubscription();
        //displayConfirmNotification();
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

