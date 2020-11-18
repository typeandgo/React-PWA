import React from 'react';
import { Layout } from 'antd';
import Header from 'components/Header'

const AppLayout = props => {
  return (
    <Layout>
      <Header />
      <Layout.Content className='content'>{ props.children }</Layout.Content>
    </Layout>
  );
};

export default AppLayout;
