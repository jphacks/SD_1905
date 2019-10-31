import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import Spotify from 'rn-spotify-sdk';

import { getCurrentPosition } from './lib/location';
import { isNear, isDateTime } from './lib/util';
import SettingScreen from './SettingScreen.js';
import Map from './components/Map.js';

const SCREEN = Dimensions.get('window');

export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      settingInfo: {},
      isPlaying: false,
      isSearching: true,
    };
    this.loadMarkers();
  }

  loadMarkers = async () => {
    const markers = await global.storage.load({ key: 'mapInfo' });
    this.setState({ markers });
    console.log(markers);
  }

  storeMarker = async (marker) => {
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

  playMusic = async (spotifyID) => {
    const spotifyURI = "spotify:track:" + spotifyID;
    Spotify.playURI(spotifyURI, 0, 0)
      .then(() => {
        this.setState({ isPlaying: true });
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  checker = async () => {
    const playbackState = Spotify.getPlaybackState();
    if (playbackState != null && playbackState.playing) return;

    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    console.log('you\'re @ (latlng) ' + latitude + '/' + longitude);
    global.storage
      .load({ key: 'mapInfo' })
      .then(res => {
        console.log('informations');
        res.map(obj => {
          if (isNear(obj.coordinate.latitude, obj.coordinate.longitude, latitude, longitude) && isDateTime(obj.time.date, obj.time.time)) {
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

  openSettingsModal = async (info) => {
    await this.setState({ settingInfo: info });
    this.refs.modal.open();
  }

  closeSettingsModal = () => {
    this.refs.modal.close();
  }

  componentDidMount() {
    this.interval = setInterval(() => { this.checker(); }, 10000);
  }

  render() {
    return (
      <View style={styles.main}>
        <Map
          markers={this.state.markers}
          loadMarkers={this.loadMarkers}
          openSettingsModal={this.openSettingsModal}
          closeSettingsModal={this.closeSettingsModal}
          playMusic={this.playMusic}
        />

        <Modal style={styles.modal} position={"bottom"} ref={"modal"} swipeArea={20}>
          <ScrollView width={SCREEN.width}>
            <SettingScreen
              storeMarker={this.storeMarker}
              closeSettingsModal={this.closeSettingsModal}
              info={this.state.settingInfo}
            />
          </ScrollView>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN.height * 0.7,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
})
