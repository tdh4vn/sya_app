import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { DrawerNavigator, NavigationActions } from 'react-navigation';
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
  };

  constructor(props) {
    super(props);
    SYAMQTTClient.getInstance().setDispatch(props.dispatch);
    this.state = {
      activeTab: 0,
    };
  }

  newPage(index) {
    this.props.setIndex(index);
    Actions.blankPage();
  }

  render() {
    const { activeTab } = this.state;
    return (
      <Container style={styles.container}>
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
              active={activeTab === 1}
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
const mapStateToProps = state => ({
  name: state.user.name,
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
