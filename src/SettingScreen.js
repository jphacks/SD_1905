import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, Image, TextInput } from 'react-native';
import { Button } from 'react-native-elements';

import Time from './components/Time.js';
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

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
          <View style={{ marginRight: 25 }}>
            <Image source={{ uri: this.state.music.imageUrl }} style={{ width: 90, height: 90 }} />
          </View>
          <View>
            <Text style={{ fontSize: 20 }}>{'Title: ' + this.state.music.title}</Text>
            <Text style={{ fontSize: 20 }}>{'Artist: ' + this.state.music.artist}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <SpotifyView music={this.state.music} setMusic={this.setMusic}></SpotifyView>
        </View>

        <View style={styles.container}>
          <Time time={this.state.time} setTime={this.setTime}></Time>
        </View >

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
    marginTop: 20,
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