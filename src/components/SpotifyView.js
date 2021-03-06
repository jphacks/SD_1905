import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TouchableOpacity, TouchableHighlight, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import Spotify from 'rn-spotify-sdk';

const SCREEN = Dimensions.get('window');

export default class SpotifyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyLoggedIn: false,
      music: this.props.music,
      spotifyID: this.props.music.spotifyID,
      query: "",
      tracks: [],
    };
  }

  onPressLoginSpotify = () => {
    const loggedIn = Spotify.isLoggedIn();
    if (!loggedIn) {
      Spotify.login()
        .then((loggedIn) => {
          if (loggedIn) {
            this.setState({ spotifyLoggedIn: true });
          }
        })
        .catch((error) => {
          Alert.alert("Failed to log into Spotify.", error.message);
        });
    }
    else {
      this.setState({
        spotifyLoggedIn: true
      });
    }
  }

  onPressLogoutSpotify = () => {
    Spotify.logout()
      .then(() => {
        this.setState({ spotifyLoggedIn: false });
      });
  }

  onChangeURI = (uri) => {
    let spotifyID;
    if (uri.slice(0, 14) == "spotify:track:") {
      spotifyID = uri.slice(14);
    }
    else if (uri.slice(0, 31) == "https://open.spotify.com/track/") {
      spotifyID = (uri.split('/').pop()).split('?')[0];
    }
    else {
      spotifyID = uri;
    }
    this.setState({ spotifyID: spotifyID });
  }

  onPressSetURI = async () => {
    Spotify.getTrack(this.state.spotifyID)
      .then((res) => {
        const music = {
          spotifyID: this.state.spotifyID,
          title: res.name,
          artist: res.album.artists[0].name,
          imageUrl: res.album.images[0].url
        };
        this.setState({ music: music });
        this.props.setMusic(music);
      })
      .catch((error) => {
        Alert.alert("Failed to get track.", error.message);
      });
  }

  onChangeQuery = (text) => {
    this.setState({ query: text, });
  }

  onPressSearchMusic = async () => {
    Spotify.search(this.state.query, ['track'])
      .then(async (res) => {
        tracks = [];
        let musicList = res.tracks;
        for (let idx = 0; idx < 20; idx++) {
          tracks.push({
            spotifyID: musicList.items[idx]["id"],
            title: musicList.items[idx]["name"],
            artist: musicList.items[idx]["album"]["artists"][0]["name"],
            imageUrl: musicList.items[idx]["album"]["images"][2]["url"],
          });
        }
        await this.setState({ tracks: tracks });
        this.searchModal.open();
      })
      .catch((err) => {
        Alert.alert("Search failure");
        console.warn(err);
      });
  }

  onPressSetMusic = async (idx) => {
    const music = this.state.tracks[idx];
    await this.setState({ music: music });
    await this.props.setMusic(music);
    this.searchModal.close();
  }

  componentDidMount() {
    const loggedIn = Spotify.isLoggedIn();
    this.setState({ spotifyLoggedIn: loggedIn });
  }

  render() {
    if (!this.state.spotifyLoggedIn) {
      return (
        <View style={styles.container}>
          <TouchableHighlight onPress={this.onPressLoginSpotify} style={styles.spotifyLoginButton}>
            <Text style={styles.spotifyLoginButtonText}>
              Log into Spotify
            </Text>
          </TouchableHighlight>
        </View>
      );
    }
    else {
      return (
        <View>
          <View style={styles.rowContainer}>
            <TextInput
              style={styles.searchTextBox}
              placeholder={"Search"}
              onChangeText={(text) => { this.onChangeQuery(text) }}
            />
            <Button title="Search" onPress={() => { this.onPressSearchMusic(); }} />
          </View>

          <View style={styles.rowContainer}>
            <TextInput
              style={styles.searchTextBox}
              placeholder={'Spotify URIを入力してください。'}
              onChangeText={(text) => { this.onChangeURI(text) }}
            />
            <Button title="Set" onPress={() => { this.onPressSetURI(); }} />
          </View>

          <View style={styles.container}>
            <TouchableHighlight onPress={this.onPressLogoutSpotify} style={styles.spotifyLogoutButton}>
              <Text style={styles.spotifyLogoutButtonText}>
                Logout
              </Text>
            </TouchableHighlight>
          </View>

          <Modal style={styles.modal} position={"center"} backdrop={true} ref={ref => { this.searchModal = ref; }} swipeArea={20} coverScreen={true}>
            <ScrollView width={SCREEN.width}>
              <View>
                {this.state.tracks.map((track, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => { this.onPressSetMusic(idx); }}
                    style={[styles.bubble, styles.button]}
                  >
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={styles.searchJacket}>
                        <Image source={{ uri: track.imageUrl }} style={{ width: 70, height: 70 }} />
                      </View>
                      <View style={styles.searchTextContainer}>
                        <Text>{"Title: " + track.title}</Text>
                        <Text>{"Artist: " + track.artist}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Modal>
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

  rowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },

  spotifyLoginButton: {
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'green',
    overflow: 'hidden',
    width: 200,
    height: 40,
    margin: 5,
  },

  spotifyLoginButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },

  spotifyLogoutButton: {
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#CCC',
    overflow: 'hidden',
    width: 75,
    height: 30,
    margin: 0,
  },

  spotifyLogoutButtonText: {
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
  },

  jacket: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN.height * 0.7,
  },

  searchTextBox: {
    flex: 0.8,
    margin: 10,
    height: 30,
    width: "60%",
    borderColor: 'gray',
    borderWidth: 0.5,
  },

  searchJacket: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginTop: 15,
    marginBottom: 15,
  },

  searchTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    marginBottom: 15,
  },
});