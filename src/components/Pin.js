import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { Marker, Callout } from 'react-native-maps';

export default class Pin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingInfo: {},
    }
  }

  render() {
    return (
      <Marker
        draggable
        identifier={this.props.marker.id}
        coordinate={this.props.marker.coordinate}
        title={this.props.marker.music.title}
        onDragEnd={(event) => { this.props.moveMarker(event.nativeEvent.coordinate); this.props.showCircle(); }}
        onPress={() => { this.setState({ settingInfo: this.props.marker }); this.props.showCircle(); }}
      >
        <Callout>
          <View>
            <View style={styles.musicContainer}>
              <View>
                <Image style={styles.jacket} source={{ uri: this.props.marker.music.imageUrl }} />
              </View>
              <View>
                <Text>{'Title: ' + this.props.marker.music.title}</Text>
                <Text>{'Artist: ' + this.props.marker.music.artist}</Text>
                <Text>{'Time: ' + this.props.marker.time.time}</Text>
                <Text>{'Date: ' + this.props.marker.time.date}</Text>
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              <Button buttonStyle={{ backgroundColor: 'red' }} titleStyle={styles.buttonText} type="solid" title="Remove" onPress={this.props.removeMarker} />
              <Button titleStyle={styles.buttonText} type="solid" title="Edit" onPress={this.props.openSettingsModal} />
              <Button titleStyle={styles.buttonText} type="solid" title="Play" onPress={this.props.playMusic} />
            </View>
          </View>
        </Callout>
      </Marker>
    )
  }
}

const styles = StyleSheet.create({
  musicContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10
  },

  buttonText: {
    fontSize: 13,
    fontWeight: 'bold'
  },

  jacket: {
    width: 60,
    height: 60,
    marginRight: 8
  }
})