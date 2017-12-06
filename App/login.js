import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  WebView,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Platform
} from "react-native";
import { Actions } from "react-native-router-flux";
import { FBLoginManager } from "react-native-facebook-login";
import * as firebase from "firebase";
import LinearGradient from "react-native-linear-gradient";
import RNFetchBlob from "react-native-fetch-blob";
import AppIntro from "react-native-app-intro";
import Location from "../svgComponents/Location";
import Deliver from "../svgComponents/Deliver";
import Cause from "../svgComponents/Cause";

export default class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: ""
    };
  }
  componentWillMount() {
    if (Platform.OS == "ios") {
      FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web);
    } else {
      FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.WebView);
    }
  }
  getImageProfile(url, uid) {
    var self = this;
    RNFetchBlob.fetch("GET", url).then(res => {
      self.prevBlob = window.Blob;
      self.prevXML = window.XMLHttpRequest;
      const Blob = RNFetchBlob.polyfill.Blob;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;
      window.Blob.build(res.data, { type: "image/jpeg;base64" }).then(blob => {
        firebase
          .storage()
          .ref()
          .child("users/" + uid + ".jpg")
          .put(blob)
          .then(s => {
            window.XMLHttpRequest = self.prevXML;
            window.Blob = self.prevBlob;
            firebase
              .storage()
              .ref()
              .child("users/" + uid + ".jpg")
              .getDownloadURL()
              .then(url => {
                firebase
                  .database()
                  .ref()
                  .child("users")
                  .child(uid)
                  .child("photo")
                  .set(url);
              });
          });
      });
    });
  }
  slideChange(index, total) {
    console.log(index, total);
  }
  logInWithFacebook() {
    var self = this;
    FBLoginManager.loginWithPermissions(
      ["email", "public_profile"],
      (error, data) => {
        if (!error) {
          const credential = firebase.auth.FacebookAuthProvider.credential(
            data.credentials.token
          );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(user) {
              if (user) {
                firebase
                  .database()
                  .ref("users/" + user.uid)
                  .set({
                    name: user.displayName,
                    email: user.email || null,
                    photo: user.providerData[0].photoURL,
                    faceID: user.providerData[0].uid
                  });
                self.getImageProfile(user.providerData[0].photoURL, user.uid);
                AsyncStorage.setItem("user", JSON.stringify(user));
                // Actions.drawer({ type: "reset" });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          console.log(error, data);
        }
      }
    );
  }
  render() {
    return (
      <LinearGradient
        colors={["#EC5C00", "#F5E868"]}
        style={styles.linearGradient}
      >
        <AppIntro
          onSlideChange={this.slideChange}
          dotColor={"rgba(0,0,0,0)"}
          activeDotColor={"rgba(0,0,0,0)"}
          showSkipButton={false}
          showDoneButton={false}
        >
          <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Location width={200} height={200} />
            </View>
            <View style={{ flex: 1, justifyContent: "flex-start" }}>
              <Text style={styles.textColor}>
                find the best product around you inside TEC
              </Text>
            </View>
            <View style={styles.bottomText}>
              <Text style={styles.bottomTextColor}>Swipe</Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Deliver width={200} height={200} />
            </View>
            <View style={{ flex: 1, justifyContent: "flex-start" }}>
              <Text style={styles.textColor}>
                find the best product around you inside TEC
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Cause width={200} height={200} />
            </View>
            <View style={{ flex: 1, justifyContent: "flex-start" }}>
              <Text style={styles.textColor}>
                find the best product around you inside TEC
              </Text>
            </View>
          </View>
        </AppIntro>
        <View style={styles.buttonFacebook}>
          <TouchableOpacity
            style={{ backgroundColor: "transparent" }}
            onPress={() => {
              this.logInWithFacebook();
            }}
          >
            <Text
              style={{
                textAlign: "center",
                paddingVertical: 10,
                color: "#fff",
                fontSize: 16
              }}
            >
              Iniciar sesión con facebook
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
  componentDidMount() {}
  componentWillUnmount() {}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  linearGradient: {
    flex: 1,
    paddingTop: 15
  },
  bottomText: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  textColor: {
    color: "#f9f9f9"
  },
  bottomTextColor: {
    color: "#524242"
  },
  buttonFacebook: {
    position: "absolute",
    bottom: 75,
    left: 0,
    right: 0,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#3b5998",
    borderRadius: 20
  }
});
