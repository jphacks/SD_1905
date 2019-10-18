import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class SettingScreen extends React.Component {
    render() {
        return (
            <View style={styles.Setting}>
                <Text style={styles.text}>
                    ここで(場所×時間)→曲の設定をして欲しいdesy
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
    },
    Main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#576071',
    },
    Setting: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#afa598'
    }
})