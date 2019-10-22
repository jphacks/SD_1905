import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage'

import { MainScreen } from './src/MainScreen.js';
import { SettingScreen } from './src/SettingScreen.js';

const storage = new Storage({
  storageBackend: AsyncStorage
})
global.storage = storage // from all component

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  Main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#576071',
  },
  Setting: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#afa598'
  }
})

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // Current locatinon
      latitude: 37.78825,
      longitude: -122.4324,
      // Current time
      date: "2016-05-15",
      time: "8:16 PM",
      // Current Music
      music: null
    }
  }
  updateLocation = (_latitude, _longitude) => {
    this.setState({
      latitude: _latitude,
      longitude: _longitude
    })
  }

  updateDateTime = (_date, _time) => {
    this.setState({
      date: "2016-05-15",
      time: "8:16 PM",
    })
  }

  updateMusic = (_music) => {
    this.setState({
      music: _music
    })
  } 
  render() {
    return (
      <Swiper showsButtons={true} loop={false} showsButtons={true} shoePagenation={false}>
        <MainScreen></MainScreen>
        <SettingScreen updateLocation={this.updateLocation} updateDateTime={this.updateDateTime}></SettingScreen>
      </Swiper>
    );
  }
}
