/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, ListView,StatusBar} from 'react-native';
import ChapterList from './Novel_Com/ChapterList'
import NovelRead from './Novel_Com/NovelRead'
import BookList from './Novel_Com/BookList'
import { StackNavigator } from 'react-navigation';
// export default 

const Reader_F = StackNavigator({
  Home: { screen: BookList },
  ChaL: { screen: ChapterList},
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
});

AppRegistry.registerComponent('Reader_F', () => Reader_F);
