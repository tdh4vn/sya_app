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
function getColor(aqi) {
  if (aqi >= 0 && aqi <= 50) return '#009967';
  if (aqi >= 51 && aqi <= 100) return '#ffdd35';
  if (aqi >= 101 && aqi <= 150) return '#ff9834';
  if (aqi >= 151 && aqi <= 200) return '#cb0034';
  if (aqi >= 201 && aqi <= 300) return '#660098';
  return '#7d0023';
}
const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});

class Map extends Component {
  render() {
    const { nodes } = this.props;
    return (
      <Container>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 20.993169,
            longitude: 105.8028743,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {nodes.data && nodes.data.map(item => (
            <MapView.Marker
              title={item.name}
              coordinate={item.location}
              description={`AQI: ${item.now.pm2}`}
              pinColor={getColor(item.now.pm2)}
            >
            </MapView.Marker>
          ))}
        </MapView>
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Map);
