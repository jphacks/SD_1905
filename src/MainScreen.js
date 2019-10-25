import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { Marker } from 'react-native-maps';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { throwStatement } from '@babel/types';
import { Map } from './components/Map.js'
import Modal from 'react-native-modalbox';
import { SettingScreen } from './SettingScreen.js';

const screen = Dimensions.get('window');

export class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 38.255900,
      longitude: 140.84240,
      latitudeDelta:0.00520,
      longitudeDelta:0.00520,
      markers: []
    };
    this.camera = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.00520,
      longitudeDelta: 0.00520
    };
    this.latitude = 38.255900;
    this.longitude = 140.84240;
    console.log("state: " + this.state.latitude + ' ' + this.state.longitude)
    console.log("val: " + this.latitude + ' ' + this.longitude)
    setTimeout(() => { this.getCurrentPosition(this); this.fetchLatLong(); }, 2000);
    this.loadMarkers()
  }

  fetchLatLong = () => {
    this.setState({
      latitude: this.latitude,
      longitude: this.longitude
    })
  }

  getCurrentPosition = (obj) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0
    };
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords
        obj.latitude = latitude;
        obj.longitude = longitude;
      },
      (error) => {
        console.warn(`ERROR(${error.code}): ${error.message}`);
      },
      options
    );
  }

  loadMarkers = () => {
    // this.fetchLatLong();
    storage
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
        // console.log('markers')
        // console.log(newMarkers)
        this.setState({ markers: newMarkers })
      })
      .catch(err => console.warn(err))
  }

  storeNewdata(obj) {
    console.log("push new data ");
    console.log(obj);
    tmp = [];
    global.storage
      .load({ key: 'mapInfo' })
      .then(res => {
        tmp = res;
        console.log('storage last datas');
        console.log(tmp);
        tmp = tmp.concat(obj);
        console.log("created data (obj)");
        console.log(tmp);
        global.storage.save({
          key:
            'mapInfo',
          data: tmp
        })
          .then(() => {
            this.loadMarkers();
          })
      })
      .catch(err => {
        global.storage.save({
          key:
            'mapInfo',
          data: obj 
        })
        .then( ()=>{
          this.loadMarkers();
        }
        )
        console.warn(err);
      })
  }

  isNear(obj, c_lat, c_lng) {
    if (Math.abs((obj.place.latitude - c_lat) < 0.00001) && (Math.abs(obj.place.longitude - c_lng) < 0.00001)) {
      return true;
    }
    else {
      return false;
    }
  }

  isTime(obj) {
    let date = null;
    let time = null;
    if (obj.time.date = date && obj.time.time == time) {
      return true;
    }
    else {
      return false;
    }
  }

  checker() {
    this.getCurrentPosition(this);
    console.log('you\'re @ (latlng) ' + this.latitude + '/' + this.longitude);
    const c_lat = this.latitude;
    const c_lng = this.longitude;
    storage
      .load({ key: 'mapInfo' })
      .then(res => {
        console.log('informations')
        console.log(res)
        res.map(obj => {
          if (this.isNear(obj, c_lat, c_lng)) {
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

  //  ComponentWillMountで初期化するらしい．調べてみたい．
  componentDidMount() {
    this.interval = setInterval(() => {
      // this.checker()
    }, 5000);
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
          onLongPress={(coords, pos) => {
            this.setState({
              latitude: coords.nativeEvent.coordinate.latitude,
              longitude: coords.nativeEvent.coordinate.longitude
            });
            this.getCurrentPosition(this)
            this.refs.modal.open();
          }
          }
        >
          {this.state.markers.map(marker => (
            <Marker
              identifier={marker.id}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
        <View style={{ position: 'absolute', flexDirection: "row", left: 0, right: 0, bottom: 20, justifyContent: 'space-evenly' }}>
          <Button titleStyle={{ fontWeight: 'bold' }} type="solid" title="現在地へ移動" onPress={() => { this.getCurrentPosition(this); this.fetchLatLong() }} />
          <Button titleStyle={{ fontWeight: 'bold' }} type="solid" title="ピンを削除" onPress={this.loadMarkers} />
        </View>
        <Modal style={styles.modal} position={"bottom"} ref={"modal"} swipeArea={20}>
          <ScrollView width={screen.width}>
            <SettingScreen storeNewData={this.storeNewdata} closeModal={this.closeModal} loadMarkers={this.loadMarkers} lat={this.state.latitude} lng={this.state.longitude}></SettingScreen>
          </ScrollView>
        </Modal>
      </View>
    )
  }
}

const LatitudeDelta = 0.00720;
const LongitudeDelta = 0.00720;
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