import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Router, Scene, ActionConst } from 'react-native-router-flux';
import * as firebase from 'firebase';
import Login from './login';
import Home from './home';
import Redirect from './redirect';
import Drawer from './drawer';
import BuyToGO from './buyToGo';

var config = {
  apiKey: "AIzaSyCoS08VOgYiAw9DWZcFsyOe8PK0d2JPF88",
  authDomain: "foodtec-d3882.firebaseapp.com",
  databaseURL: "https://foodtec-d3882.firebaseio.com",
  projectId: "foodtec-d3882",
  storageBucket: "foodtec-d3882.appspot.com",
  messagingSenderId: "763370482980"
};
firebase.initializeApp(config);

export default class index extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }
  componentWillMount(){
    // firebase.auth().signOut();
  }
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="redirect" component={Redirect} title="redirect" hideNavBar/>
          <Scene key="login" component={Login} title="Login" hideNavBar/>
          <Scene key="drawer" component={Drawer} open={false} hideNavBar/>
          <Scene key="buyToGo" component={BuyToGO} title="buy" hideNavBar/>
        </Scene>
      </Router>
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