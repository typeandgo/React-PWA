import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AppLayout from 'components/AppLayout';
import Feed from 'components/Feed';
import AddFeed from 'components/AddFeed';
import { installationBanner } from 'utils/installationBanner';

const Home = () => {
  const [showAddFeed, setShowAddFeed] = useState(false);
  const [feedsLoaded, setFeedsLoaded] = useState(false);

  const closeAddFeed = () => {
    const addFeedContainer = document.querySelector('.add-feed');
    addFeedContainer.classList.add('add-feed--slide-down')
    setTimeout(() => {
      addFeedContainer.classList.remove('add-feed--slide-down');
      setShowAddFeed(false);
    }, 390)
  }

  const loadFeeds = async () => {
    try {
      const result = await axios.get('https://httpbin.org/get');
      console.log('result: ', result.data);

      setFeedsLoaded(true);

    } catch (err) {
      console.log('Fetch error: ', err);

      setFeedsLoaded(false);
    }
  }

  useEffect(() => {
    loadFeeds();
  }, []);

  return (
    <AppLayout>
      { feedsLoaded &&
        <>
          <Feed />
          <Feed />
          <Feed />
          <Feed />
        </>
      }

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

