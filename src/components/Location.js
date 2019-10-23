import React, { Component } from 'react'
import Geolocation from '@react-native-community/geolocation';

export class Location extends Component {
  constructor(props){
    super(props);
  }

  getCurrentPosition = (obj) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0
    };
    Geolocation.getCurrentPosition(
      obj.successToGetCurrentPosition,
      obj.failToGetCurrentPosition,
      options
    );
  }

  successToGetCurrentPosition = (position) => {
    const _latitude = position.coords.latitude;
    const _longitude = position.coords.longitude;
  }

  failToGetCurrentPosition = (error) => {
    console.warn(`ERROR(${error.code}): ${error.message}`);
  }

  componentDidMount() {
    this.getCurrentPosition(this);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return null
  }
}