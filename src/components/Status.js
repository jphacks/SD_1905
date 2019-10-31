import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, Image, TextInput } from 'react-native';
import { Button } from 'react-native-elements';

export default class Status extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#BBB' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.jacket}>
            {this.props.music != null &&
              <Image source={{ uri: this.props.music.imageUrl }} style={{ width: 70, height: 70 }} />
            }
          </View>
          <View style={styles.textContainer}>
            <View>
              {this.props.isPlaying && this.props.music != null &&
                <View>
                  <Text style={styles.boldText}>
                    Now Playing:
                </Text>
                  <Text>
                    {this.props.music.title}
                  </Text>
                </View>
              }
              {!this.props.isPlaying && this.props.music != null &&
                <View>
                  <Text style={styles.boldText}>
                    Pause:
                </Text>
                  <Text>
                    {this.props.music.title}
                  </Text>
                </View>
              }
              {!this.props.isPlaying && this.props.isSearching &&
                <Text style={styles.boldText}>
                  Searching...
                </Text>
              }
              {!this.props.isPlaying && !this.props.isSearching &&
                <Text style={styles.boldText}>
                  Pending...
                </Text>
              }
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button style={{ height: 40, width: 75 }} titleStyle={styles.bottomButtonTitle} type="solid" title={this.props.isPlaying ? "Pause" : "Resume"} onPress={this.props.togglePlaying} />
            <Button style={{ height: 40, width: 75 }} titleStyle={styles.bottomButtonTitle} type="solid" title={this.props.isSearching ? "Suspend" : "Search"} onPress={this.props.toggleSearching} />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  jacket: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 30,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 30,
  },

  buttonContainer: {
    flex: 0.45,
    justifyContent: 'space-evenly',
    marginTop: 30,
  },

  bottomButtonTitle: {
    fontWeight: 'bold',
    fontSize: 13
  },

  boldText: {
    fontSize: 15,
    fontWeight: 'bold'
  }
})
