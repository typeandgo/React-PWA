import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

const Feed = ({ data }) => {
  return (
    <Card
    hoverable
    className='feed'
    cover={<img alt="example" src={ data.image } />}
  >
    <Card.Meta title={ data.title } description={ data.location } />
  </Card>
  );
};

Feed.propTypes = {
  data: PropTypes.object
}

export default Feed;

