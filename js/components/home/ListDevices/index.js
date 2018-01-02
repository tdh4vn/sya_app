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
} from 'native-base';
import styles from './styles';
import { getNodes, showDetailNode } from '../../../actions/listDevices';

const goodIcon = require('../../../../images/good.png');
const normalIcon = require('../../../../images/moderate.png');
const unhealthyForSensitive = require('../../../../images/unhealthy_for_sensitive.png');
const unhealthy = require('../../../../images/unhealthy.png');
const veryUnhealthy = require('../../../../images/very_unhelthy.png');
const hazardous = require('../../../../images/hazardous.png');

function getIcon(aqi) {
  if (aqi >= 0 && aqi <= 50) return goodIcon;
  if (aqi >= 51 && aqi <= 100) return normalIcon;
  if (aqi >= 101 && aqi <= 150) return unhealthyForSensitive;
  if (aqi >= 151 && aqi <= 200) return unhealthy;
  if (aqi >= 201 && aqi <= 300) return veryUnhealthy;
  return hazardous;
}

class ListDevices extends Component {
  static propTypes = {
    nodes: PropTypes.object,
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    user: PropTypes.object,
  };

  componentWillMount = () => {
    const { dispatch, user } = this.props;
    getNodes(user.token)(dispatch);
  }

  onItemClick = (item) => {
    showDetailNode(item._id)(this.props.dispatch);
    this.props.navigation.navigate('NodeDetail');
  }

  render() {
    const { data } = this.props.nodes;
    return (
      <View>
        {data && data.map((item, idx) => (
          <Card key={idx}>
            <CardItem button onPress={() => { this.onItemClick(item, idx); }}>
              <Left>
                <Image source={getIcon(item.now.pm2)} style={{ width: 80, height: 80 }} />
                <Body>
                  <Text>{item.name}</Text>
                  <Text note>{item.description}</Text>
                </Body>
              </Left>
              <Right>
                <View style={styles.infoNow}>
                  {item.now.temp > 0 ? <Text>{`Nhiệt độ: ${item.now.temp} °C`}</Text> : null}
                  {item.now.hum > 0 ? <Text>{`Độ ẩm: ${item.now.hum} %`}</Text> : null}
                  <Text>{`AQI: ${item.now.pm2}`}</Text>
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
  nodes: state.listDevices.nodes,
  flag: state.listDevices.flag,
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(ListDevices);
