import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Time } from './components/Time.js';
import { Map } from './components/Map.js'

export class SettingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // location info
      latitude: 38.2559,
      longitude: 140.845,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      // time info
      date: "2016-05-15",
      time: "8:16 PM",
      // music info
      musicId: "new data"
    }
  }

  settingLocation = (_lat, _lon) => { this.setState({ latitude: _lat, longitude: _lon }) }

  settingDate = (_date) => { this.setState({ date: _date }) }

  settingTime = (_time) => { this.setState({ time: _time }) }

  settingMusicId = (_musicId) => { this.setState({ time: _musicId }) }

  storeData = () => {
    newData = [
      {
        // id: Date.now().toString,
        id: Date.now().toString(),
        time: {
          date: this.state.date,
          time: this.state.time
        },
        place: {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta,
        },
        musicId: this.state.musicId
      }
    ]
    tmp = []
    storage
      .load({ key: 'mapInfo' })
      .then(res => {
        this.tmp = res;
      })
      .catch(err => {
        this.tmp = null;
        console.warn(err);
      })
    if (this.tmp != null) {
      newData = newData.concat(this.tmp)
    }
    console.log(newData)
    storage.save({
      key:
        'mapInfo',
      data: newData
    })
    Alert.alert("Success", "set the music in your world !!!")
  }

  render() {
    return (
      <View style={styles.Setting}>
        <View style={{ flex: 1, backgroundColor: '#FF00FF', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
          <Text style={styles.text}>
            select music
          </Text>
        </View >
        <View style={{ flex: 6, justifyContent: 'center', margin: 0 }}>
          <Map settingLocation={this.settingLocation}></Map>
        </View >
        <View style={{ flex: 1.3, backgroundColor: '#00FF00', justifyContent: 'space-evenly', alignItems: 'center', margin: 0 }}>
          <Time settingDate={this.settingDate} settingTime={this.settingTime}></Time>
        </View >

        <View style={{ flex: 1, backgroundColor: '#FFFF00', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
          <Button title="Save" onPress={this.storeData} />
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
  Setting: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 40,
    paddingBottom: 50,
    backgroundColor: '#FFFFFF'
  }
})