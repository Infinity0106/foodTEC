import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions, AsyncStorage } from 'react-native';
import { Router, Scene, Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
import { FBLoginManager } from 'react-native-facebook-login';
import SideMenu3D from './sideMenu';
import Home from './home';
import Publish from './publishProduct';
import MyProducts from './myProducts';
import BuyToGO from './buyToGo';
import MyOrders from './myOrders';
import MyPedidos from './myPedidos';
import Animation from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import OctIcon from 'react-native-vector-icons/Octicons';
// import Entypo from 'react-native-vector-icons/Entypo';//shop,
// import Iconicons from 'react-native-vector-icons/Iconicons';//ios-add-circle,ios-paper
// import Octicons from 'react-native-vector-icons/Octicons';//package,sign-out


const {width,height} = Dimensions.get("window");

export default class drawer extends Component {
  constructor(props){
    super(props);
    this.state={
      foto:'https://facebook.github.io/react/img/logo_og.png',
      uid:null
    }
  }
  componentWillMount(){
    var self=this;
    AsyncStorage.getItem("user",(e,res)=>{
      res = JSON.parse(res);
      console.log(res);
      self.setState({
        foto:(res!=null?res.photoURL:'https://facebook.github.io/react/img/logo_og.png'),
        uid:res.uid
      })
    })
  }
  toggleVisible(){
    Actions.refresh({key: 'drawer', open: !this.props.open })
  }
  render() {
    console.log(Actions);
    return (
      <SideMenu3D
        Visible={this.props.open}
        Duration={1000}
        InitialRender={1}
        OnPress={this.toggleVisible.bind(this)}
        BackgroundView={
                        <View style={{flex:1}}>
                          <Animation
                            ref={animation => { this.animation = animation; }}
                            style={{
                              width: width,
                              height: height,
                            }}
                            source={require('../img/background.json')}
                            loop
                          />
                        </View>
                      }
        Items={[
          {
            text: <View style={{justifyContent:'center',alignItems:'center',paddingTop:30,flex:1}}>
                    <Image style={{width: 50, height: 50,borderRadius:25,marginBottom:10}}
                    source={{uri: this.state.foto}}/>
                    <Text style={{color:'white',paddingVertical:10}}>
                      <Icon name="list" size={25} color="#fff" />     Mis Productos
                    </Text>
                    <View style={{borderColor:"#fff",borderWidth:1,alignSelf:'stretch'}}></View>
                  </View>,
            renderScene:<MyProducts uid={this.state.uid}></MyProducts>
          },{
            text: <View>
              <Text style={{color:'white',paddingVertical:10,alignSelf:'center'}}>
                <Icon name="shop" size={30} color="#fff" />    Comprar
              </Text>
              <View style={{borderColor:"#fff",borderWidth:1,alignSelf:'stretch'}}></View>
            </View>,
            renderScene:<Home fotoUser={this.state.foto}/>
          },{
            text: <View>
              <Text style={{color:'white',paddingVertical:10,alignSelf:'center'}}>
                <Ionicon name="ios-add-circle" size={30} color="#fff" />    Publicar
              </Text>
              <View style={{borderColor:"#fff",borderWidth:1,alignSelf:'stretch'}}></View>
            </View>,
            renderScene:<Publish uid={this.state.uid}></Publish>
          },{
            text: <View>
              <Text style={{color:'white',paddingVertical:10,alignSelf:'center'}}>
                <Ionicon name="ios-paper" size={30} color="#fff" />    Mis Pedidos
              </Text>
              <View style={{borderColor:"#fff",borderWidth:1,alignSelf:'stretch'}}></View>
            </View>,
            renderScene:<MyPedidos uid={this.state.uid}></MyPedidos>
          },{
            text: <View>
              <Text style={{color:'white',paddingVertical:10,alignSelf:'center'}}>
                <OctIcon name="package" size={30} color="#fff" />    Mis Ordenes
              </Text>
              <View style={{borderColor:"#fff",borderWidth:1,alignSelf:'stretch'}}></View>
            </View>,
            renderScene:<MyOrders uid={this.state.uid}></MyOrders>
          },{
            text: <View>
              <Text style={{color:'white',paddingVertical:10,alignSelf:'center'}}>
                <OctIcon name="sign-out" size={30} color="#fff" />    Cerrar Sesion
              </Text>
              <View style={{borderColor:"#fff",borderWidth:1,alignSelf:'stretch'}}></View>
            </View>,
            onPress:()=>{
              
              firebase.auth().signOut().then(()=>{
                FBLoginManager.logout((e,d)=>{
                  if(!e){
                    AsyncStorage.clear();
                  }
                });
                
              })
            },
            renderScene:<Publish uid={this.state.uid}></Publish>
          }
        ]}
      />
    );
  }
  componentDidMount(){
    this.animation.play();
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