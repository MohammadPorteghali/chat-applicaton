import React, {Component} from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import RootStack from './src/routs'

export default class App extends Component {
  render() {
    return (
        <View style={ styles.container }>
          <RootStack />
        </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  }
});
