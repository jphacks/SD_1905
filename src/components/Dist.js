import React, { Component } from 'react'
import { View, StyleSheet, Text, TextInput, Button, Alert } from 'react-native'

export default class Dist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nearDist: this.props.nearDist
    }
  }

  onNearDistChange = (nearDist) => {
    const num = isNaN(Number(nearDist)) ? DEFAULT_NEAR_DIST : Number(nearDist);
    this.setState({ nearDist: num });
  }

  render() {
    return (
      <View style={styles.distContainer}>
        <Text>Distance: </Text>
        <TextInput
          style={styles.distInput}
          value={String(this.state.nearDist)}
          placeholder={'Set distance (meter)'}
          onChangeText={(text) => { this.onNearDistChange(text) }}
          onEndEditing={() => {this.props.setNearDist(this.state.nearDist)}}
        />
        <Text>m</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  distContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
    margin: 10
  },

  distInput: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    margin: 2,
    width: 50,
    borderColor: 'gray',
    borderWidth: 1,
  },
})