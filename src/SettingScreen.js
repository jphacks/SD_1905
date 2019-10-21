import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Time } from './components/time.js';

export class SettingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // location info
      // time info
      date: "2016-05-15",
      time: "8:16 PM"
    }
  }
  updateLocationInfo = ()=>{this.setState({})}
  updateDateInfo = (_date)=>{this.setState({date:_date})}
  updateTimeInfo = (_time)=>{this.setState({time:_time})}
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
    storage.save({
      key:
        'mapInfo',
      data: [
        {
          id: 'hoge',
          time: {
            year: 2020,
            month: 10,
            day: 12,
            hour: 12,
            minute: 0
          },
          place: {
            x: 10,
            y: 10,
            z: 10,
            accuracy: 10
          },
          musicId: "hello"
        },
        {
          id: 'huga',
          time: {
            year: 2020,
            month: 10,
            day: 12,
            hour: 12,
            minute: 0
          },
          place: {
            x: 10,
            y: 10,
            z: 10,
            accuracy: 10
          },
          musicId: "hello" 
        }
      ]
    })
  }
  loadData = () => {
    storage
      .load({ key: 'mapInfo' })
      // .then(res => console.log(res)alert(res.name))
      .then(res => alert(res[1].id))
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