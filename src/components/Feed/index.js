import React from 'react';
import { Card } from 'antd';

const Feed = () => {
  return (
    <Card
    hoverable
    className='feed'
    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
  >
    <Card.Meta title="Europe Street beat" description="www.instagram.com" />
  </Card>
  );
};

export default Feed;

