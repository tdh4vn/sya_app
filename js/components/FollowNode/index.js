import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Dimensions, StyleSheet } from 'react-native';
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
import Camera from 'react-native-camera';
import styles from './styles';


class FollowNode extends Component {

  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    name: React.PropTypes.string,
    nodeIdSelected: React.PropTypes.any,
  };

  render() {
    return (
      <Container style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          onBarCodeRead={(code) => {
            console.log(code);
          }}
        >
        </Camera>
      </Container >
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
});
export default connect(mapStateToProps, mapDispatchToProps)(FollowNode);
