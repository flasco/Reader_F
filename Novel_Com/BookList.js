import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Button,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
} from 'react-native';

import SideMenu from 'react-native-side-menu';
import SplashScreen from 'react-native-splash-screen'
import Icon from 'react-native-vector-icons/Foundation'
import PullRefreshScrollView from 'react-native-pullrefresh-scrollview';

import Menu from './menu'
import getNet from '../util/getNet'

var booklist;

export default class BookPackage extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '古意流苏',
            //左上角的返回键文字, 默认是上一个页面的title  IOS 有效
            headerBackTitle: ' ',
            //导航栏的style
            headerStyle: {
                backgroundColor: '#000'
            },
            headerRight: (
                <Icon
                    name="plus"
                    size={20}
                    color={'#fff'}
                    onPress={() => { that._OpenMenu() }} //点击该按钮后触发的方法
                    style={{
                        marginRight: 10,
                    }}
                />
            ),
            headerTitleStyle: {
                color: '#fff',
                alignSelf: 'center'
            }
        };
    };
    constructor(props) {
        super(props);
        that = this;
        this.state = {
            load: true,
            isOpen: false,
           
        };
    }

    _OpenMenu = () => {
        this.setState({ isOpen: true })
    }

    updateMenuState(isOpen) {
        console.log()
        this.setState({
            isOpen: isOpen,
        })
    }
    render() {
        const menu = <Menu />;
        return (
            (<View style={styles.container}>
                <SideMenu menu={menu}
                    isOpen={this.state.isOpen}
                    onChange={isOpen => this.updateMenuState(isOpen)}
                    menuPosition={'right'}
                    disableGestures={true}
                >
                    <BookList navigation={this.props.navigation} />
                </SideMenu>
            </View>)
        );
    }
}

var RefreshCount = 0;
class BookList extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: '',
            load: true,
        };
        // DeviceStorage.clear('booklist');
        DeviceStorage.get('booklist').then(val => {
            if (val === null) {
                booklist = [
                    {
                        bookName: '美食爱好者',
                        author: '菜猫',
                        url: 'http://www.biqiuge.com/book/6888/',
                        recordChapter: 'http://www.biqiuge.com/book/6888/4560933.html',
                        latestChapter: '待检测',
                        recordPage: 1,
                        plantformId: 5,
                    }, {
                        bookName: '直死无限',
                        author: '如倾如诉',
                        url: 'http://www.biqiuge.com/book/4912/',
                        recordChapter: 'http://www.biqiuge.com/book/4912/3102895.html',
                        latestChapter: '待检测',
                        recordPage: 1,
                        plantformId: 5,
                    }, {
                        bookName: '测试1号',
                        author: '11',
                        url: 'http://www.biqiuge.com/book/4912/',
                        recordChapter: 'http://www.biqiuge.com/book/4912/3102895.html',
                        latestChapter: '待检测',
                        recordPage: 1,
                        plantformId: 5,
                    }
                ];
                console.log('检测发现你是第一次使用本app，没有书架记录。');
                DeviceStorage.save('booklist', booklist);
                this.setState({
                    dataSource: ds.cloneWithRows(booklist),
                    load: false
                });
            } else {
                console.log('have');
                booklist = val;

                this.setState({
                    dataSource: ds.cloneWithRows(val),
                    load: false
                });
            }
        });
    }
    componentDidMount() {
        SplashScreen.hide();
    }
    _renderRow = (rowData) => {
        const { navigate } = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => navigate('Read', {
                    bookNum: booklist.indexOf(rowData),
                })}>
                <View style={{
                    height: 38
                }}>
                <Text style={styles.rowStyle}>
                    <Text >{rowData.bookName}</Text>
                    <Text style={styles.latestChapter}>{`    ${rowData.latestChapter}`}</Text>
                </Text>
                    
                </View>
            </TouchableOpacity>
        );
    }
    _renderSeparator = () => {
        return (<View style={styles.solid} />);
    }
    _onRefresh = (PullRefresh) =>{
        getNet.refreshChapter(booklist,()=>{
            RefreshCount++;
            if(RefreshCount!=booklist.length) return;
            this.setState({
                dataSource:new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2
                }).cloneWithRows(booklist)
            },()=>{
                RefreshCount = 0;
                DeviceStorage.save('booklist', booklist);
                PullRefresh.onRefreshEnd();
            })
        });
        
        
    
    }
    render() {
        return (
            this.state.load ? (false) :
                (<View style={styles.container}>
                    <StatusBar barStyle="light-content"></StatusBar>
                    <ListView
                        style={{
                            flex: 1
                        }}
                        renderScrollComponent={(props) => <PullRefreshScrollView onRefresh={(PullRefresh)=>this._onRefresh(PullRefresh)} {...props}     />}
                        dataSource={this.state.dataSource}
                        renderSeparator={this._renderSeparator}
                        renderRow={this._renderRow} />
                </View>)
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#F5FCFF'
    },
    rowStyle: {
        marginTop: 12,
        marginLeft: 20,
    },
    latestChapter:{
        paddingLeft: 20,
        fontSize:12,
        color:'#999999'
    },
    solid: {
        height: 1,
        backgroundColor: '#8a8a8a'
    }
});
