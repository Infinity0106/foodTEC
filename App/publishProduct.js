import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, TextInput, ScrollView, Platform, AlertIOS, ToastAndroid } from 'react-native';
import { Grid, Col, Row, } from 'react-native-easy-grid';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import ModalDropdown from 'react-native-modal-dropdown';
import CheckBox from 'react-native-checkbox';
import * as firebase from 'firebase';
import Header from './header';
import PlaceP from '../svgComponents/PlaceProd';

export default class publishProduct extends Component {
  constructor(props){
    super(props);
    this.state={
      photo:undefined,
      nombre:'',
      price:'',
      desde:'',
      hasta:'',
      lugar:'',
      detailLugar:'',
      inBenefit:false,
      wapp:'',
      options1:[
        'Aulas',
        'Biblioteca',
        'Ciap',
        'Learning Commons',
        'Cetec',
        'Centrales',
        'Jubileo',
        'Carreta',
        'Centro Estudiantil',
        'Arizona',
        'Jardin Carreras',
        'Gimnasio',
        'Domo',
      ],
      options2:[
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
      ],
      render2:false,
      checkDeliver:false,
      checkToGo:true,
    }
  }
  componentWillMount(){
    
  }
  selectPhoto(){
    var self=this;
    const options = {
      title: 'Selecciona o toma una nueva fotografía',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options,(response)=>{
      console.log(response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        if(Platform.OS === 'ios'){
          ImageResizer.createResizedImage(response.uri, 200, 200, "JPEG", 50, 0, response.uri).then((response) => {
            RNFetchBlob.fetch('GET',response.uri).then((response)=>{
              self.setState({photo:"data:image/jpeg;base64,"+response.data});
            })
          }).catch((err) => {

          });
        }else{
          RNFetchBlob.fs.readFile(response.path, 'base64').then((resp)=>{
            ImageResizer.createResizedImage('data:image/jpeg;base64,'+resp, 200, 200, "JPEG", 50).then((response) => {
              self.setState({photo:response.uri});
            }).catch((err) => {

            });
          });
        }
      }
    })
  }
  error(id){
    firebase.database().ref().child("products").child(id).remove().then(()=>{
      requestAnimationFrame(()=>{
        Platform.select({
          ios:()=>AlertIOS.alert("ERROR","faltan campos por llenar"),
          android:()=>ToastAndroid.show("faltan campos por llenar", ToastAndroid.SHORT)
        })();
      })
    })
  }
  createProduct(json){
    var self=this;
    firebase.database().ref().child("products").push(json).then((s)=>{
      var ref = s.key;
      if(this.state.photo&&this.state.photo.includes("data:image/jpeg;base64,")){
        self.prevBlob=window.Blob
        self.prevXML=window.XMLHttpRequest
        const Blob = RNFetchBlob.polyfill.Blob;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        window.Blob.build(this.state.photo.replace("data:image/jpeg;base64,",""), { type: 'image/jpeg;base64' })
        .then((blob)=>{
          var uploadTask = firebase.storage().ref().child("products").child(ref+'.jpg').put(blob);
          uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            self.error(e)
          }, function() {
            window.XMLHttpRequest = self.prevXML;
            window.Blob = self.prevBlob;
            Platform.select({
              ios:()=>AlertIOS.alert("SUCCESS","Producto almacenado exitosamente"),
              android:()=>ToastAndroid.show("Producto almacenado exitosamente", ToastAndroid.SHORT)
            })();
          });
        }).catch((e)=>{
          self.error(ref)
        })
      }else if(this.state.photo&&this.state.photo.includes("file:/")){
        self.prevBlob=window.Blob
        self.prevXML=window.XMLHttpRequest
        const Blob = RNFetchBlob.polyfill.Blob;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        window.Blob.build(RNFetchBlob.wrap(this.state.photo), { type : 'image/jpeg' })
        .then((blob) => { 
          var uploadTask = firebase.storage().ref().child("products").child(ref+'.jpg').put(blob);
          uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            self.error(e)
          }, function() {
            window.XMLHttpRequest = self.prevXML;
            window.Blob = self.prevBlob;
            Platform.select({
              ios:()=>AlertIOS.alert("SUCCESS","Producto almacenado exitosamente"),
              android:()=>ToastAndroid.show("Producto almacenado exitosamente", ToastAndroid.SHORT)
            })();
        });

         })
      }else{
        self.error(ref)
      }
    })
  }
  renderImage(){
    if(this.state.photo==undefined){
      return(
        <View style={styles.pt30}>
          <PlaceP width={150} height={150}></PlaceP>
        </View>
      );
    }else{
      return(
        <Image source={{uri:this.state.photo}} style={styles.imageRender}></Image>
      );
    }
  }
  changeOpt1(index,val){
    this.setState({lugar:val,detailLugar:''});
    switch(index){
      case '0':
        this.setState({options2:['1','2','3','4','5','6','7'],render2:true})
        break;
      case '1':
        this.setState({options2:['1','2','3','4','5','6'],render2:true})
        break;
      case '2':
        this.setState({options2:['1','2','3','4','5','6'],render2:true})
        break;
      case '3':
        this.setState({options2:['1','2','3','4','5'],render2:true})
        break;
      default:
        this.setState({detailLugar:'',render2:false});
        break;
    }
  }
  changeOpt2(index,val){
    console.log(val);
    this.setState({detailLugar:val});
  }
  publishInfo(){
    console.log(this.props.uid);
    if(this.state.desde!=''&&this.state.hasta!=''&&this.state.lugar!=''&&this.state.nombre!=''){
      if(this.state.lugar=='Aulas'||this.state.lugar=='Biblioteca'||this.state.lugar=='Ciap'||this.state.lugar=='Learning Commons'){
        if(this.state.checkDeliver){
          var json={
            benefit:this.state.inBenefit,
            name:this.state.nombre,
            price:this.state.price,
            type:"to-go",
            from:this.state.desde,
            hasta:this.state.hasta,
            location:this.state.lugar+' '+this.state.detailLugar,
            wapp:this.state.wapp,
            uid:this.props.uid
          }
          this.createProduct(json);
        }else{
          var json={
            benefit:this.state.inBenefit,
            name:this.state.nombre,
            price:this.state.price,
            type:"in-place",
            from:this.state.desde,
            hasta:this.state.hasta,
            location:this.state.lugar,
            wapp:this.state.wapp,
            uid:this.props.uid
          }
          this.createProduct(json);
        }
      }else{
        if(this.state.checkDeliver){
          var json={
            benefit:this.state.inBenefit,
            name:this.state.nombre,
            price:this.state.price,
            type:"to-go",
            from:this.state.desde,
            hasta:this.state.hasta,
            location:this.state.lugar,
            wapp:this.state.wapp,
            uid:this.props.uid
          }
          this.createProduct(json);
        }else{
          var json={
            benefit:this.state.inBenefit,
            name:this.state.nombre,
            price:this.state.price,
            type:"in-place",
            from:this.state.desde,
            hasta:this.state.hasta,
            location:this.state.lugar,
            wapp:this.state.wapp,
            uid:this.props.uid
          }
          this.createProduct(json);
        }
      }
    }else{
      Platform.select({
          ios:()=>AlertIOS.alert("ERROR","faltan campos por llenar"),
          android:()=>ToastAndroid.show("faltan campos por llenar", ToastAndroid.SHORT)
        })();
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header/>
        <View style={styles.container}>
          <View style={styles.renderImage}>
          <TouchableOpacity onPress={()=>this.selectPhoto()}>
            {this.renderImage()}
          </TouchableOpacity>
          </View>
        <ScrollView>
          <Grid style={styles.margins}>
            <Row size={10}>
              <Col size={70}>
                <Text>Nombre:</Text>
                 <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(text) => this.setState({nombre:text})}
                  value={this.state.nombre}
                />
              </Col>
              <Col size={30}>
                <Text>precio:</Text>
                 <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  keyboardType={"numeric"}
                  onChangeText={(text) => this.setState({price:text})}
                  value={this.state.price}
                />
              </Col>
            </Row>
            <Row size={10}>
              <Col>
                <Text>Desde:</Text>
                 <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(text) => this.setState({desde:text})}
                  value={this.state.desde}
                />
              </Col>
              <Col>
                <Text>Hasta:</Text>
                 <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(text) => this.setState({hasta:text})}
                  value={this.state.hasta}
                />
              </Col>
            </Row>
            <Row size={10}>
              <Col>
                <ModalDropdown defaultValue={"Lugar"} style={styles.btnModal} textStyle={styles.textbtnModal} options={this.state.options1} onSelect={this.changeOpt1.bind(this)}/>
              </Col>
              <Col>
                {this.state.render2 && <ModalDropdown defaultValue={"detalles"} style={styles.btnModal} textStyle={styles.textbtnModal} options={this.state.options2} onSelect={this.changeOpt2.bind(this)}/>}
              </Col>
            </Row>
            <Row size={10}>
              <Col>
                <CheckBox
                  label='in-place'
                  checked={this.state.checkToGo}
                  checkedImage={require('../img/checked.png')}
                  uncheckedImage={require('../img/uncheck.png')}
                  onChange={(checked) => {
                  if(!this.state.checkDeliver){
                    this.setState({checkToGo:!checked})
                  }}}
                />
              </Col>
              <Col>
                <CheckBox
                  label='to-go'
                  checked={this.state.checkDeliver}
                  checkedImage={require('../img/checked.png')}
                  uncheckedImage={require('../img/uncheck.png')}
                  onChange={(checked) => {
                  if(!this.state.checkToGo){
                    this.setState({checkDeliver:!checked})
                  }}}
                />
              </Col>
            </Row>
            <Row size={10}>
              <CheckBox
                label='in-benefit-of (optional)'
                checked={this.state.inBenefit}
                checkedImage={require('../img/radioCheck.png')}
                uncheckedImage={require('../img/radioUnCheck.png')}
                onChange={(checked) => {
                  this.setState({inBenefit:!checked})
                }}
              />
            </Row>
            <Row size={20}>
              <Col>
                <Text>Whatsapp: (optiona)</Text>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(text) => this.setState({wapp:text})}
                  value={this.state.wapp}
                />
              </Col>
            </Row>
            <Row size={10}>
              <Col style={styles.center}>
                <TouchableOpacity onPress={this.publishInfo.bind(this)}>
                  <View style={styles.btnPublicar}>
                    <Text>Publicar</Text>
                  </View>
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
        </ScrollView>
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
    flexGrow:1,
    backgroundColor: '#f4f4f4',
  },
  renderImage:{
    width:150,
    height:150,
    marginLeft:10,
    borderRadius:150/2,
    borderWidth:1,
    borderColor:"#EC5C00",
    marginVertical:5,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
  },
  pt30:{
    paddingTop:30,
  },
  margins:{
    marginHorizontal:10
  },
  btnPublicar:{
    height:40,
    width:200,
    backgroundColor:"yellow",
    borderRadius:50/2,
    justifyContent:'center',
    alignItems:'center'
  },
  textPublicar:{
    
  },
  center:{
    justifyContent:'center',
    alignItems:'center'
  },
  imageRender:{
    width:150,
    height:150,
    borderRadius:150/2
  },
  btnModal:{
    height:40,
    borderWidth:1,
    borderColor:"gray",
    justifyContent:'center'
  },
  textbtnModal:{

  }
});