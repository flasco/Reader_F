/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry,StyleSheet,
  Text,View,ListView,Button} from 'react-native';
import ChapterList from './Novel_Com/ChapterList';
import NovelRead from './Novel_Com/NovelRead';
import BookList from './Novel_Com/BookList';

import {StackNavigator} from 'react-navigation';
// export default

BookList.navigationOptions = ({navigation}) => {
  return {
    title: '古意流苏',
    //左上角的返回键文字, 默认是上一个页面的title  IOS 有效
    headerBackTitle: ' ',
    //导航栏的style
    headerStyle: {
      backgroundColor: '#000'
    },
    headerTitleStyle: {
      color: '#fff',
      alignSelf: 'center'
    }
  };
};
ChapterList.navigationOptions = ({navigation}) => {
  return {
    title: `${navigation.state.params.name}`,
    //左上角的返回键文字, 默认是上一个页面的title  IOS 有效
    headerBackTitle: ' ',
    //导航栏的style
    headerStyle: {
      backgroundColor: '#000'
    },
    headerTitleStyle: {
      color: '#fff',
      alignSelf: 'center'
    }
  };
};
NovelRead.navigationOptions = ({navigation}) => {
  return {header: null};
};

const Reader_F = StackNavigator({
  Home: { screen: BookList },
  ChaL: { screen: ChapterList },
  Read: { screen: NovelRead }
}, {
  mode: 'modal',
  navigationOptions: {
    gesturesEnabled: false
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
});

AppRegistry.registerComponent('Reader_F', () => Reader_F);
