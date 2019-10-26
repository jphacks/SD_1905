import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';const nearDist = 40;

import { SettingScreen } from './SettingScreen.js';

const screen = Dimensions.get('window');
export class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 38.255900,
      longitude: 140.84240,
      latitudeDelta: 0.00520,
      longitudeDelta: 0.00520,
      tmpLatitude: null,
      tmpLongitude: null,
      markers: []
    };
    this.camera = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.11620,
      longitudeDelta: 0.11620
    };
    this.realtimePosition = {
      latitude : 38.255900, 
      longitude : 140.84240
    }

    this.setPosition = this.setPosition.bind(this);
    this.getCurrentPosition().then(this.setPosition);
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

  setPosition(position, update=true) {
    this.realtimePosition = position.coords;
    if(update) {
      const {latitude, longitude} = position.coords;
      this.setState({latitude, longitude});
    }
  }

  loadMarkers = () => {
    // this.fetchLatLong();
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

  checker() {
    this.getCurrentPosition().then((position) => this.setPosition(position, false));
    console.log('you\'re @ (latlng) ' + this.latitude + '/' + this.longitude);
    const c_lat = this.latitude;
    const c_lng = this.longitude;
    storage
      .load({ key: 'mapInfo' })
      .then(res => {
        console.log('informations')
        console.log(res)
        res.map(obj => {
          if (this.isNear(obj, c_lat, c_lng) && this.isTime(obj)) {
            const musicId = obj.musicId;
            this.setState({ musicId: obj.musicId })
            // musicPlay(obj.musicId)
            Alert.alert(obj.musicId)
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

  //  ComponentWillMountで初期化するらしい．調べてみたい．

  movePlace = () => {
    this.getCurrentPosition().then(this.setPosition);
    setTimeout(() => {
      this.setCameraPosition({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: 0.00520,
        longitudeDelta: 0.00520
      })
    }, 500)
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      // this.checker()
    }, 10000);
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
                  <Button titleStyle={{fontWeight: 'bold'}} type="solid" title="Remove" onPress={() => {this.state.markers.splice(index, 1); this.forceUpdate();}} />
                </View>
              </Callout>
            </Marker>

          ))}
        </MapView>
        <View style={{ position: 'absolute', flexDirection: "row", left: 0, right: 0, bottom: 20, justifyContent: 'space-evenly' }}>
          <Button titleStyle={{ fontWeight: 'bold' }} type="solid" title="現在地へ移動" onPress={() => { this.movePlace();}} />
          <Button titleStyle={{ fontWeight: 'bold' }} type="solid" title="forDebug" />
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

})