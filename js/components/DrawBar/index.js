import React from 'react';
import { AppRegistry, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  Icon,
} from 'native-base';
const routes = ['Đăng xuất'];
export default class DrawBar extends React.Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <Container>
        <Content>
          <Image
            source={{
              uri: 'https://github.com/GeekyAnts/NativeBase-KitchenSink/raw/react-navigation/img/drawer-cover.png',
            }}
            style={{
              height: 120,
              alignSelf: 'stretch',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                height: 120,
                alignSelf: 'stretch',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.navigation.navigate('DrawerClose');
              }}
            >
              <Image
                square
                style={{ height: 80, width: 70 }}
                source={{
                  uri: 'https://github.com/GeekyAnts/NativeBase-KitchenSink/raw/react-navigation/img/logo.png',
                }}
              />
            </TouchableOpacity>
          </Image>
          <List
            dataArray={routes}
            renderRow={data => (
              <ListItem
                button
                onPress={() => {
                  AsyncStorage.removeItem('jwt', (err, result) => {
                    console.log('REMOVE', err, result);
                    this.props.navigation.navigate('Login');
                  });
                }}
              >
                <Text>{data}</Text>
              </ListItem>
            )}
          />
        </Content>
      </Container>
    );
  }
}
