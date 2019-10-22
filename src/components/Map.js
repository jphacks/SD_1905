import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

export class Map extends Component {
  constructor(props){
    super(props);
    this.state = {
      latitude:38.255900,
      longitude:140.84240,
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

  componentWillMount() {
    this.getCurrentPosition(this);
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      this.getCurrentPosition(this);
    },1000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <MapView
        provider = {PROVIDER_DEFAULT}
        style = {{flex: 1}}
        initialRegion={{
          latitude:this.state.latitude,
          longitude:this.state.longitude,
          latitudeDelta:LatitudeDelta,
          longitudeDelta:LongitudeDelta,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      />
    );
  }
}

const LatitudeDelta = 0.00520;
const LongitudeDelta = 0.00520;