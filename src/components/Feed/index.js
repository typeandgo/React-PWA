import React from 'react';
import { Card } from 'antd';

const Feed = () => {

  // const saveFeed = () => {
  //   console.log('Feed saved!');

  //   // MANUAL CACHING (Cahce on demand)
  //   // If you wanted test this, you must disable dynamic caching line started with `cache.put...`
  //   if ('caches' in window) {
  //     caches.open('user-requested')
  //       .then(function(cache) {
  //         cache.add('https://httpbin.org/get');
  //         cache.add('https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')
  //       })
  //   }
  // }

  return (
    <Card
    hoverable
    className='feed'
    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
  >
    <Card.Meta title="Europe Street beat" description="www.instagram.com" />
    {/* <Button onClick={ saveFeed } style={{ float: 'right', marginTop: 10 }}>Save</Button> */}
  </Card>
  );
};

export default Feed;

