import React from 'react';
import { StyleSheet, Text, View, Button, Alert} from 'react-native';
import { Time } from './components/Time.js';
import { Map } from './components/Map.js'

export class SettingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // location info
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      // time info
      date: "2016-05-15",
      time: "8:16 PM",
      // music info
      musicId: 3.141592
    }
  }
  settingLocation = () => { this.setState({}) }
  settingDate = (_date) => { this.setState({ date: _date }) }
  settingTime = (_time) => { this.setState({ time: _time }) }
  settingMusicId = (_musicId) => {this.setState({time: _musicId})}
  render() {
    return (
      <View style={styles.Setting}>
        <View style={{ flex: 2, backgroundColor: '#FF00FF', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
          <Text style={styles.text}>
            music
          </Text>
        </View >
        <View style={{ flex: 6, backgroundColor: '#FF0000', justifyContent: 'center', margin: 10 }}>
          <Map settingLocation={this.settingLocation} updateLocation={this.props.updateLocation} updateDateTime={this.props.updateDateTime}></Map>
        </View >
        <View style={{ flex: 2, backgroundColor: '#00FF00', justifyContent: 'space-evenly', alignItems: 'center', margin: 10 }}>
          <Time settingDate={this.settingDate} settingTime={this.settingTime}></Time>
        </View >

        <View style={{ flex: 1, backgroundColor: '#FFFF00', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
          <Button title="Save" onPress={this.storeData} />
        </View >
      </View>
    )
  }
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
    if (this.tmp == null) {
      newData = newData
    }
    else {
      newData = newData.concat(this.tmp)
    }
    storage.save({
      key:
        'mapInfo',
      data: newData
    })
    Alert.alert("Success", "set the music in your world !!!")
  }
  loadData = () => {
    storage
      .load({ key: 'mapInfo' })
      .then(res => alert(res.length))
      .catch(err => console.warn(err))
  }

}

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
  Setting: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 15,
    backgroundColor: '#afa598'
  }
})