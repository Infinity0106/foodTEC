import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList } from 'react-native';
import * as firebase from 'firebase';
import Header from './header';
import SwipeProductCard from './swipeProductCard';

export default class nameClass extends Component {
  constructor(props){
    super(props);
    this.state={
      data:[],
      loading:true
    }
  }
  componentWillMount(){
    this.getData();
  }
  getData(){
    firebase.database().ref().child("products").once("value",((s)=>{
      var tmpArray=[];
      if(s.val()!=null){
        Object.entries(s.val()).forEach(([key,val])=>{
          val.key=key;
          if(val.uid!=undefined&&val.uid==this.props.uid){
            tmpArray.push(val);
          }
        })
      }
      this.setState({data:tmpArray,loading:false})
    }).bind(this))
  }
  renderList(){
    if(this.state.loading){
      return <ActivityIndicator animating={true} size={"large"}/>
    }else{
      return <FlatList
        data={this.state.data}
        renderItem={({item})=><SwipeProductCard data={item} getData={this.getData.bind(this)}/>}
        extraData={this.state}
      />
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header></Header>
        <View style={styles.container}>
          {this.renderList()}
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
    backgroundColor: '#F5FCFF',
  },
});