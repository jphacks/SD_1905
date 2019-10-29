import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, Image , TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import Spotify from 'rn-spotify-sdk';

import Time from './components/Time.js';
import SpotifyView from './components/SpotifyView.js';

const SCREEN = Dimensions.get('window');
const DEFAULT_IMAGE_URL = "https://yt3.ggpht.com/a/AGF-l7-GzUSbLNsd66pJy2tnI6wMDBmu4rKgInMk8Q=s288-c-k-c0xffffffff-no-rj-mo";
let musicData =[];
let trackJSX=[];

export default class SettingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      coordinate: {
        latitude: 0,
        longitude: 0
      },
      time: {
        date: null,
        time: null
      },
      music: {
        spotifyID: null,
        title: null,
        artist: null,
        imageUrl: DEFAULT_IMAGE_URL,
      },
      searchStatus: "",
    }
    Object.assign(this.state, this.props.info);
  }

  setTime = (time) => { this.setState({ time: time }) };
  setMusic = (music) => { this.setState({ music: music }) };

  saveData = async () => {
    if(this.state.id === null) this.state.id = Date.now().toString();
    this.props.storeMarker(this.state);
    this.props.closeModal();
    Alert.alert("Success", "set the music in your world !!!")
  }

  onPressSetMusic = (num) => {
    this.setState({ music: musicData[num] });
    this.refs.modal1.close();
  }

  searchMusic = async () => {
    await Spotify.search(this.state.searchStatus,['track'])
      .then(
        res => {
          musicData.length = 0;
          var musicList = res.tracks;
          for(let idx = 0; idx < 20; idx++){
            musicData.push({
              title: musicList.items[idx]["name"],
              artist: musicList.items[idx]["album"]["artists"][0]["name"],
              spotifyID: musicList.items[idx]["id"],
              imageUrl: musicList.items[idx]["album"]["images"][2]["url"],
            });
          }
        trackJSX.length = 0;
        for(let idx=0; idx < musicData.length; idx++){
          trackJSX.push(
            <Button key={idx} title={"Title: "+ musicData[idx].title + " Artist: "+ musicData[idx].artist} onPress={this.onPressSetMusic.bind(this, idx)}/>
          );
        }
        this.refs.modal1.open(); 
        }
      )
      .catch(
        err => {
          Alert.alert("Search failure");
          console.log(err);
        }
      )
  }

  onChangeText = (text) => {
    this.setState({
      searchStatus: text,
    })
  }

  render() {
    return (
      <View style={styles.setting}>
        <View style={{ width: '90%', marginLeft: '5%', paddingBottom: 10, borderBottomWidth: 2, borderColor: '#333' }}>
          <Text style={{ marginLeft: 20, fontSize: 30, margin: 0, color: '#333'}}>Settings</Text>
        </View>

        {/* Sample Music */}
        <View style={styles.container}>
          {/* <Text>Music: </Text> */}
          <TextInput 
            value={this.state.searchStatus}
            style={{ height: 30, width: "70%", borderColor: 'gray', borderWidth: 0.5, marginBottom: 10 }}
            placeholder={"Search"}
            onChangeText={(text) => {this.onChangeText(text)}}
          />
          <Button title="Search Music" onPress={() => {this.searchMusic();}} />
          <Modal style={styles.modal} position={"center"} backdrop={true} ref={"modal1"} swipeArea={20} coverScreen={true}>
            <ScrollView width={SCREEN.width}>
              <View>
                { trackJSX }
              </View>
            </ScrollView>
          </Modal>
        </View>

        <View style={styles.container}>
          <Time time={this.state.time} setTime={this.setTime}></Time>
        </View >

        {/* Spotify */}
        {/* <View style={{ flex: 1, backgroundColor: '#FF0000', margin: 10}}> */}
        <View style={styles.container}>
          <SpotifyView spotifyID={this.state.music.spotifyID} setMusic={this.setMusic}></SpotifyView>
        </View>

        <View style={styles.container}>
          <Button title="Save" onPress={() => {this.saveData();}} />
        </View >
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },

  jacket: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0
  },

  container: {
    marginTop: 20,
    flex: 1,
    // backgroundColor: '#FF00FF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0
  },

  setting: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 20,
    paddingBottom: 50,
    backgroundColor: '#FFFFFF'
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 500,
  },
})