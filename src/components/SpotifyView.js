import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableHighlight, TextInput } from 'react-native';
import Spotify from 'rn-spotify-sdk';

export class SpotifyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyInitialized: false,
      spotifyLoggedIn: true
    }
    this.spotifyLoginButtonWasPressed = this.spotifyLoginButtonWasPressed.bind(this);
  }

  componentDidMount() {
    this.initializeIfNeeded().catch((error) => {
      Alert.alert("Error", error.message);
    });
  }

  spotifyLoginButtonWasPressed() {
    // log into Spotify
    Spotify.login().then((loggedIn) => {
      if (loggedIn) {
        // logged in
        this.setState({
          spotifyLoggedIn: true
        })
      }
      else {
        // cancelled
      }
    }).catch((error) => {
      Alert.alert("Error", error.message);
    });
  }

  async initializeIfNeeded() {
    // initialize Spotify if it hasn't been initialized yet
    if (!await Spotify.isInitializedAsync()) {
      // initialize spotify
      const spotifyOptions = {
        "clientID": "41e45372be8a404c9ce69009e017f353",
        "sessionUserDefaultsKey": "SpotifySession",
        "redirectURL": "examplespotifyapp://auth",
        "scopes": ["user-read-private", "playlist-read", "playlist-read-private", "streaming"],
      };
      const loggedIn = await Spotify.initialize(spotifyOptions);
      // update UI state
      this.setState({
        spotifyInitialized: true,
        spotifyLoggedIn: loggedIn
      });
    }
    else {
      const loggedIn = await Spotify.isLoggedIn();
      // update UI state
      this.setState({
        spotifyInitialized: true,
        spotifyLoggedIn: loggedIn
      });
    }
  }

  render() {
    if (!this.state.spotifyInitialized) {
      return (
        <View style={styles.container}>
          <Text style={styles.loadMessage}>
            Loading...
					</Text>
        </View>
      );
    }
    else {
      if (!this.state.spotifyLoggedIn) {
        return (
          <View style={styles.container}>
            <Text style={styles.greeting}>
              Hey! You! Log into your spotify
            </Text>
            <TouchableHighlight onPress={this.spotifyLoginButtonWasPressed} style={styles.spotifyLoginButton}>
              <Text style={styles.spotifyLoginButtonText}>Log into Spotify</Text>
            </TouchableHighlight>
          </View>
        );
      }
      else {
        return (
          <View style={styles.container}>
            <TextInput
              style={{ height: 30, width: 300, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => this.props.settingSpotifyURI(text)}
              placeholder={'Spotify URIを入力してください。'}
            />
          </View>
        )
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  loadIndicator: {
    //
  },
  loadMessage: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  spotifyLoginButton: {
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'green',
    overflow: 'hidden',
    width: 200,
    height: 40,
    margin: 20,
  },
  spotifyLoginButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },

  greeting: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});