import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { throwStatement } from '@babel/types';
import { Map } from './components/Map.js'

export class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 38.255900,
      longitude: 140.84240,
      markers: []
    };
    this.getCurrentPosition(this);
    this.loadMarkers()
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

  loadMarkers = () => {
    storage
      .load({ key: 'mapInfo' })
      .then(res => {
        newMarkers = [];
        console.log('informations')
        console.log(res)
        console.log('markers')
        res.map(obj => {
          newMarkers.push(
            {
              latlng: {
                latitude: obj.place.latitude,
                longitude: obj.place.longitude
              },
              title: "information",
              description: obj.musicId
            }
          )
        })
        console.log(newMarkers)
        this.setState({ markers: newMarkers })
      })
      .catch(err => console.warn(err))
  }

  render() {
    return (
      <View style={styles.Main}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: LatitudeDelta,
            longitudeDelta: LongitudeDelta,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {this.state.markers.map(marker => (
            <Marker
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
        <Button title="Load Markers" onPress={this.loadMarkers} />
      </View>
    )
  }
}

const LatitudeDelta = 0.00720;
const LongitudeDelta = 0.00720;
const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  Main: {
    flex: 1
  },
})