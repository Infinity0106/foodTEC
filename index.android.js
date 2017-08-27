import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Index from './App/index';

export default class foodTEC extends Component {
  render() {
    return (
      <Index/>
    );
  }
}

AppRegistry.registerComponent('foodTEC', () => foodTEC);