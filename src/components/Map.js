import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Spotify from 'rn-spotify-sdk';

import { getCurrentPosition } from '../lib/location';
import Pin from './Pin.js';

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const DEFAULT_LATITUDE = 38.260132;
const DEFAULT_LONGITUDE = 140.882432;
const DEFAULT_LATITUDE_DELTA = 0.00700;
const DEFAULT_LONGITUDE_DELTA = DEFAULT_LATITUDE_DELTA * ASPECT_RATIO;

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      },
    };
    this.moveToCurrentPosition();
  }

  moveMarker = async (index, coordinate) => {
    const { latitude, longitude } = coordinate;
    let markers = this.props.markers;
    markers[index].coordinate = { latitude, longitude };
    global.storage.save({ key: 'mapInfo', data: markers });
    this.props.loadMarkers();
  }

  removeMarker = async (index) => {
    let markers = this.props.markers;
    markers.splice(index, 1);
    global.storage.save({ key: 'mapInfo', data: markers });
    this.props.loadMarkers();
  }

  // TODO: 取り除く（デバッグ用だから要らない子）
  removeAllMarkers = () => {
    global.storage.save({ key: 'mapInfo', data: [] });
    this.props.loadMarkers();
  }

  moveToCurrentPosition = async () => {
    getCurrentPosition()
      .then((position) => {
        const region = Object.assign({}, position.coords, { latitudeDelta: DEFAULT_LATITUDE_DELTA, longitudeDelta: DEFAULT_LONGITUDE_DELTA });
        this.map.animateToRegion(region);
      });
  }

  registerCurrentPosition = async () => {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    this.props.openSettingsModal({ coordinate: { latitude, longitude } });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_DEFAULT}
          ref={ref => { this.map = ref; }}
          style={{ flex: 1 }}
          initialRegion={this.state.region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          userLocationAnnotationTitle={""}
          onLongPress={event => {
            const settingInfo = { coordinate: event.nativeEvent.coordinate };
            this.props.openSettingsModal(settingInfo);
          }}
        >
          {this.props.markers.map((marker, index) => (
            <Pin
              key={index}
              marker={marker}
              moveMarker={(coords) => { this.moveMarker(index, coords); }}
              removeMarker={() => { this.removeMarker(index); }}
              openSettingsModal={() => { this.props.openSettingsModal(marker); }}
              playMusic={() => { this.props.playMusic(marker.music.spotifyID); }}
            />
          ))}
        </MapView>

        <View style={styles.buttonContainer}>
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="現在地へ移動" onPress={this.moveToCurrentPosition} />
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="ここで登録" onPress={this.registerCurrentPosition} />
          {/* <Button titleStyle={styles.bottomButtonTitle} type="solid" title="ピンを削除" onPress={() => {this.removeAllMarkers();}}/> */}
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="再生" onPress={() => { Spotify.setPlaying(true); }} />
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="停止" onPress={() => { Spotify.setPlaying(false); }} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    flexDirection: "row",
    left: 0,
    right: 0,
    bottom: 60,
    justifyContent: 'space-evenly'
  },

  bottomButtonTitle: {
    fontWeight: 'bold',
    fontSize: 13.5
  }
})
