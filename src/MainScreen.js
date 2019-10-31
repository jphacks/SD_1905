import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import Spotify from 'rn-spotify-sdk';

import { getCurrentPosition } from './lib/location';
import { isNear, isDateTime } from './lib/util';
import SettingScreen from './SettingScreen.js';
import Map from './components/Map.js';
import Status from './components/Status.js';

const SCREEN = Dimensions.get('window');

export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      settingInfo: {},
      music: null,
      isPlaying: false,
      isSearching: true,
    };
    this.loadMarkers();
    this.interval = setInterval(() => { this.checker(); }, 10000);
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

  playMusic = async (music) => {
    const spotifyURI = "spotify:track:" + music.spotifyID;
    Spotify.playURI(spotifyURI, 0, 0)
      .then(() => {
        this.setState({
          music: music,
          isPlaying: true,
        });
      })
      .catch((error) => { console.warn(error); });
  }

  togglePlaying = async () => {
    if (this.state.music == null) return;
    const playbackState = await Spotify.getPlaybackStateAsync();
    if (playbackState == null) return;
    Spotify.setPlaying(!playbackState.playing)
      .then(() => {
        this.setState({
          isPlaying: !playbackState.playing,
          isSearching: !playbackState.playing
        });
      })
  }

  toggleSearching = () => {
    this.setState({ isSearching: !this.state.isSearching });
    if (!this.state.isPlaying) {
      this.setState({ music: null });
    }
  }

  checker = async () => {
    if (!this.state.isSearching) return;
    const playbackState = await Spotify.getPlaybackStateAsync();
    if (playbackState != null && playbackState.playing) return;
    if (playbackState == null || !playbackState.playing) {
      this.setState({
        music: null,
        isPlaying: false,
        isSearching: true
      })
    }

    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    console.log('you\'re @ (latlng) ' + latitude + '/' + longitude);
    global.storage
      .load({ key: 'mapInfo' })
      .then(res => {
        console.log('informations');
        const len = Object.keys(res).length;
        for (let i = 0; i < len; i++) {
          const obj = res[i];
          if (isNear(obj.coordinate.latitude, obj.coordinate.longitude, latitude, longitude, obj.nearDist) && isDateTime(obj.time.date, obj.time.time)) {
            console.log('hit!! ' + obj.music.title);
            if (obj.music.spotifyID != null) {
              this.playMusic(obj.music);
              return;
            }
          }
          else {
            console.log('not hit ...');
          }
        }
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

  render() {
    return (
      <View style={styles.main}>
        <View style={{ flex: 0.20 }}>
          <Status
            music={this.state.music}
            isPlaying={this.state.isPlaying}
            isSearching={this.state.isSearching}
            togglePlaying={this.togglePlaying}
            toggleSearching={this.toggleSearching}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Map
            markers={this.state.markers}
            loadMarkers={this.loadMarkers}
            openSettingsModal={this.openSettingsModal}
            closeSettingsModal={this.closeSettingsModal}
            playMusic={this.playMusic}
          />
        </View>

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
