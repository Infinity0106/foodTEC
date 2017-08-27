import React, { Component } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Image, Text } from 'react-native';
import * as firebase from 'firebase';
import Header from './header';
import OrderCard from './orderCard';

export default class nameClass extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:true,
      data:[],
    }
  }
  componentWillMount(){
    this.getData();
  }
  getData(){
    var self=this;
    firebase.database().ref().child("orders").once('value',(s)=>{
      var tmparr=[]
      if(s.val()!=null){
        Object.entries(s.val()).forEach(([key,val])=>{
          Object.entries(val).forEach(([key2,val2])=>{
            val2.buyerID=key;
            val2.key=key2;
            if(val2.sellerID==this.props.uid){
              tmparr.push(val2)
            }
          })
        })
      }else{
        self.setState({loading:false});
      }
      console.log(tmparr);
      self.setState({data:tmparr,loading:false});
    })
  }
  renderList(){
    if(this.state.loading){
      return <ActivityIndicator animating={true} size={"large"}/>
    }else{
      return (
        <FlatList
          data={this.state.data}
          renderItem={({item})=><OrderCard data={item} swipe={true} getData={this.getData.bind(this)}/>}
          extraData={this.state}
        />
      )
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header></Header>
        <View style={styles.container}>
          <Text>Que pedidos tengo?</Text>
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