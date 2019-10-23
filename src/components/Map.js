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
    this.getCurrentPosition(this);
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
    this.setState({
      latitude: _latitude,
      longitude: _longitude
    });
  }

  failToGetCurrentPosition = (error) => {
    console.warn(`ERROR(${error.code}): ${error.message}`);
  }

  movePlace() {
    this.getCurrentPosition(this);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <MapView
          provider = {PROVIDER_DEFAULT}
          style = {{flex: 1}}
          region={{
            latitude:this.state.latitude,
            longitude:this.state.longitude,
            latitudeDelta:LatitudeDelta,
            longitudeDelta:LongitudeDelta,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        />
        <View style={{height: 40}}>
          <Button title="現在地へ移動" onPress={() => this.movePlace()} />
        </View>
      </View>
    );
  }
}

const LatitudeDelta = 0.00520;
const LongitudeDelta = 0.00520;