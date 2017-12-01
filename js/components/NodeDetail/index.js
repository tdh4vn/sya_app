import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment';

require('moment/locale/vi');

moment.locale('vi');

function getColor(aqi) {
  if (aqi >= 0 && aqi <= 50) return '#009967';
  if (aqi >= 51 && aqi <= 100) return '#ffdd35';
  if (aqi >= 101 && aqi <= 150) return '#ff9834';
  if (aqi >= 151 && aqi <= 200) return '#cb0034';
  if (aqi >= 201 && aqi <= 300) return '#660098';
  return '#7d0023';
}

function getCategory(aqi) {
  if (aqi >= 0 && aqi <= 50) return 'Tốt';
  if (aqi >= 51 && aqi <= 100) return 'Trung bình';
  if (aqi >= 101 && aqi <= 150) return 'Kém';
  if (aqi >= 151 && aqi <= 200) return 'Xấu';
  if (aqi >= 201 && aqi <= 300) return 'Rất xấu';
  return 'Nguy hiểm';
}

function getSensitive(aqi) {
  return 'Những người bị bệnh hô hấp hoặc bệnh tim, người già và trẻ nhỏ dễ bị ảnh hưởng';
}

function getHealthEffects(aqi) {
  if (aqi >= 0 && aqi <= 50) return 'Không có';
  if (aqi >= 51 && aqi <= 100) return 'Những người nhạy cảm có thể mắc các triệu chứng về hô hấp';
  if (aqi >= 101 && aqi <= 150) return 'Kích ứng hô hấp, tăng nguy cơ tử vong sớm với người bị bệnh tim, phổi và người cao tuổi';
  if (aqi >= 151 && aqi <= 200) return 'Tăng nguy cơ bệnh tim và phổi và tử vong sớm ở người bị bệnh tim mạch và người cao tuổi, ảnh hưởng đến hô hấp với hầu hết mọi người.';
  if (aqi >= 201 && aqi <= 300) return 'Tăng đáng kể nguy cơ bệnh tim và phổi và tử vong sớm ở người bị bệnh tim mạch và người cao tuổi, ảnh hưởng đến hô hấp đến toàn bộ mọi người';
  return 'Rất nguy hiểm và có thể gây tử vong với người bị bệnh tim phổi và người cao tuổi, ảnh hưởng trực tiếp đến hô hấp của mọi người';
}

function getCautionary(aqi) {
  if (aqi >= 0 && aqi <= 50) return 'Không có';
  if (aqi >= 51 && aqi <= 100) return 'Những người nhạy cảm có thể mắc các triệu chứng về hô hấp hạn chế ra ngoài trời';
  if (aqi >= 101 && aqi <= 150) return 'Người bị bênh hô hấp hoặc tim, người già, trẻ em nên hạn chế ra ngoài';
  if (aqi >= 151 && aqi <= 200) return 'Người bị bênh hô hấp hoặc tim, người già, trẻ em nên hạn chế ra ngoài';
  if (aqi >= 201 && aqi <= 300) return 'Người bị bênh hô hấp hoặc tim, người già, trẻ em nên hạn chế ra ngoài';
  return 'Mọi người nên tránh việc ra ngoài trời, người già và trẻ em nên ở trong nhà';
}

