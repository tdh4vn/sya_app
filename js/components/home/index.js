import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { DrawerNavigator, NavigationActions } from 'react-navigation';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';
import { addNode } from '../../actions/listDevices';
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Footer,
  FooterTab,
  CheckBox,
  ListItem,
  Item,
  Input,
  View,
} from 'native-base';
import Map from './Map';
import NodeControl from '../NodeControl';
import BlankPage2 from '../blankPage2';
import DrawBar from '../DrawBar';
import { setIndex } from '../../actions/listDevices';
import { openDrawer } from '../../actions/drawer';
import ListDevices from './ListDevices';
import styles from './styles';
import SYAMQTTClient from '../../core/SYAMqttClient';

const TITLES = ['Thiết bị', 'Bản đồ', 'Điều khiển'];

class Home extends Component {

  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    navigation: React.PropTypes.object,
    name: React.PropTypes.string,
    setIndex: React.PropTypes.func,
    openDrawer: React.PropTypes.func,
    dispatch: React.PropTypes.func,
    user: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    SYAMQTTClient.getInstance().setDispatch(props.dispatch);
    this.state = {
      activeTab: 0,
      latitude: 0,
      longitude: 0,
      error: null,
      id: '',
      password: '',
      name: '',
      description: '',
      isControlDevice: false,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      }, (error) => { console.log(error); this.setState({ error: error.message }); }
    );
  }

  handleAddNode = () => {
    const { user, dispatch } = this.props;
    const {
      id,
      password,
      name,
      description,
      longitude,
      latitude,
    } = this.state;
    addNode(user.token, id, password, name, description, latitude, longitude)(dispatch);
  }

  newPage(index) {
    this.props.setIndex(index);
    Actions.blankPage();
  }

  render() {
    const { activeTab, id, password, name, description } = this.state;
    return (
      <Container style={styles.container}>
        <PopupDialog
          style={styles.popupDialog}
          dialogTitle={<DialogTitle title="Thêm thiết bị" />}
          width={300}
          height={300}
          ref={(popupDialog) => { this.addNodeDialog = popupDialog; }}
          actions={[
            <DialogButton
              text="Thêm"
              onPress={() => {
                this.addNodeDialog.dismiss();
                this.handleAddNode();
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
                placeholder="ID"
                value={id}
                onChangeText={(txt) => { this.setState({ id: txt }); }}
              />
            </Item>
            <Item>
              <Input
                style={{
                  width: 300,
                }}
                placeholder="Mật khẩu"
                value={password}
                secureTextEntry
                onChangeText={(txt) => { this.setState({ password: txt }); }}
              />
            </Item>
            <Item>
              <Input
                style={{
                  width: 300,
                }}
                placeholder="Tên"
                value={name}
                onChangeText={(txt) => { this.setState({ name: txt }); }}
              />
            </Item>
            <Item>
              <Input
                style={{
                  width: 300,
                }}
                placeholder="Mô tả"
                value={description}
                onChangeText={(txt) => { this.setState({ description: txt }); }}
              />
            </Item>
          </View>
        </PopupDialog>
        <Header >
          <Left>
            <Button
              transparent
              onPress={() => DrawerNav.navigate('DrawerOpen')}
            >
              <Icon active name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>{TITLES[activeTab]}</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => { this.props.navigation.navigate('FollowNode'); }}
            >
              <Icon active ios="ios-barcode-outline" android="md-barcode" />
            </Button>
            <Button
              transparent
              onPress={() => { this.addNodeDialog.show(); }}
            >
              <Icon active ios="ios-add" android="md-add" />
            </Button>
          </Right>
        </Header>
        <Content>
          {activeTab === 0 ? <ListDevices navigation={this.props.navigation} /> : null}
          {activeTab === 1 ? <Map /> : null}
          {activeTab === 2 ? <NodeControl /> : null}
        </Content>
        <Footer>
          <FooterTab>
            <Button
              active={activeTab === 0}
              vertical
              onPress={() => { this.setState({ activeTab: 0 }); }}
            >
              <Icon name="apps" />
              <Text>Thiết bị đo</Text>
            </Button>
            <Button
              active={activeTab === 1}
              vertical
              onPress={() => { this.setState({ activeTab: 1 }); }}
            >
              <Icon name="ios-map" />
              <Text>Bản đồ</Text>
            </Button>
            <Button
              active={activeTab === 2}
              vertical
              onPress={() => { this.setState({ activeTab: 2 }); }}
            >
              <Icon name="ios-switch" />
              <Text>Điều khiển</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container >
    );
  }
}

function bindAction(dispatch) {
  return {
    setIndex: index => dispatch(setIndex(index)),
    openDrawer: () => dispatch(openDrawer()),
  };
}
// const mapDispatchToProps = dispatch => ({
//   dispatch,
// });
const mapStateToProps = state => ({
  name: state.user.name,
  flag: state.listDevices.flag,
  user: state.user,
});

const HomeSwagger = connect(mapStateToProps, bindAction)(Home);
const DrawNav = DrawerNavigator(
  {
    Home: { screen: HomeSwagger },
    BlankPage2: { screen: BlankPage2 },
  },
  {
    contentComponent: props => <DrawBar {...props} />,
  }
);
const DrawerNav = null;
DrawNav.navigationOptions = ({ navigation }) => {
  DrawerNav = navigation;
  return {
    header: null,
  };
};
export default DrawNav;
