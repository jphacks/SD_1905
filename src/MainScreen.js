import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export class MainScreen extends React.Component {
  render() {
    return (
      <View style={styles.Main}>
        <Text style={styles.text}>
          ここで流れている曲や自分の場所を表示して欲しい
        </Text>
        <Button title="Load:" onPress={this.loadData} />
      </View>
    )
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