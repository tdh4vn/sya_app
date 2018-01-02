import React, { Component } from 'react';
import { Image, AsyncStorage, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';
import {
  Container,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text,
} from 'native-base';
import { login, register } from '../../actions/user';
import styles from './styles';

const background = require('../../../images/logo_sya.png');

class Login extends Component {
  static propTypes = {
    navigation: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    user: React.PropTypes.object,
  };
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorEmail: false,
      errorPassword: false,
      successEmail: false,
      successPassword: false,
      isValidate: false,
      registerAccount: '',
      registerEmail: '',
      registerPassword: '',
    };

    AsyncStorage.getItem('jwt', (err, result) => {
      if (result) {
        this.props.dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            success: true,
            token: result,
            info: {},
          },
        });
        this.props.navigation.navigate('Home');
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.user.success) {
      this.props.navigation.navigate('Home');
    }
  }
  validateEmail = (email) => {
    if (email.length < 8) {
      const isValidate = false && this.state.successPassword;
      this.setState({
        errorEmail: true,
        successEmail: false,
        isValidate,
        email,
      });
    } else {
      const isValidate = true && this.state.successPassword;
      this.setState({
        errorEmail: false,
        successEmail: true,
        isValidate,
        email,
      });
    }
  }

  validatePassword = (password) => {
    if (password.length < 8) {
      const isValidate = false && this.state.successEmail;
      this.setState({
        errorPassword: true,
        successPassword: false,
        isValidate,
        password,
      });
    } else {
      const isValidate = true && this.state.successEmail;
      this.setState({
        errorPassword: false,
        successPassword: true,
        isValidate,
        password,
      });
    }
  }

  registerEmailChange = (txt) => {
    this.setState({
      registerEmail: txt,
    });
  }

  registerPasswordChange = (txt) => {
    this.setState({
      registerPassword: txt,
    });
  }

  registerAccountChange = (txt) => {
    this.setState({
      registerAccount: txt,
    });
  }

  openRegisterDialog = () => {
    this.registerDialog.show();
  }

  handleLogin = () => {
    const { dispatch } = this.props;
    const { email, password } = this.state;
    login(email, password)(dispatch);
    this.popupDialog.show();
  }

  handleRegister = () => {
    const { dispatch } = this.props;
    const { registerEmail, registerAccount, registerPassword } = this.state;
    register(registerEmail, registerAccount, registerPassword)(dispatch);
    this.popupDialog.show();
  }

  render() {
    const {
      email,
      errorEmail,
      successEmail,
      password,
      errorPassword,
      successPassword,
      isValidate,
      registerEmail,
      registerPassword,
      registerAccount,
    } = this.state;

    const {
      logging,
      msg,
    } = this.props.user;

    return (
      <Container>
        <View style={styles.container}>
          <PopupDialog
            style={styles.popupDialog}
            dialogTitle={<DialogTitle title="Đăng nhập" />}
            width={300}
            height={200}
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            actions={[
              <DialogButton
                text="Đóng"
                onPress={() => {
                  this.popupDialog.dismiss();
                }}
                key="button-1"
              />,
            ]}
          >
            <View style={styles.popupDialog.dialogContentView}>
              <Text>{msg}</Text>
            </View>
          </PopupDialog>

          <Image
            source={background}
            style={styles.logo}
          />
          <View style={styles.bg}>
            <Item error={errorEmail} success={successEmail}>
              <Icon active name="person" />
              <Input
                placeholder="Email"
                value={email}
                onChangeText={this.validateEmail}
              />
              {errorEmail ?
                <Icon name="close-circle" />
                : null}
              {successEmail ?
                <Icon name="checkmark-circle" />
                : null
              }
            </Item>
            <Item error={errorPassword} success={successPassword}>
              <Icon active name="unlock" />
              <Input
                placeholder="Mật khẩu"
                value={password}
                secureTextEntry
                onChangeText={this.validatePassword}
              />
              {errorPassword ?
                <Icon name="close-circle" />
                : null}
              {successPassword ?
                <Icon name="checkmark-circle" />
                : null
              }
            </Item>
            <Button
              style={styles.btn}
              onPress={this.handleLogin}
              disabled={!isValidate}
            >
              <Text>Đăng nhập</Text>
            </Button>
          </View>
          <View
            style={styles.registerText}
          >
            <Text style={{ fontSize: 12, fontWeight: '200' }}>Bạn chưa có tài khoản?</Text>
            <TouchableOpacity onPress={this.openRegisterDialog}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Đăng ký</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
        <PopupDialog
          style={styles.popupDialog}
          dialogTitle={<DialogTitle title="Đăng kí" />}
          width={300}
          height={300}
          ref={(popupDialog) => { this.registerDialog = popupDialog; }}
          actions={[
            <DialogButton
              text="Tạo tài khoản"
              onPress={() => {
                this.registerDialog.dismiss();
                this.handleRegister();
              }}
              key="button-register-register"
            />,
          ]}
        >
          <View style={styles.popupDialog.dialogContentView}>
            <Item>
              <Input
                style={{
                  width: 300,
                }}
                placeholder="Email"
                value={registerEmail}
                onChangeText={this.registerEmailChange}
              />
            </Item>
            <Item>
              <Input
                style={{
                  width: 300,
                }}
                placeholder="Tên tài khoản"
                value={registerAccount}
                onChangeText={this.registerAccountChange}
              />
            </Item>
            <Item>
              <Input
                style={{
                  width: 300,
                }}
                placeholder="Mật khẩu"
                value={registerPassword}
                secureTextEntry
                onChangeText={this.registerPasswordChange}
              />
            </Item>
          </View>

        </PopupDialog>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

