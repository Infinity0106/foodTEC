import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import Animation from "lottie-react-native";
import * as firebase from "firebase";
import Cause from "../svgComponents/Cause";
import Deliver from "../svgComponents/Deliver";
import Location from "../svgComponents/Location";
import Swipeout from "react-native-swipeout";

export default class swipeProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      photoURL: null,
      collapsable: true
    };
  }
  componentWillMount() {
    var self = this;
    firebase
      .storage()
      .ref()
      .child("products")
      .child(this.props.data.key + ".jpg")
      .getDownloadURL()
      .then(url => {
        if (url) {
          self.setState({ loading: false, photoURL: url });
        }
      })
      .catch(e => {
        self.setState({ loading: "error" });
        console.log(e);
      });
  }
  renderLeftCol() {
    switch (this.state.loading) {
      case true:
        return (
          <Animation
            ref={animation => {
              this.animation = animation;
            }}
            style={styles.lottieImg}
            source={require("../img/3d_rotate_loading_animation.json")}
            loop
          />
        );
        break;
      case false:
        return (
          <Image
            source={{ uri: this.state.photoURL }}
            style={styles.imgStyle}
          />
        );
        break;
      case "error":
        return (
          <Animation
            ref={animation => {
              this.animation2 = animation;
              if (this.animation2 != null) {
                this.animation2.play();
              }
            }}
            style={styles.lottieImg}
            source={require("../img/warning_sign.json")}
          />
        );
        break;
    }
  }
  renderImage() {
    if (this.props.data.type === "in-place") {
      return <Location width={50} height={50} />;
    } else {
      return <Deliver width={40} height={40} />;
    }
  }
  renderMiddle() {
    return (
      <View>
        <Row>
          <Text>{this.props.data.name}</Text>
        </Row>
        <Row>
          <Grid>
            <Col size={30} style={styles.imageBottom}>
              {this.renderImage()}
            </Col>
            <Col size={70}>
              <Row>
                <Text>{this.props.data.type}</Text>
              </Row>
              <Row>
                <Text style={styles.rightText}>
                  {this.props.data.benefit ? "in-benefit of" : ""}
                </Text>
              </Row>
            </Col>
          </Grid>
        </Row>
      </View>
    );
  }
  renderRightCol() {
    if (this.props.data.benefit) {
      return (
        <View>
          <Text style={styles.priceText}>${this.props.data.price}</Text>
          <Cause width={50} height={50} />
        </View>
      );
    } else {
      return <Text style={styles.priceText}>${this.props.data.price}</Text>;
    }
  }
  render() {
    return (
      <Swipeout
        style={styles.swipe}
        right={[
          {
            text: "elminar",
            backgroundColor: "#F70E0E",
            color: "#fff",
            onPress: (() => {
              var self = this;
              firebase
                .database()
                .ref()
                .child("products")
                .child(this.props.data.key)
                .remove()
                .then(() => {
                  firebase
                    .storage()
                    .ref()
                    .child("products")
                    .child(this.props.data.key + ".jpg")
                    .delete()
                    .then();
                  self.props.getData();
                });
            }).bind(this),
            underlayColor: "rgba(247,14,14,.5)"
          }
        ]}
      >
        <View style={{ paddingBottom: 10 }}>
          <View style={styles.container}>
            <Grid>
              <Col style={styles.leftCol} size={25}>
                {this.renderLeftCol()}
              </Col>
              <Col style={styles.midCol} size={60}>
                {this.renderMiddle()}
              </Col>
              <Col style={styles.rightCol} size={15}>
                {this.renderRightCol()}
              </Col>
            </Grid>
          </View>
        </View>
      </Swipeout>
    );
  }
  componentDidMount() {
    var self = this;
    this.animation.play();
  }
  componentWillUnmount() {}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    borderRadius: 10
  },
  br10: {
    borderRadius: 10
  },
  leftCol: {
    justifyContent: "center"
  },
  rightCol: {
    alignItems: "flex-end",
    marginRight: 5,
    marginVertical: 5
  },
  midCol: {},
  lottieImg: {
    alignSelf: "center",
    marginLeft: 28,
    marginTop: -5,
    marginBottom: -15,
    width: 150,
    height: 100
  },
  imgStyle: {
    width: 70,
    height: 70,
    marginLeft: 10,
    borderRadius: 70 / 2,
    borderWidth: 1,
    borderColor: "#EC5C00",
    marginVertical: 5
  },
  priceText: {
    color: "#316650",
    fontSize: 18
  },
  collapsable: {
    marginHorizontal: 20,
    backgroundColor: "#EF7C32",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 3
  },
  tW: {
    color: "white"
  },
  mB10: {
    marginBottom: "10"
  },
  imageBottom: {
    justifyContent: "flex-end"
  },
  rightText: {
    alignSelf: "flex-end"
  },
  swipe: {
    backgroundColor: "transparent"
  }
});
