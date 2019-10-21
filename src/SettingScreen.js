import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Time } from './components/time.js';

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
  updateLocationInfo = () => { this.setState({}) }
  updateDateInfo = (_date) => { this.setState({ date: _date }) }
  updateTimeInfo = (_time) => { this.setState({ time: _time }) }
  render() {
    return (
      <View style={styles.Setting}>
        <Text style={styles.text}>
          ここで(場所×時間)→曲の設定をして欲しい
        </Text>
        <Text style={styles.text}>
          "state:"{this.state.date}/{this.state.time}
        </Text>
        <Time updateDateInfo={this.updateDateInfo} updateTimeInfo={this.updateTimeInfo}></Time>
        <Button title="Save:" onPress={this.storeData} />
        <Button title="Load:" onPress={this.loadData} />
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
    storage
      .load({ key: 'mapInfo' })
      .then(res => {tmp=res})
      .catch(err => console.warn(err))
    newData = newData.concat(tmp)
    storage.save({
      key:
        'mapInfo',
      data: newData
    })
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