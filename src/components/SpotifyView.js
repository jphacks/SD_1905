import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, TouchableHighlight, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import Spotify from 'rn-spotify-sdk';

const SCREEN = Dimensions.get('window');

export default class SpotifyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      music: this.props.music,
      spotifyID: this.props.music.spotifyID,
      query: "",
      tracks: [],
    };
  }

  componentDidMount() {
    const loggedIn = Spotify.isLoggedIn();
    this.setState({ spotifyLoggedIn: loggedIn });
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
          <View style={styles.container}>
            <TextInput
              style={{ margin: 5, height: 30, width: "70%", borderColor: 'gray', borderWidth: 0.5, marginBottom: 10 }}
              placeholder={"Search"}
              onChangeText={(text) => { this.onChangeQuery(text) }}
            />
            <Button title="Search Music" onPress={() => { this.onPressSearchMusic(); }} />

            <Modal style={styles.modal} position={"center"} backdrop={true} ref={ref => { this.searchModal = ref; }} swipeArea={20} coverScreen={true}>
              <ScrollView width={SCREEN.width}>
                <View>
                  {this.state.tracks.map((track, idx) => (
                    <Button
                      key={idx}
                      title={"Title: " + track.title + " Artist: " + track.artist}
                      onPress={() => { this.onPressSetMusic(idx) }} />
                  ))}
                </View>
              </ScrollView>
            </Modal>
          </View>

          <View style={styles.container, { flexDirection: "row" }}>
            <TextInput
              style={styles.spotifyUriInput}
              placeholder={'Spotify URIを入力してください。'}
              onChangeText={(text) => { this.onChangeURI(text) }}
            />
            <Button title="Set" onPress={() => this.onPressSetURI()}></Button>
          </View>
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
    margin: 10,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
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
    height: SCREEN.height * 0.6,
  },
});