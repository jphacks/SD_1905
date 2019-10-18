import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';
import {MainScreen} from './src/MainScreen.js';
import {SettingScreen} from './src/SettingScreen.js';
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
  render() {
    return (
      <Swiper showsButtons={true} loop={false} showsButtons={true} shoePagenation={false}>
        <MainScreen></MainScreen>
        <SettingScreen></SettingScreen>
      </Swiper>
    );
  }
}
