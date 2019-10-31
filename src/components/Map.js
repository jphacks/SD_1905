import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { Circle, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';

import { getCurrentPosition } from '../lib/location.js';
import { DEFAULT_NEAR_DIST } from '../lib/util.js';
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
      circle: {
        center: {
          latitude: null,
          longitude: null
        },
        radius: DEFAULT_NEAR_DIST,
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

  setCircle = (coordinate, radius) => {
    this.setState({
      circle: {
        center: coordinate,
        radius, radius
      }
    });
  }

  setCircleNull = () => {
    this.setState({
      circle: {
        center: {
          latitude: null,
          longitude: null
        },
        radius: DEFAULT_NEAR_DIST,
      },
    })
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
          onMarkerDeselect={this.setCircleNull}
        >
          {this.state.circle.center.latitude != null &&
            <Circle
              center={this.state.circle.center}
              radius={this.state.circle.radius}
              strokeColor='#F00'
              strokeWidth={2}
            />
          }
          {this.props.markers.map((marker, index) => (
            <Pin
              key={index}
              marker={marker}
              moveMarker={(coords) => { this.moveMarker(index, coords); }}
              removeMarker={() => { this.removeMarker(index); }}
              openSettingsModal={() => { this.props.openSettingsModal(marker); }}
              playMusic={() => { this.props.playMusic(marker.music); }}
              showCircle={() => { this.setCircle(marker.coordinate, marker.nearDist); }}
            />
          ))}
        </MapView>

        <View style={styles.buttonContainer}>
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="現在地へ移動" onPress={this.moveToCurrentPosition} />
          <Button titleStyle={styles.bottomButtonTitle} type="solid" title="ここで登録" onPress={this.registerCurrentPosition} />
          {/* <Button titleStyle={styles.bottomButtonTitle} type="solid" title="ピンを削除" onPress={() => {this.removeAllMarkers();}}/> */}
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
    bottom: 50,
    justifyContent: 'space-evenly'
  },

  bottomButtonTitle: {
    fontWeight: 'bold',
    fontSize: 13.5
  }
})
