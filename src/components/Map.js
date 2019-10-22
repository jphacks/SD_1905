import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

export class Map extends Component {
  constructor(props){
    super(props);
    this.state = {
      latitude:38.256099,
      longitude:140.84268,
    };
    this.markers = [];
  }

  getCurrentPosition = (obj) => {
    Geolocation.getCurrentPosition(
      obj.successToGetCurrentPosition,
      obj.failToGetCurrentPosition
    );
  }

  successToGetCurrentPosition = (position) => {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }

  failToGetCurrentPosition = (error) => {
    console.warn(`ERROR(${error.code}): ${error.message}`);
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      this.getCurrentPosition(this);
      console.log(this.state.latitude, this.state.longitude);
    },5000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <MapView
        style = {{flex: 1}}
        initialRegion={defaultRegion}
        region={{
          latitude:this.state.latitude,
          longitude:this.state.longitude,
          latitudeDelta:LatitudeDelta,
          longitudeDelta:LongitudeDelta,
        }}
        showsUserLocation={true}
      />
    );
  }
}

const LatitudeDelta = 0.00500;
const LongitudeDelta = 0.00500;

const defaultRegion = {
  latitude: 38.256099,
  longitude: 140.84268,
  latitudeDelta: LatitudeDelta,
  longitudeDelta: LongitudeDelta,
}

const secondRegion = {
  latitude: 38.256099,
  longitude: 140.85268,
  latitudeDelta: LatitudeDelta,
  longitudeDelta: LongitudeDelta,
}