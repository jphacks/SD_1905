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


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Current locatinon
      latitude: 37.78825,
      longitude: -122.4324,
      // Current time
      date: "2016-05-15",
      time: "8:16 PM",
      // Current Music
      music: 3.141592
    }
  }

  render() {
    return (
        <MainScreen></MainScreen>
    );
  }
}

const styles = StyleSheet.create({
})
