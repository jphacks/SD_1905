import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import moment from "moment";
import Spotify from 'rn-spotify-sdk';

import { SettingScreen } from './SettingScreen.js';

const nearDist = 100;
const screen = Dimensions.get('window');

export class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      latitudeDelta: defaultLatitudeDelta,
      longitudeDelta: defaultLongitudeDelta,
      tmpLatitude: null,
      tmpLongitude: null,
      markers: [],
      settingInfo: {}
    };
    this.camera = {
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      latitudeDelta: defaultLatitudeDelta,
      longitudeDelta: defaultLongitudeDelta
    };
    this.realtimePosition = {
      latitude : defaultLatitude, 
      longitude : defaultLongitude
    }

    this.settingInfo = {};
    this.selectedMarkerId = 0;
    this.selectedMarker = {
      id: "0",
      coordinate: {latitude: null, longitude: null},
      date: "2016-05-15",
      time: "8:16 PM",
      musicId: "your world is",
      title: "title"
    }

    this.loadMarkers = this.loadMarkers.bind(this);

    this.moveToCurrentPosition();
    this.loadMarkers()
  }

  setCameraPosition = (region) => {
    this.camera = region
  }

  syncCameraPosition = () => {
    this.setState({
      latitude: this.camera.latitude,
      longitude: this.camera.longitude,
      latitudeDelta: this.camera.latitudeDelta,
      longitudeDelta: this.camera.longitudeDelta,
    })
  }

  getCurrentPosition() {
    options = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0
    };
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  async setPosition(position, update=true) {
    this.realtimePosition = position.coords;
    if(update) {
      const {latitude, longitude} = position.coords;
      this.setCameraPosition({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: defaultLatitudeDelta,
        longitudeDelta: defaultLongitudeDelta
      })
      this.syncCameraPosition();
    }
    return position;
  }

  async loadMarkers() {
    const markers = await global.storage.load({ key: 'mapInfo' });
    this.setState({markers});
    console.log(markers);
    
    // TODO: この形式にしたがって、Calloutにタイトルをつける
    // global.storage
    //   .load({ key: 'mapInfo' })
    //   .then(res => {
    //     newMarkers = [];
    //     res.map(obj => {
    //       newMarkers.push(
    //         {
    //           // key: Date.now(),
    //           id: obj.id,
    //           latlng: {
    //             latitude: obj.coordinate.latitude,
    //             longitude: obj.coordinate.longitude
    //           },
    //           title: "♪ " + obj.musicId,
    //           description: "date:" + obj.time.date + ' time: ' + obj.time.time
    //         }
    //       )
    //     })
    //     this.setState({ markers: newMarkers })
    //   })
    //   .catch(err => console.warn(err))
  }

  async storeMarker(marker) {
    let markers = await global.storage.load({ key: 'mapInfo' });

    // TODO: O(n) -> O(1) ：キー情報を付与するなどして
    let exist = false;
    for(let i = 0; i < markers.length; i++) {
      if(markers[i].id !== marker.id)  continue;
      exist = true;
      markers[i] = marker;
      break;
    }
    if(!exist)  markers.push(marker);
    await global.storage.save({ key: 'mapInfo', data: markers });
    this.loadMarkers();
  }

  isNear(obj, c_lat, c_lng) {
    const dist = getDistance(
      {latitude: obj.coordinate.latitude, longitude: obj.coordinate.longitude},
      {latitude: c_lat, longitude: c_lng}
    );
    console.log("dist: " + dist);
    if(dist <= nearDist){
      return true;
    } else {
      return false;
    }
  }

  isDateTime(obj) {
    const {date, time} = obj;
    const now = new Date()
    const currentDate = moment(now).format("YYYY-MM-DD");
    const currentTime = moment(now).format("h:mm A")

    let isDate = false
    let isTime = false

    if (date == null || date == currentDate) isDate = true;
    if (time == null || time == currentTime) isTime = true;

    if (isDate == true && isTime == true) {
      return true;
    } else {
      return false;
    }
  }

  musicPlay = (spotifyURI) => {
    Spotify.playURI(spotifyURI, 0, 0);
  }

  async checker() {
    const playbackState = Spotify.getPlaybackState();
    if (playbackState != null && playbackState.playing) return;

    const position = await this.getCurrentPosition().then((position) => this.setPosition(position, false));
    const {latitude, longitude} = position.coords;
    console.log('you\'re @ (latlng) ' + latitude + '/' + longitude);
    global.storage
      .load({ key: 'mapInfo' })
      .then(res => {
        console.log('informations')
        // console.log(res)
        res.map(obj => {
          // console.log(obj);
          if (this.isNear(obj, latitude, longitude) && this.isDateTime(obj)) {
            const musicId = obj.musicId;
            this.setState({ musicId: obj.musicId })
            // musicPlay(obj.musicId)
            // Alert.alert(obj.musicId)
            console.log('hit!! ' + obj.musicId)
            if (obj.spotifyURI != null) {
              this.musicPlay(obj.spotifyURI)
            }
          }
          else {
            console.log('not hit ...')
          }
        })
      })
      .catch(err => console.warn(err))
  }

  closeModal = () => {
    this.refs.modal.close();
  }

  async moveToCurrentPosition() {
    await this.getCurrentPosition().then((position) => this.setPosition(position, true));
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.checker()
    }, 10000);
  }

  async moveMarker(index, coordinate) {
    const {latitude, longitude} = coordinate;
    let markers = await global.storage.load({ key: 'mapInfo' });
    markers[index].coordinate = {latitude, longitude};
    global.storage.save({ key: 'mapInfo', data: markers });
    this.loadMarkers();
  }

  async removeMarker(index) {
    let markers = await global.storage.load({ key: 'mapInfo' });
    markers.splice(index, 1);
    global.storage.save({ key: 'mapInfo', data: markers });
    this.loadMarkers();
  }

  async storeCurrentPosition() {
    const position = await this.getCurrentPosition().then(position => this.setPosition(position, false));
    const {latitude, longitude} = position.coords;
    this.openSettingsModal({coordinate: {latitude, longitude}});
  }

  // TODO: 取り除く（デバッグ用だから要らない子）
  removeAllMarkers() {
    global.storage.save({key: 'mapInfo', data: []});
    this.setState({markers: []});
  }

  async openSettingsModal(info) {
    await this.setState({settingInfo: info});
    this.refs.modal.open();
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
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          userLocationAnnotationTitle={""}
          onRegionChangeComplete={(position) => { this.setCameraPosition(position); }}
          onLongPress={ event => {
            this.syncCameraPosition();
            const settingInfo = {coordinate : event.nativeEvent.coordinate};
            this.openSettingsModal(settingInfo);
          }
          }
        >
          {this.state.markers.map((marker, index) => (
            <Marker draggable
              identifier={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              onDragEnd={(event) => {this.moveMarker(index, event.nativeEvent.coordinate)}}
              onPress={() => {this.setState({settingInfo: this.state.markers[index]})}}
              // onPress={this.selectedMarker = this.state.markers[index]}
            >
              <Callout>
                <View>
                  <Text>{this.state.markers[index].title + " : " + index}</Text>
                  <Button titleStyle={{fontWeight: 'bold'}} type="solid" title="Remove" onPress={() => { this.removeMarker(index); }} />
                  <Button titleStyle={{fontWeight: 'bold'}} type="solid" title="Edit" onPress={() => { this.openSettingsModal(this.state.settingInfo); }} />
                </View>
              </Callout>
            </Marker>

          ))}
        </MapView>

        <View style={{ position: 'absolute', flexDirection: "row", left: 0, right: 0, bottom: 60, justifyContent: 'space-evenly' }}>
          <Button titleStyle={{ fontWeight: 'bold', fontSize: 13.5 }} type="solid" title="現在地へ移動" onPress={() => { this.moveToCurrentPosition();}} />
          <Button titleStyle={{ fontWeight: 'bold', fontSize: 13.5 }} type="solid" title="ここで登録" onPress={() => { this.storeCurrentPosition(); }} />
          <Button titleStyle={{ fontWeight: 'bold', fontSize: 13.5 }} type="solid" title="forDebug" />
          <Button titleStyle={{ fontWeight: 'bold', fontSize: 13.5 }} type="solid" title="ピンを削除" onPress={() => {this.removeAllMarkers();}}/>
          <Button titleStyle={{ fontWeight: 'bold', fontSize: 13.5 }} type="solid" title="停止" onPress={() => {Spotify.setPlaying(false);}}/>
        </View>
        <Modal style={styles.modal} position={"bottom"} ref={"modal"} swipeArea={20}>
          <ScrollView width={screen.width}>
            <SettingScreen
              storeMarker={this.storeMarker}
              closeModal={this.closeModal}
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
  Main: {
    flex: 1
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 500,
  },
  calloutView: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    width: "40%",
    marginLeft: "30%",
    marginRight: "30%",
    marginTop: 20
  },
  calloutSearch: {
    borderColor: "transparent",
    marginLeft: 10,
    width: "90%",
    marginRight: 10,
    height: 40,
    borderWidth: 0.0}
})

const defaultLatitude = 38.260132;
const defaultLongitude = 140.882432;
const defaultLatitudeDelta = 0.00520
const defaultLongitudeDelta = 0.00520