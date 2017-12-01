import React, { Component } from 'react';
import Login from '../components/login/';
import Home from '../components/home/';
import NodeDetail from '../components/NodeDetail';
import BlankPage from '../components/blankPage';
import FollowNode from '../components/FollowNode';
import HomeDrawerRouter from './HomeDrawerRouter';
import { StackNavigator } from 'react-navigation';
import NodeStats from '../components/NodeStats';
HomeDrawerRouter.navigationOptions = ({ navigation }) => ({
  header: null,
});
export default (StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home },
  BlankPage: { screen: BlankPage },
  NodeDetail: { screen: NodeDetail },
  FollowNode: { screen: FollowNode },
  NodeStats: { screen: NodeStats },
}));
