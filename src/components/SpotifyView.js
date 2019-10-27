import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableHighlight, TextInput } from 'react-native';
import Spotify from 'rn-spotify-sdk';

export class SpotifyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyID: null,
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
        else {
          // cancelled
        }
      }).catch((error) => {
        Alert.alert("Error", error.message);
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
        this.props.settingSpotifyID(this.state.spotifyID);
        this.props.settingTitle(res.name);
        this.props.settingArtist(res.album.artists[0].name)
        this.props.settingImageUrl(res.album.images[0].url)
      })
      .catch((error) => {
        Alert.alert("Failet to get track.", error.message);
      });
  }

  render() {
    if (!this.state.spotifyLoggedIn) {
      return (
        <View style={styles.container}>
          <Text style={styles.greeting}>
            Hello! Log into your spotify
          </Text>
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
            style={{ height: 30, width: 300, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(text) => {this.onChangeURI(text)}}
            placeholder={'Spotify URIを入力してください。'}
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
    backgroundColor: '#F5FCFF',
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