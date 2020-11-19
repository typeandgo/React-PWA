import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from 'components/AppLayout';

const Fallback = () => {
  return (
    <AppLayout>
      <h4>We're sorry, this page hasn't been cached yet :/</h4>
      <p>But why don't you try one of our <Link to='/'>other pages</Link>?</p>
    </AppLayout>
  );
};

export default Fallback;

