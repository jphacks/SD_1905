import React, { Component } from 'react'
import { View, StyleSheet, Text, Button, Alert } from 'react-native'
import DatePicker from 'react-native-datepicker'

export class Time extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: "2018-10-27",
      time: "0:00 PM"

    }
  }
  render() {
    return (
      <View style={styles.Pickers}>
        <DatePicker
          style={{ width: 200 }}
          date={this.state.date}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate="2000-05-01"
          maxDate="2030-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
            }
          }}
          onDateChange={
            (date) => {
              this.setState({ date: date })
              this.props.settingDate(date)
            }
          }
        />
        <DatePicker
          style={{ width: 200 }}
          date={this.state.time}
          mode="time"
          placeholder="select time"
          format="LT"
          iconSource={require('../fig/watch.png')}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
            }
          }}
          onDateChange={
            (time) => {
              this.setState({ time: time })
              this.props.settingTime(time)
            }
          }
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  Pickers: {
    // flexDirection: "colmun",
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FFFFFF',
    // marginHorizontal:100,
    // marginVertical:300
  }
})