import React, { Component } from 'react';
import { Image, AsyncStorage } from 'react-native';
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
import { login } from '../../actions/user';
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
    };

    AsyncStorage.getItem('jwt', (err, result) => {
      if (result) {
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

  handleLogin = () => {
    const { dispatch } = this.props;
    const { email, password } = this.state;
    login(email, password)(dispatch);
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
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}> Đăng ký</Text>
          </View>
        </View>
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

