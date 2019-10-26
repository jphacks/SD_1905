import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';

import { SettingScreen } from './SettingScreen.js';

const nearDist = 40;
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
      markers: []
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

  loadMarkers = () => {
    global.storage
      .load({ key: 'mapInfo' })
      .then(res => {
        newMarkers = [];
        res.map(obj => {
          newMarkers.push(
            {
              // key: Date.now(),
              id: obj.id,
              latlng: {
                latitude: obj.place.latitude,
                longitude: obj.place.longitude
              },
              title: "♪ " + obj.musicId,
              description: "date:" + obj.time.date + ' time: ' + obj.time.time
            }
          )
        })
        this.setState({ markers: newMarkers })
      })
      .catch(err => console.warn(err))
  }

  storeNewdata = (obj) => {
    global.storage
      .load({ key: 'mapInfo' })
      .then(res => {
        ret = res;
        ret = res.concat(obj);
        // console.log("created data (obj)");
        // console.log(tmp);
        global.storage.save({
          key:
            'mapInfo',
          data: ret
        })
          .then(() => {
            this.loadMarkers();
          })
      })
      .catch(err => {
        global.storage.save(
          {
            key:
              'mapInfo',
            data: obj
          }
        )
          .then(() => {
            this.loadMarkers();
          });
        console.warn(err);
      })
  }

  isNear(obj, c_lat, c_lng) {
    const dist = getDistance(
      {latitude: obj.place.latitude, longitude: obj.place.longitude},
      {latitude: c_lat, longitude: c_lng}
    );
    console.log(dist);
    if(dist <= nearDist){
      return true;
    }
    else {
      return false;
    }
  }

  isTime(obj) {
    let date = null;
    let time = null;
    if ((obj.time.date = date && obj.time.time == time) || 1) {
      return true;
    }
    else {
      return false;
    }
  }

  async checker() {
    const position = await this.getCurrentPosition().then((position) => this.setPosition(position, false));
    const {latitude, longitude} = position.coords;
    console.log('you\'re @ (latlng) ' + latitude + '/' + longitude);
    global.storage
      .load({ key: 'mapInfo' })
      .then(res => {
        console.log('informations')
        console.log(res)
        res.map(obj => {
          console.log(obj);
          if (this.isNear(obj, latitude, longitude) && this.isTime(obj)) {
            const musicId = obj.musicId;
            this.setState({ musicId: obj.musicId })
            // musicPlay(obj.musicId)
            // Alert.alert(obj.musicId)
            console.log('hit!! ' + obj.musicId)
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

  async removeMarker(index) {
    let markers = await global.storage.load({ key: 'mapInfo' });
    markers.splice(index, 1);
    global.storage.save({ key: 'mapInfo', data: markers });
    this.loadMarkers();
  }

  storeCurrentPosition() {
    this.setState({tmpLatitude: this.state.latitude, tmpLongitude: this.state.longitude});
    this.refs.modal.open();
  }

  // TODO: 取り除く（デバッグ用だから要らない子）
  removeAllMarkers() {
    global.storage.save({key: 'mapInfo', data: []});
    this.setState({markers: []});
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
          userLocationAnnotationTitle={"My Location"}
          onRegionChangeComplete={(position) => { this.setCameraPosition(position); }}
          onLongPress={(coords, pos) => {
            this.setState({
              tmpLatitude: coords.nativeEvent.coordinate.latitude,
              tmpLongitude: coords.nativeEvent.coordinate.longitude
            });
            this.syncCameraPosition();
            this.refs.modal.open();
          }
          }
        >
          {this.state.markers.map((marker, index) => (
            <Marker
              identifier={marker.id}
              coordinate={marker.latlng}
              title={marker.title}
            >
              <Callout>
                <View>
                  <Text>{this.state.markers[index].description + " : " + index}</Text>
                  <Button titleStyle={{fontWeight: 'bold'}} type="solid" title="Edit" onPress={() => {this.refs.modal.open();}} />
                  <Button titleStyle={{fontWeight: 'bold'}} type="solid" title="Remove" onPress={() => { this.removeMarker(index); }} />
                </View>
              </Callout>
            </Marker>

          ))}
        </MapView>

        <View style={{ position: 'absolute', flexDirection: "row", left: 0, right: 0, bottom: 20, justifyContent: 'space-evenly' }}>
          <Button titleStyle={{ fontWeight: 'bold', fontSize: 13.5 }} type="solid" title="現在地へ移動" onPress={() => { this.moveToCurrentPosition();}} />
          <Button titleStyle={{ fontWeight: 'bold', fontSize: 13.5 }} type="solid" title="ここで登録" onPress={() => { this.storeCurrentPosition(); }} />
          <Button titleStyle={{ fontWeight: 'bold', fontSize: 13.5 }} type="solid" title="forDebug" />
          <Button titleStyle={{ fontWeight: 'bold', fontSize: 13.5 }} type="solid" title="ピンを削除" onPress={() => {this.removeAllMarkers();}}/>
        </View>
        <Modal style={styles.modal} position={"bottom"} ref={"modal"} swipeArea={20}>
          <ScrollView width={screen.width}>
            <SettingScreen
              storeNewData={this.storeNewdata}
              closeModal={this.closeModal}
              loadMarkers={this.loadMarkers}
              lat={this.state.tmpLatitude} lng={this.state.tmpLongitude}/>
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

const defaultLatitude = 38.255900;
const defaultLongitude = 140.84240;
const defaultLatitudeDelta = 0.00520
const defaultLongitudeDelta = 0.00520