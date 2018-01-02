import React, { Component, PropTypes } from 'react';
import { TouchableHighlight, View, Image } from 'react-native';
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
  Card,
  CardItem,
  Thumbnail,
  Switch,
} from 'native-base';
import { getOwnerNodes } from '../../actions/listDevices';
import SYAMQTTClient from '../../core/SYAMqttClient';

const oAmTuongJPG = require('../../../images/o_am_tuong.png');


class NodeControl extends Component {
  static propTypes = {
    nodes: PropTypes.object,
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: false,
    };
  }

  componentWillMount = () => {
    const { dispatch } = this.props;
    getOwnerNodes(this.props.user.token)(dispatch);
    getOwnerNodes(this.props.user.token)(dispatch);
  }

  onChangeSwitch = (nodeId, value) => {
    SYAMQTTClient.getInstance().publishMessage(`${nodeId}/control`, value ? '0' : '1');
  }

  render() {
    const { nodes } = this.props;
    return (
      <View>
        {nodes && nodes.map((node, idx) => (
          <Card key={idx}>
            <CardItem>
              <Left>
                <Image source={oAmTuongJPG} style={{ width: 80, height: 80 }} />
                <Body>
                  <Text>{node.name}</Text>
                  <Text note>{node.description}</Text>
                </Body>
              </Left>
              <Right>
                <View style={{ alignSelf: 'flex-end' }}>
                  <Switch value={node.currentState} onValueChange={(value) => { this.onChangeSwitch(node._id, value); }} />
                </View>
              </Right>
            </CardItem>
          </Card>
        ))}
      </View>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch,
});

const mapStateToProps = state => ({
  nodes: state.listDevices.ownerNodes,
  flag: state.listDevices.flag,
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(NodeControl);
