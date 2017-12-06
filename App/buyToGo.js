import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  Platform,
  AlertIOS,
  ToastAndroid,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import Header from "./header";

export default class buyToGo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      wapp: "",
      uid: "",
      foto: ""
    };
  }
  componentWillMount() {
    console.log(this.props.data.uid);
    var self = this;
    firebase
      .database()
      .ref()
      .child("users")
      .child(this.props.data.uid)
      .once("value", s => {
        self.setState({ uid: self.props.data.uid, foto: s.val().photo });
      });
    // AsyncStorage.getItem("user", (e, r) => {
    //   r = JSON.parse(r);
    //   console.log(r);
    //   self.setState({ uid: r.uid });
    // });
  }
  error() {
    Platform.select({
      ios: () => AlertIOS.alert("ERROR", "faltan campos por llenar"),
      android: () =>
        ToastAndroid.show("faltan campos por llenar", ToastAndroid.SHORT)
    })();
  }
  mandarNot(user) {
    var body = JSON.stringify({
      to: user.fcmToken,
      data: {
        custom_notification: {
          body: "checa quien fue",
          title: "tienes una nueva orden",
          color: "#00ACD4",
          priority: "high",
          id: Date.now().toString(),
          show_in_foreground: true,
          sound: "default",
          click_action: "fcm.ACTION.OPEN_NOTIFICATION",
          vibrate: 300,
          lights: true
        }
      },
      priority: "high",
      click_action: "fcm.ACTION.OPEN_NOTIFICATION"
    });

    let headers = new Headers({
      "Content-Type": "application/json",
      "Content-Length": parseInt(body.length),
      Authorization:
        "key=AAAAsbxtLSQ:APA91bFxWUj_wNVBwEWm7N4xaywT2LtE55xxxbXU7qgvR2oXe8-0Wxr5bTzteXFEYXsP-_sEEPfwhHNJrRXUD-cp1C7zXHGJty6-fHVhq40ZbbBgsBcrbIE2-XduQVkzl2zcn8bJm3dN"
    });

    fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers,
      body
    }).then(res => {
      console.log(res);
      Platform.select({
        ios: () => AlertIOS.alert("SUCCESS", "Orden exitosa"),
        android: () => ToastAndroid.show("Orden exitosa", ToastAndroid.SHORT)
      })();
      Actions.pop();
    });
  }
  placeOrder() {
    if (this.state.location != "" && this.state.wapp != "") {
      var self = this;
      firebase
        .database()
        .ref()
        .child("orders")
        .child(this.props.data.uid)
        .push({
          wapp: this.state.wapp,
          location: this.state.location,
          sellerID: this.state.uid
        })
        .then(() => {
          firebase
            .database()
            .ref()
            .child("users")
            .child(this.props.data.uid)
            .once("value", s => {
              self.mandarNot(s.val());
            });
        });
    } else {
      this.error();
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header back={true} />
        <View style={[styles.container, { marginHorizontal: 5 }]}>
          <View style={styles.renderImage}>
            <Image
              source={{ uri: this.state.foto }}
              style={{ width: 150, height: 150, borderRadius: 150 / 2 }}
            />
          </View>
          <Grid>
            <Row size={10}>
              <Col size={30} style={{ justifyContent: "center" }}>
                <Text>Lugar de espera:</Text>
              </Col>
              <Col size={70}>
                <TextInput
                  style={{
                    height: 40,
                    borderColor: "gray",
                    borderRadius: 20,
                    paddingHorizontal: 5,
                    borderWidth: 1
                  }}
                  onChangeText={text => this.setState({ location: text })}
                  value={this.state.location}
                />
              </Col>
            </Row>
            <Row size={10}>
              <Col size={30} style={{ justifyContent: "center" }}>
                <Text>Wapp:</Text>
              </Col>
              <Col size={70}>
                <TextInput
                  style={{
                    height: 40,
                    borderColor: "gray",
                    borderRadius: 20,
                    paddingHorizontal: 5,
                    borderWidth: 1
                  }}
                  keyboardType={"numeric"}
                  onChangeText={text => this.setState({ wapp: text })}
                  value={this.state.wapp}
                />
              </Col>
            </Row>
            <Row size={80}>
              <Col>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.placeOrder.bind(this)}
                >
                  <Text>Ordenar</Text>
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
        </View>
      </View>
    );
  }
  componentDidMount() {}
  componentWillUnmount() {}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  renderImage: {
    width: 150,
    height: 150,
    marginLeft: 10,
    borderRadius: 150 / 2,
    borderWidth: 1,
    borderColor: "#EC5C00",
    marginVertical: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    width: 200,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: "yellow",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});
