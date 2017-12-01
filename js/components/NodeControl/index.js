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
  }

  onChangeSwitch = (value) => {
    this.setState({
      value,
    });
  }

  render() {
    return (
      <View>
        <Card>
          <CardItem>
            <Left>
              <Image source={oAmTuongJPG} style={{ width: 80, height: 80 }} />
              <Body>
                <Text>Ổ cắm âm tường</Text>
                <Text note>Quạt phòng khách</Text>
              </Body>
            </Left>
            <Right>
              <View style={{ alignSelf: 'flex-end' }}>
                {/* {item.now.temp > 0 ? <Text>{`Nhiệt độ: ${item.now.temp} °C`}</Text> : null}
                    {item.now.hum > 0 ? <Text>{`Độ ẩm: ${item.now.hum} %`}</Text> : null}
                    <Text>{`AQI: ${item.now.pm2}`}</Text> */}
                <Switch value={this.state.value} onValueChange={this.onChangeSwitch} />
              </View>
            </Right>
          </CardItem>
        </Card>
      </View>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch,
});

const mapStateToProps = state => ({
  nodes: state.listDevices.nodes,
  flag: state.listDevices.flag,
});

export default connect(mapStateToProps, mapDispatchToProps)(NodeControl);
