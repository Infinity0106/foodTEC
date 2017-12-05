import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as firebase from "firebase";
import { Actions } from "react-native-router-flux";
import Animation from "lottie-react-native";
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";

export default class nameClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: ""
    };
  }

  componentWillMount() {
    var self = this;
    console.disableYellowBox = true;
    // firebase.auth().signOut();
    FCM.requestPermissions()
      .then(() => console.log("granted"))
      .catch(() => console.log("notification permission rejected"));
    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        requestAnimationFrame(() => {
          Actions.drawer({ type: "reset" });
        });
      } else {
        requestAnimationFrame(() => {
          Actions.login({ type: "reset" });
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>loading...</Text>
      </View>
    );
  }
  componentDidMount() {}
  componentWillUnmount() {
    // this.notificationListner.remove();
    // this.refreshTokenListener.remove();
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
