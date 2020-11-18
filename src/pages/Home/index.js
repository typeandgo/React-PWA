import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AppLayout from 'components/AppLayout';
import Feed from 'components/Feed';
import AddFeed from 'components/AddFeed';
import { installationBanner } from 'utils/installationBanner';

const Home = () => {
  const [showAddFeed, setShowAddFeed] = useState(false);

  const closeAddFeed = () => {
    const addFeedContainer = document.querySelector('.add-feed');
    addFeedContainer.classList.add('add-feed--slide-down')
    setTimeout(() => {
      addFeedContainer.classList.remove('add-feed--slide-down');
      setShowAddFeed(false);
    }, 390)
  }

  return (
    <AppLayout>
      <Feed />
      <Feed />
      <Feed />
      <Feed />
      <Button className='btn-add-feed' danger onClick={ () => {
        setShowAddFeed(true);
        installationBanner();
      } }><PlusOutlined /></Button>
      {
        showAddFeed && <AddFeed closeAddFeed={ closeAddFeed } />
      }
    </AppLayout>
  );
};

export default Home;

