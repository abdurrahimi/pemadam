import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  View,
  AsyncStorage
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import APIKit, { setClientToken } from '../api/Api';
import axios from 'axios';

const { width, height } = Dimensions.get("screen");


const initialState = {
  username: '',
  password: '',
  errors: {},
  isAuthorized: false,
  isLoading: false,
};

class Login extends React.Component {

  state = initialState;
  componentWillUnmount() {
    StatusBar.setHidden(false);

    try {
      const value = AsyncStorage.getItem('login');
      if (value !== null) {
        this.setState({ isAuthorized: true });
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  onUsernameChange = username => {
    this.setState({ username });
  };

  onPasswordChange = password => {
    this.setState({ password });
  };

  onPressLogin() {

    const { username } = this.state;
    const { password } = this.state;
    const { navigation } = this.props;
    const payload = { username, password };
    //console.log(payload);

    // Show spinner when call is made
    this.setState({ isLoading: true });

    APIKit.post("/loginMember/", {
      payload
    }).then((response) => {
      //console.log(response);
      const result = JSON.stringify(response.data.results.status_request);
      if (result == '"OK"') {

        AsyncStorage.setItem('login', 'true');
        AsyncStorage.setItem('userID', JSON.stringify(response.data.results.profile.userid));
        this.setState({ isLoading: false, /*isAuthorized: true*/ });
        console.log(response.data.results.profile.userid);
        navigation.navigate("App", { location: null });
      } else {
        this.setState({ isLoading: false, isAuthorized: false });
        Alert.alert(response.data.results.msg);
      }
    });
  }
  render() {
    const { navigation } = this.props;
    const { isLoading } = this.state;
    const { isAuthorized } = this.state;
    if (isLoading == true) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    if (isAuthorized == true) {
      navigation.navigate("App");
    }
    return (
      <Block flex middle>
        <StatusBar barStyle="dark-content" backgroundColor="#172B4D" />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block flex={0.25} middle style={styles.socialConnect}>
                <Text color="#8898AA" size={36}>
                  LOGIN
                </Text>
              </Block>
              <Block flex>
                <Block flex={0.17} middle>
                  <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text color="#8898AA" size={12}>
                      or click here to Sign Up
                  </Text>
                  </TouchableOpacity>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Username"
                        onChangeText={this.onUsernameChange}
                        autoCapitalize='none'
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8}>
                      <Input
                        password
                        borderless
                        onChangeText={this.onPasswordChange}
                        placeholder="Password"
                        autoCapitalize='none'
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block middle>
                      <Button onPress={this.onPressLogin.bind(this)} color="primary" style={styles.createButton}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          LOGIN
                        </Text>
                      </Button>
                    </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.5,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});

export default Login;
