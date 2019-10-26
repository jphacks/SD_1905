import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import { Time } from './components/Time.js';
import { SpotifyView } from './components/SpotifyView.js';

const musicData =[];
const screen = Dimensions.get('window');

for(let i=0; i < 30; i++){ //テストデータ作成
  musicData.push({
    title: "musicTitle"+i,
    artist: "artist"+i,
    genre: "musicGenre"+i,
    musicAlbum: "Album"+i,
  });
}

export class SettingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // location info
      latitude: this.props.lat,
      longitude: this.props.lng,
      // time info
      date: null,
      time: null,
      // date: "2016-05-15",
      // time: "8:16 PM",
      // music info
      musicId: "your world is",
      spotifyURI: null
    }
    console.log('new setting screen')
    console.log(this.state.latitude + ' ' + this.state.longitude);
  }

  settingLocation = (_lat, _lon) => { this.setState({ latitude: _lat, longitude: _lon }) }

  settingDate = (_date) => { this.setState({ date: _date }); console.log('date set'); }

  settingTime = (_time) => { this.setState({ time: _time }) }

  settingMusicId = (_musicId) => { this.setState({ musicId: _musicId }) }

  settingSpotifyURI = (_spotifyURI) => { this.setState({ spotifyURI: _spotifyURI }) }

  saveData = () => {
    this.newData = {
        // id: Date.now().toString,
        id: Date.now().toString(),
        time: {
          date: this.state.date,
          time: this.state.time
        },
        place: {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
        musicId: this.state.musicId,
        spotifyURI: this.state.spotifyURI
    }
    this.props.storeMarker(this.newData);
    this.props.closeModal();
    Alert.alert("Success", "set the music in your world !!!")
  }

  setMusic = (num) => { 
    this.setState({musicId: musicData[num].title}); 
    this.refs.modal1.close();
  }

  render() {
    let trackJSX = [];
    for(let i=0; i < musicData.length; i++){
      trackJSX.push(
        <Button title={"title: "+ musicData[i].title + " artist: "+ musicData[i].artist} onPress={this.setMusic.bind(this,i)}/>
      );
    }
    return (
      <View style={styles.Setting}>
        <View style={{ flex: 1, backgroundColor: '#FF00FF', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
        <Button title={this.state.musicId} onPress={() => this.refs.modal1.open()} />
        <Modal style={styles.modal} position={"center"} backdrop={true} ref={"modal1"} swipeArea={20} coverScreen={true}>
          <ScrollView width={screen.width}>
            <View>
            { trackJSX }
            </View>
          </ScrollView>
        </Modal>
        </View >
        <View style={{ flex: 1, backgroundColor: '#FF0000', margin: 10}}>
          <SpotifyView settingSpotifyURI={this.settingSpotifyURI}></SpotifyView>
        </View>
        <View style={{ flex: 1.3, backgroundColor: '#00FF00', justifyContent: 'space-evenly', alignItems: 'center', margin: 0 }}>
          <Time settingDate={this.settingDate} settingTime={this.settingTime}></Time>
        </View >
        <View style={{ flex: 1, backgroundColor: '#FFFF00', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
          <Button title="Save" onPress={this.saveData} />
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
  Setting: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 40,
    paddingBottom: 50,
    backgroundColor: '#FFFFFF'
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 500,
  },
})