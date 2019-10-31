import React, { Component } from 'react'
import { View, StyleSheet, Text, Button, Alert } from 'react-native'
import DatePicker from 'react-native-datepicker'

export default class Time extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: this.props.time.date,
      time: this.props.time.time
    }
  }

  onDateChange = async (date) => {
    await this.setState({ date: date });
    this.props.setTime(this.state);
  }

  onTimeChange = async (time) => {
    await this.setState({ time: time });
    this.props.setTime(this.state);
  }

  render() {
    return (
      <View style={styles.pickers}>
        <DatePicker
          style={{ width: 200 }}
          date={this.state.date}
          mode="date"
          placeholder="Select Date (Optional)"
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
          onDateChange={(date) => { this.onDateChange(date); }}
        />
        <DatePicker
          style={{ width: 200 }}
          date={this.state.time}
          mode="time"
          placeholder="Select Time (Optional)"
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
          onDateChange={(time) => { this.onTimeChange(time); }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pickers: {
    // width: '80%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    // flexDirection: "colmun",
    // alignItems: 'center',
    // marginHorizontal:100,
    // marginVertical:300
  }
})