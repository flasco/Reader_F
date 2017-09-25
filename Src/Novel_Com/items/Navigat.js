import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, InteractionManager } from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';

const { height, width } = Dimensions.get('window');

/**
 * 这个是自定义的StackNavigator导航栏
 * 用在了NovelRead.js中
 - code by Czq
 */
export default class Navigat extends Component {
    constructor(props) {
        super(props);

        this.DoCache = this.DoCache.bind(this);
        this.JmptoChapterList = this.JmptoChapterList.bind(this);

        that = this;
    }

    shouldComponentUpdate() {
        return false;
    }

    DoCache() {
        this.props.showAlertSelected();
    }

    JmptoChapterList() {
        this.props.navigation
            .navigate('ChaL', {
                url: this.props.urlx,
                name: this.props.bname,
                bookChapterLst: this.props.bookChapterLst,
                chap: this.props.currentChapter,
                callback: (url) => this.props.getChapterUrl(url)
            });
    }

    render() {
        if (this.props.choose === 1) {
            return (
                <View style={styles.Navig}>
                    <View style={{ flex: 1, paddingTop: 25 }}>
                        <TouchableOpacity style={{ height: 40 }} onPress={() => { alert('coming soon...') }}>
                            <Text style={styles.Topper}>换源</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 3 }}></View>
                    <View style={{ flex: 1, paddingTop: 25 }}>
                        <TouchableOpacity style={{ height: 40 }} onPress={() => { this.props.navigation.goBack(); }}>
                            <Text style={styles.Topper}>返回</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else if (this.props.choose === 2) {
            return (
                <View style={styles.Fotter}>

                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.SModeChange(); }}>
                        <Icon
                            name="burst"
                            size={20}
                            color={'#fff'}
                            style={styles.fontCenter} />
                        <Text style={styles.FotterItems}>切换</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} onPress={this.JmptoChapterList}>
                        <Icon
                            name="list"
                            size={20}
                            color={'#fff'}
                            style={styles.fontCenter} />
                        <Text style={styles.FotterItems}>目录</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.DoCache() }}>
                        <Icon
                            name="download"
                            size={20}
                            color={'#fff'}
                            style={styles.fontCenter} />
                        <Text style={styles.FotterItems}>缓存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { alert('coming soon...') }}>
                        <Icon
                            name="widget"
                            size={20}
                            color={'#fff'}
                            style={styles.fontCenter} />
                        <Text style={styles.FotterItems}>设置</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    Navig: {
        height: 64,
        backgroundColor: '#000',
        zIndex: 2,
        width: width,
        position: 'absolute',
        top: 0,
        flexDirection: 'row'
    },
    Fotter: {
        height: 50,
        paddingTop: 7,
        backgroundColor: '#000',
        zIndex: 2,
        width: width,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row'
    },
    Topper: {
        color: '#FFF', textAlign: 'center', marginTop: 12, fontSize: 16,
    },
    fontCenter: {
        textAlign: 'center',
    },
    FotterItems: {
        color: "#fff", textAlign: 'center', fontSize: 12,
    },
});