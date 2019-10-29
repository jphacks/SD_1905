import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import moment from "moment";
import Spotify from 'rn-spotify-sdk';

import SettingScreen from './SettingScreen.js';

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const NEAR_DIST = 100;
const DEFAULT_LATITUDE = 38.260132;
const DEFAULT_LONGITUDE = 140.882432;
const DEFAULT_LATITUDE_DELTA = 0.00700;
const DEFAULT_LONGITUDE_DELTA = DEFAULT_LATITUDE_DELTA * ASPECT_RATIO;
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 0
};

export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      },
      markers: [],
      settingInfo: {},
      dontPlay: false
    };

    this.moveToCurrentPosition();
    this.loadMarkers = this.loadMarkers.bind(this);
    this.loadMarkers();
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.checker()
    }, 10000);
  }

  async loadMarkers() {
    const markers = await global.storage.load({ key: 'mapInfo' });
    this.setState({ markers });
    console.log(markers);
  }

  async storeMarker(marker) {
    let markers = await global.storage.load({ key: 'mapInfo' });

    // TODO: O(n) -> O(1) ：キー情報を付与するなどして
    let exist = false;
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].id !== marker.id) continue;
      exist = true;
      markers[i] = marker;
      break;
    }
    if (!exist) markers.push(marker);
    await global.storage.save({ key: 'mapInfo', data: markers });
    this.loadMarkers();
  }

  isNear(tarLat, tarLng, curLat, curLng) {
    const dist = getDistance(
      { latitude: tarLat, longitude: tarLng },
      { latitude: curLat, longitude: curLng }
    );
    console.log("dist: " + dist);
    if (dist <= NEAR_DIST) return true;
    else return false;
  }

  isDateTime(date, time) {
    const now = new Date();
    const curDate = moment(now).format("YYYY-MM-DD");
    const curTime = moment(now).format("h:mm A");

    let isDate = false;
    let isTime = false;

    if (date == null || date == curDate) isDate = true;
    if (time == null || time == curTime) isTime = true;

    if (isDate == true && isTime == true) return true;
    else return false;
  }

  playMusic = async (spotifyID) => {
    const spotifyURI = "spotify:track:" + spotifyID;
    Spotify.playURI(spotifyURI, 0, 0)
      .then(() => {
        // success
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  async checker() {
    const playbackState = Spotify.getPlaybackState();
    if (playbackState != null && playbackState.playing) return;
    if (this.state.dontPlay) return;

    const position = await this.getCurrentPosition();
    const { latitude, longitude } = position.coords;
    console.log('you\'re @ (latlng) ' + latitude + '/' + longitude);
    global.storage
      .load({ key: 'mapInfo' })
      .then(res => {
        console.log('informations');
        res.map(obj => {
          if (this.isNear(obj.coordinate.latitude, obj.coordinate.longitude, latitude, longitude) && this.isDateTime(obj.time.date, obj.time.time)) {
            console.log('hit!! ' + obj.music.title);
            if (obj.music.spotifyID != null) this.playMusic(obj.music.spotifyID);
          }
          else {
            console.log('not hit ...');
          }
        })
      })
      .catch((err) => { console.warn(err) });
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => { Geolocation.getCurrentPosition(resolve, reject, GEOLOCATION_OPTIONS); });
  }

  async moveToCurrentPosition() {
    this.getCurrentPosition()
      .then((position) => {
        const region = Object.assign({}, position.coords, { latitudeDelta: DEFAULT_LATITUDE_DELTA, longitudeDelta: DEFAULT_LONGITUDE_DELTA });
        this.map.animateToRegion(region);
      });
  }

  async moveMarker(index, coordinate) {
    const { latitude, longitude } = coordinate;
    let markers = await global.storage.load({ key: 'mapInfo' });
    markers[index].coordinate = { latitude, longitude };
    global.storage.save({ key: 'mapInfo', data: markers });
    this.loadMarkers();
  }

  async removeMarker(index) {
    let markers = await global.storage.load({ key: 'mapInfo' });
    markers.splice(index, 1);
    global.storage.save({ key: 'mapInfo', data: markers });
    this.loadMarkers();
  }

  // TODO: 取り除く（デバッグ用だから要らない子）
  removeAllMarkers() {
    global.storage.save({ key: 'mapInfo', data: [] });
    this.setState({ markers: [] });
  }

  async registerCurrentPosition() {
    const position = await this.getCurrentPosition();
    const { latitude, longitude } = position.coords;
    this.openSettingsModal({ coordinate: { latitude, longitude } });
  }

  async openSettingsModal(info) {
    await this.setState({ settingInfo: info });
    this.refs.modal.open();
  }

  closeSettingsModal = () => {
    this.refs.modal.close();
  }

  render() {
    return (
      <View style={styles.main}>
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
            this.openSettingsModal(settingInfo);
          }}
        >
          {this.state.markers.map((marker, index) => (
            <Marker draggable
              key={index}
              identifier={marker.id}
              coordinate={marker.coordinate}
              title={marker.music.title}
              onDragEnd={(event) => { this.moveMarker(index, event.nativeEvent.coordinate) }}
              onPress={() => {
                this.setState({ settingInfo: this.state.markers[index] });
              }}>
              <Callout>
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.jacket}>
                      <Image source={{ uri: this.state.markers[index].music.imageUrl }} style={{ width: 60, height: 60, marginRight: 8 }} />
                    </View>
                    <View>
                      <Text>{'Title: ' + this.state.markers[index].music.title}</Text>
                      <Text>{'Artist: ' + this.state.markers[index].music.artist}</Text>
                      <Text>{'Time: ' + this.state.markers[index].time.time}</Text>
                      <Text>{'Date: ' + this.state.markers[index].time.date}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 10 }}>
                    <Button buttonStyle={{ backgroundColor: 'red' }} titleStyle={{ fontSize: 13, fontWeight: 'bold' }} type="solid" title="Remove" onPress={() => { this.removeMarker(index); }} />
                    <Button titleStyle={{ fontSize: 13, fontWeight: 'bold' }} type="solid" title="Edit" onPress={() => { this.openSettingsModal(this.state.settingInfo); }} />
                    <Button titleStyle={{ fontSize: 13, fontWeight: 'bold' }} type="solid" title="再生" onPress={() => { this.setState({ dontPlay: false }); this.playMusic(this.state.markers[index].music.spotifyID); }} />
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        <View style={{ position: 'absolute', flexDirection: "row", left: 0, right: 0, bottom: 60, justifyContent: 'space-evenly' }}>
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="現在地へ移動" onPress={() => { this.moveToCurrentPosition(); }} />
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="ここで登録" onPress={() => { this.registerCurrentPosition(); }} />
          {/* <Button titleStyle={styles.bottomButtonTitle} type="solid" title="ピンを削除" onPress={() => {this.removeAllMarkers();}}/> */}
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="再生" onPress={() => { Spotify.setPlaying(true); this.setState({ dontPlay: false }); }} />
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="停止" onPress={() => { Spotify.setPlaying(false); this.setState({ dontPlay: true }); }} />
        </View>

        <Modal style={styles.modal} position={"bottom"} ref={"modal"} swipeArea={20}>
          <ScrollView width={SCREEN.width}>
            <SettingScreen
              storeMarker={this.storeMarker}
              closeModal={this.closeSettingsModal}
              loadMarkers={this.loadMarkers}
              info={this.state.settingInfo}
            />
          </ScrollView>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    // color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  main: {
    flex: 1
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
  bottomButtonTitle: {
    fontWeight: 'bold',
    fontSize: 13.5
  }
})
