
import React, { Component } from 'react';
import {
  AppRegistry, StyleSheet,
} from 'react-native';
import ChapterList from './Novel_Com/ChapterList';
import NovelRead from './Novel_Com/NovelRead';
import BookList from './Novel_Com/BookList';
import SearchBook from './Novel_Com/SearchBook';
import RnkList from './Novel_Com/RnkList'

import { StackNavigator } from 'react-navigation';

import DeviceStorage from './util/DeviceStorage'
import axios from 'axios';

global.axios = axios;
global.DeviceStorage = DeviceStorage;

SearchBook.navigationOptions = ({navigation}) => {
  return {
    title: '搜索书籍',
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

NovelRead.navigationOptions = ({ navigation }) => {
  return { header: null };
};

RnkList.navigationOptions = ({navigation}) => {
  return {
    title: '起点排行',
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

const Reader_F = StackNavigator({
  Home: { screen: BookList },
  ChaL: { screen: ChapterList },
  Read: { screen: NovelRead },
  Sear: { screen: SearchBook },
  RnkL: { screen: RnkList },
}, {
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false
    }
  });

  export default Reader_F;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
});

