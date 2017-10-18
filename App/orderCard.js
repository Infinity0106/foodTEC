import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import Swipeout from "react-native-swipeout";
import * as firebase from "firebase";

export default class orderCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      photoUri: ""
    };
  }
  componentWillMount() {
    var self = this;
    firebase
      .database()
      .ref()
      .child("users")
      .child(this.props.data.buyerID)
      .once("value", s => {
        self.setState({ photoUri: s.val().photo, loading: false });
      });
  }
  renderImage() {
    if (this.state.loading) {
      return (
        <Image
          source={require("../img/person.png")}
          style={styles.imageStyle}
        />
      );
    } else {
      return (
        <Image
          source={{ uri: this.state.photoUri }}
          style={styles.imageStyle}
        />
      );
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
                .child("orders")
                .child(this.props.data.buyerID)
                .child(this.props.data.key)
                .remove()
                .then(() => {
                  self.props.getData();
                });
            }).bind(this),
            underlayColor: "rgba(247,14,14,.5)",
            disabled: !this.props.swipe
          }
        ]}
      >
        <View style={styles.container}>
          <Grid>
            <Col size={30}>{this.renderImage()}</Col>
            <Col size={70}>
              <Row style={{ alignItems: "flex-end" }}>
                <Text>
                  Deliver To:{" "}
                  <Text style={{ color: "orange" }}>
                    {this.props.data.location}
                  </Text>
                </Text>
              </Row>
              <Row style={{ alignItems: "flex-start" }}>
                <Text>
                  Wapp:{" "}
                  <Text style={{ color: "orange" }}>
                    {this.props.data.wapp}
                  </Text>
                </Text>
              </Row>
            </Col>
          </Grid>
        </View>
      </Swipeout>
    );
  }
  componentDidMount() {}
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
    borderRadius: 10,
    marginBottom: 10
  },
  imageStyle: {
    width: 70,
    height: 70,
    marginLeft: 10,
    borderRadius: 70 / 2,
    borderWidth: 1,
    borderColor: "#EC5C00",
    marginVertical: 5
  },
  swipe: {
    backgroundColor: "transparent"
  }
});
