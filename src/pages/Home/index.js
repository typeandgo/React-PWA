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
  const [feedsData, setFeedsData] = useState([]);
  const apiUrl = 'http://localhost:3004/posts';
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
      const result = await axios.get(apiUrl);
      dataReceivedFromNetwork = true;
      setFeedsData(result.data);
      console.log('Data from network: ', result.data);

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
            setFeedsData(data || []);
            console.log('Data from cache: ', data);
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
      { 
        feedsData.map(feed => <Feed key={ feed.id } data={ feed } />)
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

