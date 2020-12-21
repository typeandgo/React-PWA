/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { PropTypes } from 'prop-types';
import { Form, Row, Col, Input, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AddFeed = ({closeAddFeed}) => {
  const [form] = Form.useForm();
  const playerRef = useRef(null);
  const canvasRef = useRef(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showCaptureButton, setShowCaptureButton] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    initializeMedia();
  }, []);

  const initializeMedia = () => {
    if (!('mediaDevices' in navigator)) {
      navigator.mediaDevices = {};
    };

    if (!('getUserMedia' in navigator.mediaDevices)) {
      navigator.mediaDevices.getUserMedia = constraints => {
        const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented!'))
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        })
      }
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        setShowVideoPlayer(true);
        setShowCaptureButton(true);
        playerRef.current.srcObject = stream;
      })
      .catch(err => {
        setShowImagePicker(true);
      });
  };

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
                onClose();
              })
              .catch(function(err) {
                console.log('Background sync error: ', err);
              })
          });
      } else {

        // Have internet connection so, send data to backend
        axios.post('http://localhost:3004/posts', data).then(function(res) {
          message.success('Sent data!');
          onClose();
        });
      }
    }
  };

  const stopVideoStream = () => {
    playerRef.current.srcObject.getVideoTracks().forEach(track => {
      track.stop();
    });
  }

  const captureImage = () => {
    setShowCanvas(true);
    const context = canvasRef.current.getContext('2d');
    context.drawImage(playerRef.current, 0, 0, canvasRef.current.width, playerRef.current.videoHeight / (playerRef.current.videoWidth / canvasRef.current.width));
    stopVideoStream();
    setShowVideoPlayer(false);
    setShowCaptureButton(false);
  }

  const onClose = () => {
    stopVideoStream();
    setShowImagePicker(false);
    setShowVideoPlayer(false);
    setShowCaptureButton(false);
    closeAddFeed();
  }

  return (
    <div className='add-feed'>
      <Form 
        id='addFeedForm'
        form={ form }
        className='form form--vertical'
        onFinish={ onFinish }>

        <div id='pick-image' className='text-center'>
          

          <video ref={ playerRef } autoPlay={ true } style={{ width: 320, height: 240, display: showVideoPlayer ? 'block' : 'none' }} className='margin-0-auto'></video>
          <Button type='primary' className='margin-0-auto margin-top-20' onClick={ captureImage } style={{ display: showCaptureButton ? 'block' : 'none' }}>Capture</Button>
          <canvas ref={ canvasRef } width='320' height='240' style={{ display: showCanvas ? 'block' : 'none' }} className='margin-0-auto'></canvas>
    
          
          { 
            showImagePicker
            && <>
            <h6 className='margin-top-20'>Picak an image instead</h6>
            <Upload accept='image/*'>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </> 
          }

        </div>

        <Row gutter={ 20 }>
          <Col span={ 24 }>
            <Form.Item label='Title' name='title' rules={[{ required: true, message: 'Title can not be empty!' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={ 24 }>
            <Form.Item label='Location' name='location' rules={[{ required: true, message: 'Location can not be empty!' }]}>
              <Input addonAfter={ <Button size='small'>Get Location</Button> } />
            </Form.Item>
          </Col>

          <Col span={ 24 } className='margin-top-20'>
            <Form.Item>
              <Button type='default' className='margin-right-20' onClick={ onClose } danger>Cancel</Button>
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
