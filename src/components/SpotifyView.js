import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableHighlight, TextInput } from 'react-native';
import Spotify from 'rn-spotify-sdk';

export default class SpotifyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyID: this.props.spotifyID,
      loggedIn: false,
    }
  }

  componentDidMount() {
    const loggedIn = Spotify.isLoggedIn();
    this.setState({
      spotifyLoggedIn: loggedIn
    })
  }

  loginSpotify = () => {
    const loggedIn = Spotify.isLoggedIn();
    if (!loggedIn) {
      Spotify.login().then((loggedIn) => {
        if (loggedIn) {
          this.setState({
            spotifyLoggedIn: true
          })
        }
      }).catch((error) => {
        Alert.alert("Failed to log into Spotify.", error.message);
      });
    }
    else {
      this.setState({
        spotifyLoggedIn: true
      })
    }
  }

  onChangeURI = (uri) => {
    let spotifyID;
    if (uri.slice(0, 14) == "spotify:track:") {
      spotifyID = uri.slice(14);
    }
    else if (uri.slice(0, 31) == "https://open.spotify.com/track/") {
      spotifyID = (uri.split('/').pop()).split('?')[0]
    }
    else {
      spotifyID = uri
    }
    this.setState({
      spotifyID: spotifyID
    })
  }

  onEndEditing = () => {
    Spotify.getTrack(this.state.spotifyID)
      .then((res) => {
        const music = {
          spotifyID: this.state.spotifyID,
          title: res.name,
          artist: res.album.artists[0].name,
          imageUrl: res.album.images[0].url
        };
        this.props.setMusic(music);
      })
      .catch((error) => {
        Alert.alert("Failed to get track.", error.message);
      });
  }

  render() {
    if (!this.state.spotifyLoggedIn) {
      return (
        <View style={styles.container}>
          <TouchableHighlight onPress={this.loginSpotify} style={styles.spotifyLoginButton}>
            <Text style={styles.spotifyLoginButtonText}>Log into Spotify</Text>
          </TouchableHighlight>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.spotifyUriInput}
            placeholder={'Spotify URIを入力してください。'}
            onChangeText={(text) => {this.onChangeURI(text)}}
            onEndEditing={() => this.onEndEditing()}
          />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotifyLoginButton: {
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'green',
    overflow: 'hidden',
    width: 200,
    height: 40,
    margin: 10,
  },
  spotifyLoginButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  spotifyUriInput: {
    height: 30,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
  }
});