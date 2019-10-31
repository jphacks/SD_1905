import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, Image, TextInput } from 'react-native';
import { Button } from 'react-native-elements';

import { DEFAULT_NEAR_DIST } from './lib/util.js';
import Time from './components/Time.js';
import Dist from './components/Dist.js';
import SpotifyView from './components/SpotifyView.js';

const SCREEN = Dimensions.get('window');
const DEFAULT_IMAGE_URL = "https://yt3.ggpht.com/a/AGF-l7-GzUSbLNsd66pJy2tnI6wMDBmu4rKgInMk8Q=s288-c-k-c0xffffffff-no-rj-mo";

export default class SettingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      coordinate: {
        latitude: 0,
        longitude: 0
      },
      nearDist: DEFAULT_NEAR_DIST,
      time: {
        date: null,
        time: null
      },
      music: {
        spotifyID: null,
        title: null,
        artist: null,
        imageUrl: DEFAULT_IMAGE_URL,
      },
    };
    Object.assign(this.state, this.props.info);
  }

  setTime = (time) => { this.setState({ time: time }) };
  setMusic = (music) => { this.setState({ music: music }) };
  setNearDist = (nearDist) => { this.setState({ nearDist: nearDist }) };

  saveData = async () => {
    if (this.state.id === null) this.state.id = Date.now().toString();
    this.props.storeMarker(this.state);
    this.props.closeSettingsModal();
    Alert.alert("Success", "set the music in your world !!!");
  }

  render() {
    return (
      <View style={styles.setting}>
        <View style={{ width: '90%', marginLeft: '5%', paddingBottom: 10, borderBottomWidth: 2, borderColor: '#333' }}>
          <Text style={{ marginLeft: 20, fontSize: 30, margin: 0, color: '#333' }}>Settings</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 20, marginBottom: 10 }}>
          <View style={{ marginRight: 25 }}>
            <Image source={{ uri: this.state.music.imageUrl }} style={{ width: 90, height: 90 }} />
          </View>
          <View>
            <Text style={{ fontSize: 20 }}>{'Title: ' + this.state.music.title}</Text>
            <Text style={{ fontSize: 20 }}>{'Artist: ' + this.state.music.artist}</Text>
          </View>
        </View>

        <SpotifyView music={this.state.music} setMusic={this.setMusic}></SpotifyView>

        <Time time={this.state.time} setTime={this.setTime}></Time>

        <Dist nearDist={this.state.nearDist} setNearDist={this.setNearDist}></Dist>

        <View style={styles.container}>
          <Button title="Save" onPress={() => { this.saveData(); }} />
        </View >
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },

  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0
  },

  setting: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 20,
    paddingBottom: 50,
    backgroundColor: '#FFFFFF'
  },
})