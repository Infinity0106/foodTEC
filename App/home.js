import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Header from './header';
import * as firebase from 'firebase';
import ProductCard from './productCard';

export default class home extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:true,
      data:[],
    }
  }
  componentWillMount(){
    var self=this;
    firebase.database().ref().child("products").once("value",(snap)=>{
      var tmpArray=[];
      if(snap.val()!=null){
        Object.entries(snap.val()).forEach(([key,val])=>{
          val.key=key;
          tmpArray.push(val);
        })
      }
      self.setState({data:tmpArray,loading:false});
    })
    
  }
  renderProducts(){
    if(this.state.loading){
      return <ActivityIndicator animating={true} size={"large"}/>
    }else{
      return (
        <FlatList
          data={this.state.data}
          renderItem={({item})=><ProductCard data={item} fotoUser={this.props.fotoUser}/>}
          extraData={this.state}
        />
      )
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header OnPress={this.props.OnPress}/>
        <View style={styles.container}>
          {this.renderProducts()}
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
    flex: 1,
    backgroundColor:'#f4f4f4'
  },
  
});