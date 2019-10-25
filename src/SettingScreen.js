import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Time } from './components/Time.js';
import { Map } from './components/Map.js'

export class SettingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // location info
      latitude: this.props.lat,
      longitude: this.props.lng,
      // time info
      date: "2016-05-15",
      time: "8:16 PM",
      // music info
      musicId: "your world is"
    }
    console.log('new setting screen')
    console.log(this.state.latitude + ' ' + this.state.longitude);
  }

  settingLocation = (_lat, _lon) => { this.setState({ latitude: _lat, longitude: _lon }) }

  settingDate = (_date) => { this.setState({ date: _date }); console.log('date set'); }

  settingTime = (_time) => { this.setState({ time: _time }) }

  settingMusicId = (_musicId) => { this.setState({ time: _musicId }) }

  saveData = () => {
    this.newData = [
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
        },
        musicId: this.state.musicId
      }
    ]
    this.props.storeNewData(this.newData);
    this.props.closeModal();
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
        {/* <View style={{ flex: 6, justifyContent: 'center', margin: 0 }}>
          <Map settingLocation={this.settingLocation}></Map>
        </View > */}
        <View style={{ flex: 1.3, backgroundColor: '#00FF00', justifyContent: 'space-evenly', alignItems: 'center', margin: 0 }}>
          <Time settingDate={this.settingDate} settingTime={this.settingTime}></Time>
        </View >

        <View style={{ flex: 1, backgroundColor: '#FFFF00', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
          <Button title="Save" onPress={this.saveData} />
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