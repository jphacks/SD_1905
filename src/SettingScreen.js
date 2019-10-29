import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, Image , TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import Spotify from 'rn-spotify-sdk';

import Time from './components/Time.js';
import SpotifyView from './components/SpotifyView.js';

const SCREEN = Dimensions.get('window');
let musicData =[];
let trackJSX=[];

export default class SettingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      coordinate: {latitude: "0", longitude: "0"},
      date: null,
      time: null,
      musicId: "Sample Music",
      title: "title",
      artist: "",
      imageUrl: "https://yt3.ggpht.com/a/AGF-l7-GzUSbLNsd66pJy2tnI6wMDBmu4rKgInMk8Q=s288-c-k-c0xffffffff-no-rj-mo",
      spotifyID: null,
      searchStatus: "",
    }
    Object.assign(this.state, this.props.info);
  }

  setDate = (_date) => { this.setState({ date: _date }) }
  setTime = (_time) => { this.setState({ time: _time }) }
  setMusicId = (_musicId) => { this.setState({ musicId: _musicId }) }
  setSpotifyID = (_spotifyID) => { this.setState({ spotifyID: _spotifyID }) }
  setTitle = (_title) => { this.setState({ title: _title }) }
  setArtist = (_artist) => { this.setState({ artist: _artist }) }
  setImageUrl = (_imageUrl) => { this.setState({ imageUrl: _imageUrl }) }

  saveData = async () => {
    if(this.state.id === null)  this.state.id = Date.now().toString();
    this.props.storeMarker(this.state);
    this.props.closeModal();
    Alert.alert("Success", "set the music in your world !!!")
  }

  setMusic = (num) => { 
    this.setState({
      musicId: musicData[num].title,
      title: musicData[num].title,
      artist: musicData[num].artist,
      spotifyID: musicData[num].spotifyID,
      imageUrl: musicData[num].imageUrl
    }); 
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
        for(let i=0; i < musicData.length; i++){
          trackJSX.push(
            <Button title={"Title: "+ musicData[i].title + " Artist: "+ musicData[i].artist} onPress={this.setMusic.bind(this,i)}/>
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
          <Time
            setDate={this.setDate}
            setTime={this.setTime}>
          </Time>
        </View >

        {/* Spotify */}
        {/* <View style={{ flex: 1, backgroundColor: '#FF0000', margin: 10}}> */}
        <View style={styles.container}>
          <SpotifyView
            setSpotifyID={this.setSpotifyID}
            setTitle={this.setTitle}
            setArtist={this.setArtist}
            setImageUrl={this.setImageUrl}>
          </SpotifyView>
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