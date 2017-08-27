import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import Animation from 'lottie-react-native';
// import OneSignal from 'react-native-onesignal';

export default class nameClass extends Component {
  constructor(props){
    super(props);
    this.state={
      device:''
    }
  }
  componentWillMount(){
    var self=this;
    // OneSignal.configure({});
    // OneSignal.requestPermissions({
    //   alert: true,
    //   badge: true,
    //   sound: true
    // })
    // OneSignal.registerForPushNotifications();
    console.disableYellowBox = true;
    // firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        requestAnimationFrame(()=>{
          Actions.drawer();
        })
      }else{
        requestAnimationFrame(()=>{
          Actions.login({type:'reset'});
        })
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>loading...</Text>
      </View>
    );
  }
  componentDidMount(){

  }
  componentWillUnmount(){
    
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});