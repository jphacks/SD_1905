import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import Spotify from 'rn-spotify-sdk';

import MainScreen from './src/MainScreen.js';

const storage = new Storage({
  storageBackend: AsyncStorage
});
global.storage = storage; // from all component

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyInitialized: false,
    };
    this.initMapInfo();
  }

  // 初期起動時に mapInfo が存在しない場合の例外処理
  async initMapInfo() {
    global.storage
      .load({ key: 'mapInfo' })
      .catch(() => { global.storage.save({ key: 'mapInfo', data: [] }) });
  }

  async initializeSpotify() {
    if (!await Spotify.isInitializedAsync()) {
      const spotifyOptions = {
        "clientID": "41e45372be8a404c9ce69009e017f353",
        "sessionUserDefaultsKey": "SpotifySession",
        "redirectURL": "examplespotifyapp://auth",
        "scopes": ["user-read-private", "playlist-read", "playlist-read-private", "streaming"],
      };
      await Spotify.initialize(spotifyOptions);
      this.setState({
        spotifyInitialized: true,
      });
    }
    else {
      this.setState({
        spotifyInitialized: true,
      });
    }
  }

  componentDidMount() {
    this.initializeSpotify().catch((error) => {
      Alert.alert("Failed to initialize Spotify.", error.message);
    });
  }

  render() {
    if (!this.state.spotifyInitialized) {
      return (
        <View style={styles.container}>
          <Text style={styles.loadMessage}>
            Loading...
          </Text>
        </View>
      );
    }
    else {
      return (
        <MainScreen></MainScreen>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loadMessage: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});