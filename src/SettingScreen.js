import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, Image , TextInput} from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import { Time } from './components/Time.js';
import { SpotifyView } from './components/SpotifyView.js';
import { thisExpression } from '@babel/types';
import Spotify from 'rn-spotify-sdk';

const musicData =[];
const screen = Dimensions.get('window');
let trackJSX=[];

export class SettingScreen extends React.Component {
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

  settingLocation = (_lat, _lon) => { this.setState({ coordinate: {_lat, _lon} }) }

  settingDate = (_date) => { this.setState({ date: _date }); console.log('date set'); }

  settingTime = (_time) => { this.setState({ time: _time }) }

  settingMusicId = (_musicId) => { this.setState({ musicId: _musicId }) }

  settingSpotifyID = (_spotifyID) => { this.setState({ spotifyID: _spotifyID }) }

  settingTitle = (_title) => { this.setState({ title: _title }) }

  settingArtist = (_artist) => { this.setState({ artist: _artist }) }

  settingImageUrl = (_url) => { this.setState({ imageUrl: _url }) }

  async saveData() {
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

  async searchMusic(){
    await Spotify.search(this.state.searchStatus,['track'])
      .then(
        res => {
          musicData.length = 0;
          var musicList = res.tracks;
          for(let ttmmpp=0; ttmmpp<20;ttmmpp++){
            musicData.push({
              title: musicList.items[ttmmpp]["album"]["name"],
              artist: musicList.items[ttmmpp]["album"]["artists"][0]["name"],
              spotifyID: musicList.items[ttmmpp]["id"],
              imageUrl: musicList.items[ttmmpp]["album"]["images"][2]["url"],
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
  }

  onChangeText = (text) => {
    this.setState({
      searchStatus: text,
    })
  }

  render() {

    return (
      <View style={styles.Setting}>
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
          <Button title="Search" onPress={() => {this.searchMusic();}} />
          <Modal style={styles.modal} position={"center"} backdrop={true} ref={"modal1"} swipeArea={20} coverScreen={true}>
            <ScrollView width={screen.width}>
              <View>
              { trackJSX }
              </View>
            </ScrollView>
          </Modal>
        </View>

        <View style={styles.container}>
          <Time settingDate={this.settingDate} settingTime={this.settingTime}></Time>
        </View >

        {/* Spotify */}
        {/* <View style={{ flex: 1, backgroundColor: '#FF0000', margin: 10}}> */}
        <View style={styles.container}>
          <SpotifyView settingSpotifyID={this.settingSpotifyID} settingTitle={this.settingTitle} settingArtist={this.settingArtist} settingImageUrl={this.settingImageUrl}></SpotifyView>
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

  Setting: {
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