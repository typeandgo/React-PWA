import React from 'react';
import axios from 'axios';
import { PropTypes } from 'prop-types';
import { Form, Row, Col, Input, Button, message } from 'antd';

const AddFeed = ({closeAddFeed}) => {
  const [form] = Form.useForm();

  const onFinish = formData => {
    if (formData.title.trim() === '' || formData.location.trim() === '') {
      alert('Please check the inputs!')
    } else {

      const data = {
        id: new Date().toISOString(),
        image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        ...formData
      }

      // If there is no internet connection keep data for bacground sync
      if (!navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
        
        navigator.serviceWorker.ready
          .then(function(sw) {
            window.writeData('sync-feeds', data)
              .then(function() {
                return sw.sync.register('sync-new-feed');
              })
              .then(function() {
                message.info('Your Feed was saved for syncing!');
                closeAddFeed();
              })
              .catch(function(err) {
                console.log('Background sync error: ', err);
              })
          });
          
      } else {

        // Have internet connection so, send data to backend
        axios.post('http://localhost:3004/posts', data).then(function(res) {
          message.success('Sent data!');
          closeAddFeed();
        });
      }
    }
  };

  return (
    <div className='add-feed'>
      <Form 
        id='addFeedForm'
        form={ form }
        className='form form--vertical'
        onFinish={ onFinish }>

        <Row gutter={ 20 }>
          <Col span={ 24 }>
            <Form.Item label='Title' name='title' rules={[{ required: true, message: 'Title can not be empty!' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={ 24 }>
            <Form.Item label='Location' name='location' rules={[{ required: true, message: 'Location can not be empty!' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={ 24 } className='margin-top-20'>
            <Form.Item>
              <Button type='default' className='margin-right-20' onClick={ closeAddFeed } danger>Cancel</Button>
              <Button type='primary' htmlType='submit'>Save</Button>
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </div>
  );
};

export default AddFeed;

AddFeed.propTypes = {
  closeAddFeed: PropTypes.func
}
