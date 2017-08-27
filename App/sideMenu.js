import React, {Component} from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';

export default class SideMenu3D extends Component{
  constructor(props){
    super(props);

    var tmp=[];
    for(var items in this.props.Items)
      tmp.push(new Animated.Value(-Dimensions.get("window").width));

    this.state={
      sideMenuAnimations:tmp,
      duration:(this.props.Duration!=null?this.props.Duration:1000),
      indexActive:(this.props.InitialRender!=null?this.props.InitialRender:0),
      animPerspective: new Animated.Value(1),
      animTranslateX: new Animated.Value(0),
      animRotateY: new Animated.Value(0),
      animScale: new Animated.Value(0),
      bringFront:false,
    }
  }
  componentDidMount(){
    this.fullAnimation();
  }
  componentDidUpdate(){
    this.fullAnimation();
  }
  menuItemClicked(index){
    this.props.OnPress();
    this.setState({indexActive:index});
  }
  renderSideMenu(){
    var self=this;
    return this.props.Items.map(function(item, index){
      return(
        <TouchableWithoutFeedback key={index} onPress={()=>{
          if(item.onPress!=undefined){
            item.onPress();
          }else{
            self.menuItemClicked(index)
          }
          }}>
          <Animated.View style={{transform:[{translateX:self.state.sideMenuAnimations[index]}]}}>
            {item.text}
          </Animated.View>
        </TouchableWithoutFeedback>
      );
    });
  }

  renderFront(){
    return(
      this.props.Items[this.state.indexActive].renderScene
    );
  }

  render() {
    return (
      <View style={[styles.full]}>
        <View style={[styles.back]}>
          {this.props.BackgroundView}
        </View>
        <View style={[styles.front,{zIndex:(this.state.bringFront?3:-1),width:Dimensions.get("window").width*.55}]}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {this.renderSideMenu()}
          </ScrollView>
        </View>
        <View style={[styles.full]}>
        <Animated.View style={[styles.full,{
          transform: [
            { perspective: (Platform.OS==='ios') ?
                            this.state.animPerspective.interpolate({inputRange:[0,1],outputRange:[1,-850]}) :
                            this.state.animPerspective.interpolate({inputRange:[0,1],outputRange:[1,850]}) },
            { translateX: (Platform.OS==='ios') ?
                            this.state.animTranslateX.interpolate({inputRange:[0,1],outputRange:[0,Dimensions.get("window").width*.3]}) :
                            this.state.animTranslateX.interpolate({inputRange:[0,1],outputRange:[0,Dimensions.get("window").width*.3]}) },
            { rotateY: (Platform.OS==='ios') ?
                            this.state.animRotateY.interpolate({inputRange:[0,.3,1],outputRange:["0deg","0deg","60deg"]}) :
                            this.state.animRotateY.interpolate({inputRange:[0,.3,1],outputRange:["0deg","0deg","-60deg"]}) },
            { scale: (Platform.OS==='ios') ?
                            this.state.animScale.interpolate({inputRange:[0,1],outputRange:[1,.95]}) :
                            this.state.animScale.interpolate({inputRange:[0,1],outputRange:[1,.95]}) }
          ],zIndex:(this.state.bringFront?-1:3)}]}>
          
          {this.renderFront()}
        </Animated.View>
        </View>
      </View>

    );
  }

  fullAnimation(){
    var self=this;
    if(this.props.Visible){
      Animated.parallel([
        Animated.stagger(100,this.props.Items.map((item,index)=>{
          return Animated.timing(self.state.sideMenuAnimations[index],{
            toValue:0,
            duration:self.state.duration,
            delay:500
          })
        })),
        Animated.timing(this.state.animPerspective, {
          toValue: 1,
          duration: this.state.duration,
          delay: 0
        }),
        Animated.timing(this.state.animTranslateX, {
          toValue: 1,
          duration: this.state.duration,
          delay: 0
        }),
        Animated.timing(this.state.animRotateY, {
          toValue: 1,
          duration: this.state.duration,
          delay: 0
        }),
        Animated.timing(this.state.animScale, {
          toValue: 1,
          duration: this.state.duration,
          delay: 0
        })
      ]).start((obj)=>{
        if(obj.finished){
          this.setState({bringFront:true})
        }
      });
    }else{
      Animated.parallel([
        Animated.stagger(50,this.props.Items.map((item,index)=>{
          return Animated.timing(self.state.sideMenuAnimations[index],{
            toValue:-Dimensions.get("window").width,
            duration:self.state.duration,
            delay:250
          })
        })),
        Animated.timing(this.state.animPerspective, {
          toValue: 0,
          duration: this.state.duration,
          delay: 50*(this.props.Items.length-2)
        }),
        Animated.timing(this.state.animTranslateX, {
          toValue: 0,
          duration: this.state.duration,
          delay: 50*(this.props.Items.length-2)
        }),
        Animated.timing(this.state.animRotateY, {
          toValue: 0,
          duration: this.state.duration,
          delay: 50*(this.props.Items.length-2)
        }),
        Animated.timing(this.state.animScale, {
          toValue: 0,
          duration: this.state.duration,
          delay: 50*(this.props.Items.length-2)
        })
      ]).start((obj)=>{
        if(obj.finished){
          this.setState({bringFront:false})
        }
      });
    }
  }
}

const styles = StyleSheet.create({
  full:{
    flex:1,
  },
  front:{
    backgroundColor:'transparent',
    position:'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  back:{
    zIndex:-2,
    position:'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
})