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
      x: null,
      y: null,
      z: null,
      // Current time
      time: null,
      // Current Music
      music: null
    }
  }
  updateLocation = (_x, _y, _z) => {
    this.setState({
      x: _x,
      y: _y,
      z: _z
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
        <SettingScreen></SettingScreen>
      </Swiper>
    );
  }
}
