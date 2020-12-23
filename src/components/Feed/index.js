import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'antd';

const Feed = ({ data }) => {
  const saveFeed = () => {
    console.log('Feed saved!');

    // MANUAL CACHING (Cahce on demand)
    // If you wanted test this, you must disable dynamic caching line started with `cache.put...`
    if ('caches' in window) {
      caches.open('user-requested')
        .then(function(cache) {
          cache.add('http://localhost:3004/posts');
          cache.add('https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')
        })
      }
    }

  return (
    <Card
    hoverable
    className='feed'
    cover={<img alt="example" src={ data.image } />}
  >
    <Card.Meta title={ data.title } description={ data.location } />
    <Button onClick={ saveFeed } style={{ float: 'right', marginTop: 10 }}>Save</Button>
  </Card>
  );
};

Feed.propTypes = {
  data: PropTypes.object
}

export default Feed;

