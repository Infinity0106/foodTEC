import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';
import Logo from '../svgComponents/FoodTEC';
import Menu from '../svgComponents/Menu';
import Elipse from '../svgComponents/Elipse';
import Back from '../svgComponents/Back';

export default class Header extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }
  componentWillMount(){
    
  }
  navigationOptions(){
    if(!this.props.back||this.props.back==undefined){
      Actions.refresh({key: 'drawer', open: !this.props.open })
    }else{
      Actions.pop();
    }
  }
  render() {
    return (
      <View style={styles.header}>
      <View style={styles.container}>
        <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#EC5C00', '#F5E868']} style={styles.linearGradient}>
          <View style={[styles.f1,styles.menu]}>
            <TouchableOpacity onPress={this.navigationOptions.bind(this)}>
              {this.props.back&&this.props.back!=undefined?
              <Back height={40} width={30}/>:
              <Menu height={40} width={30}/>}
            </TouchableOpacity>
          </View>
          <View style={[styles.f1,styles.center,styles.pt10]}>
            <Logo width={120} height={60}/>
          </View>
          <View style={styles.f1}></View>
          <View style={styles.elipse}>
            <Elipse width={375} height={40}/>
          </View>
        </LinearGradient>
      </View>
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
    flex:1,
    marginBottom:30
  },
  center:{
    justifyContent:'center',
    alignItems:'center',
  },
  linearGradient:{
    flex:1,
    paddingTop:15,
    flexDirection:'row'
  },
  f1:{
    flex:1
  },
  menu:{
    justifyContent:'center',
    alignItems:"flex-start",
    paddingLeft:20
  },
  pt10:{
    paddingTop:10
  },
  elipse:{
    position:'absolute',
    bottom:-20,
    zIndex:-1
  },
  header:{
    height:84
  }
});