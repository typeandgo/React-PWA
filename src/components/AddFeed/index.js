/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { PropTypes } from 'prop-types';
import { Form, Row, Col, Input, Button, message, Upload } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';

const AddFeed = ({closeAddFeed, loadData}) => {
  const [form] = Form.useForm();
  const playerRef = useRef(null);
  const canvasRef = useRef(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showCaptureButton, setShowCaptureButton] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [image, setImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [showGetLocationButton, setShowGetLocationButton] = useState(false);
  const [isGeoLocationLoading, setIsGeoLocationLoading] = useState(false);
  const [fetchedLocation, setFetchedLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    initializeMedia();
    initializeLocation();
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

  const initializeLocation = () => {
    if ('geolocation' in navigator) {
      setShowGetLocationButton(true);
    }
  }

  const getLocation = () => {

    setShowGetLocationButton(false);
    setIsGeoLocationLoading(true);

    navigator.geolocation.getCurrentPosition(position => {

      setFetchedLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      form.setFieldsValue({
        location: 'İstanbul'
      });

      setIsGeoLocationLoading(false);

    }, err => {

      setShowGetLocationButton(true);
      setIsGeoLocationLoading(false);
      setFetchedLocation({lat: 0, lng: 0});
      message.error('Could not fetch the location, please enter manually!');
      console.log('Geolocation error: ', err);

    }, { timeout: 7000 });
  }

  const onFinish = formData => {
    if (formData.title.trim() === '' || formData.location.trim() === '') {
      alert('Please check the inputs!')
    } else {

      const data = {
        id: new Date().toISOString(),
        image: image,
        rawLocation: fetchedLocation,
        ...formData
      }

      axios.post('http://localhost:3004/posts', data).then(function(res) {
        message.success('Sent data!');
        loadData();
        onClose();
      });
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
    setImage(canvasRef.current.toDataURL());
    stopVideoStream();
    setShowVideoPlayer(false);
    setShowCaptureButton(false);
  }

  const onClose = () => {
    if (showVideoPlayer) {
      stopVideoStream();
    }
    setShowImagePicker(false);
    setShowVideoPlayer(false);
    setShowCaptureButton(false);
    closeAddFeed();
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const converAndSetImage = async file => {
    const image = await toBase64(file);
    console.log('image: ', image);
    setImage(image);
  };

  const onRemove = file => {
    const index = fileList.indexOf(file);
    let newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const beforeUpload = file => {
    
    setFileList([file]);
    converAndSetImage(file);

    return false;
  };

  const onUploadChange = e => {
    console.log('e: ', e);
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
            <h6 className='margin-top-20'>Picak an image</h6>
            <Upload
              accept='image/*'
              fileList={ fileList }
              onRemove={ onRemove }
              beforeUpload={ beforeUpload }
              onChange={ onUploadChange }
            >
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
              <Input addonAfter={ 
                showGetLocationButton 
                  ? <Button size='small' onClick={ getLocation }>Get Location</Button> 
                  : (isGeoLocationLoading ? <LoadingOutlined /> : false) } />
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
  closeAddFeed: PropTypes.func,
  loadData: PropTypes.func
}