class NodeDetail extends Component {

  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    name: React.PropTypes.string,
    nodeIdSelected: React.PropTypes.any,
    nodes: React.PropTypes.any,
    navigation: React.PropTypes.any,
  };

  static defaultProps = {
    nodes: [],
  }

  render() {
    const { nodeIdSelected } = this.props;
    let data;
    if (this.props.nodes) {
      this.props.nodes.data.forEach((item) => {
        if (item._id === nodeIdSelected) {
          data = item;
        }
      });
    }

    return (
      <Container
        style={{
          backgroundColor: getColor(data.now.pm2),
        }}
      >
        <Content>
          <View
            style={{
              height: 56,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              style={{
                marginTop: 20,
                alignSelf: 'flex-start',
              }}
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon style={{ fontSize: 50, color: 'white' }} name="ios-close" />
            </Button>
            <Text
              style={{
                color: '#FFFFFF',
                top: 50,
                fontSize: 18,
                position: 'absolute',
                left: 0,
                right: 0,
                textAlign: 'center',
              }}
            >
              {data.name}
            </Text>

            <Right>
              <Button
                style={{
                  marginTop: 30,
                  alignSelf: 'flex-end',
                }}
                transparent
                onPress={() => this.props.navigation.navigate('NodeStats')}
              >
                <Icon style={{ fontSize: 32, color: 'white' }} name="ios-stats" />
              </Button>
            </Right>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                marginTop: 60,
                fontSize: 50,
                fontWeight: 'normal',
              }}
            >
              {data.now.pm2}
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                marginTop: 5,
                fontSize: 45,
                fontWeight: '100',
              }}
            >
              {getCategory(data.now.pm2)}
            </Text>
          </View>
          {data.now.hum > 0 && <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name="ios-thermometer" style={{ fontSize: 30, color: 'white' }} />
            <Text
              style={{
                color: '#FFFFFF',
                marginTop: 5,
                fontSize: 20,
                fontWeight: '100',
              }}
            >
              {` ${data.now.temp} °C`}
            </Text>
            <Text>{'   '}</Text>
            <Icon name="ios-umbrella" style={{ fontSize: 30, color: 'white' }} />
            <Text
              style={{
                color: '#FFFFFF',
                marginTop: 5,
                fontSize: 20,
                fontWeight: '200',
              }}
            >
              {` ${data.now.hum} %`}
            </Text>
          </View>}

          <View
            style={{
              marginTop: 30,
              marginBottom: 30,
              backgroundColor: '#000000',
              opacity: 0.3,
              marginLeft: 10,
              marginRight: 10,
              height: 4,
              borderRadius: 2,
            }}
          />

          <View
            style={{
              marginLeft: 30,
              marginRight: 30,
            }}
          >
            <Grid
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5,
              }}
            >
              <Col size={1}>
                <Icon name="ios-people-outline" style={{ fontSize: 40, color: 'white' }} />
              </Col>
              <Col size={6}>
                <Text style={{ color: '#FFFFFF' }}>{getSensitive(data.now.pm2)}</Text>
              </Col>
            </Grid>
            <Grid
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5,
              }}
            >
              <Col size={1}>
                <Icon name="ios-heart-outline" style={{ fontSize: 40, color: 'white' }} />
              </Col>
              <Col size={6}>
                <Text style={{ color: '#FFFFFF' }}>{getHealthEffects(data.now.pm2)}</Text>
              </Col>
            </Grid>
            <Grid
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5,
              }}
            >
              <Col size={1}>
                <Icon name="ios-warning-outline" style={{ fontSize: 40, color: 'white' }} />
              </Col>
              <Col size={6}>
                <Text style={{ color: '#FFFFFF' }}>{getCautionary(data.now.pm2)}</Text>
              </Col>
            </Grid>
          </View>
          <View
            style={{
              marginTop: 30,
              marginBottom: 30,
              backgroundColor: '#000000',
              opacity: 0.3,
              marginLeft: 10,
              marginRight: 10,
              height: 4,
              borderRadius: 2,
            }}
          />
          <View
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text
              style={{
                color: 'white',
                fontStyle: 'italic',
              }}
            >
              Cập nhật: {moment(data.now.lastUpdated).fromNow()}
            </Text>
          </View>

        </Content>
      </Container>
    );
  }
}

Map.propTypes = {
  dispatch: React.PropTypes.func,
  nodes: React.PropTypes.any,
  flag: React.PropTypes.any,
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const mapStateToProps = state => ({
  nodes: state.listDevices.nodes,
  flag: state.listDevices.flag,
  nodeIdSelected: state.listDevices.nodeIdSelected,
});
export default connect(mapStateToProps, mapDispatchToProps)(NodeDetail);
