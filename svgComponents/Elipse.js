import React from "react";
import {View} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Ellipse } from "react-native-svg";

const Elipse = props => (
  <View >
<Svg width={props.width || 375} height={props.height || 17.5} viewBox="0 0 59.1 17.5">
  <Defs >
  <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
    <Stop offset="0%" stopColor="#EC5C00" stopOpacity="1" />
    <Stop offset="100%" stopColor="#F5E868" stopOpacity="1" />
  </LinearGradient>
  </Defs>
  
  <Ellipse fill="url(#grad)" cx="29.55" cy="8.75" rx="82" ry="8.75"></Ellipse></Svg>
  </View>
);

export default Elipse;
