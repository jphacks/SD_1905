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
    this.initMapInfo();
  }

  // 初期起動時に mapInfo が存在しない場合の例外処理
  async initMapInfo() {
    global.storage
      .load({ key: 'mapInfo' })
      .catch( () => { global.storage.save({ key: 'mapInfo', data: [] }) });
  }

  render() {
    return (
        <MainScreen></MainScreen>
    );
  }
}

const styles = StyleSheet.create({
})
