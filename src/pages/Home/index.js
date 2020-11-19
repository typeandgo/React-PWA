/* eslint-disable react-hooks/exhaustive-deps */
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
  const apiUrl = 'https://httpbin.org/get';
  let dataReceivedFromNetwork = false;

  const closeAddFeed = () => {
    const addFeedContainer = document.querySelector('.add-feed');
    addFeedContainer.classList.add('add-feed--slide-down')
    setTimeout(() => {
      addFeedContainer.classList.remove('add-feed--slide-down');
      setShowAddFeed(false);
    }, 390)
  }

  const loadFeedsFromNetork = async () => {
    try {
      await axios.get(apiUrl);
      dataReceivedFromNetwork = true;
      setFeedsLoaded(true);
      console.log('Data from network');

    } catch (err) {
      console.log('Fetch error: ', err);
    }
  }

  // STRATEGY: Cache then network
  const loadFeedsFromCache = () => {
    if ('caches' in window) {
      caches.match(apiUrl)
        .then(function(response) {
          if (response) {
            return response.json();
          }
        })
        .then(function(data) {
          if (!dataReceivedFromNetwork) {
            setFeedsLoaded(true);
            console.log('Data from cache');
          }
        })
    }
  }
 
  useEffect(() => {
    loadFeedsFromCache();
    loadFeedsFromNetork();
  }, []);

  return (
    <AppLayout>
      { feedsLoaded && <Feed /> }

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

