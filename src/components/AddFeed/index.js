import React from 'react';
import { PropTypes } from 'prop-types';
import { Form, Row, Col, Input, Button } from 'antd';

const AddFeed = ({closeAddFeed}) => {
  const [form] = Form.useForm();

  const onFinish = formData => {
    if (formData.title.trim() === '' || formData.location.trim() === '') {
      alert('Please check the inputs!')
    }
  }

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
