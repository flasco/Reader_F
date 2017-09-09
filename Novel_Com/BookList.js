import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';

import SideMenu from 'react-native-side-menu';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Foundation';
import Swipeout from 'react-native-swipeout';


import PullRefreshScrollView from '../RefreshScollowView_Re/PullRefreshScrollView';
import Menu from './menu';
import getNet from '../util/getNet';

var booklist, tht, tha;

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
                <TouchableOpacity onPress={() => { tht._OpenMenu() }}>
                    <Icon
                        name="plus"
                        size={30}
                        color={'#fff'}
                        style={{
                            marginRight: 15,
                        }}
                    />
                </TouchableOpacity>
            ),
            headerTitleStyle: {
                color: '#fff',
                alignSelf: 'center'
            }
        };
    };
    constructor(props) {
        super(props);
        tht = this;
        this.state = {
            load: true,
            isOpen: false,
        };
    }

    _OpenMenu = () => {
        this.setState({ isOpen: true })
    }

    updateMenuState(isOpen) {
        this.setState({
            isOpen: isOpen,
        })
    }

    _addBook = (data) => {
        console.log(data);
        let book = {
            bookName: data.name,
            author: data.author,
            url: data.url,
            recordChapter: '',
            latestChapter: '待检测',
            recordPage: 1,
            plantformId: data.plantFormId,
        };
        booklist.push(book);
        getNet.refreshSingleChapter(book);
        tha.setState({
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }).cloneWithRows(booklist),
        });
        DeviceStorage.save('booklist', booklist);
    }

    render() {
        const menu = <Menu
            navigation={this.props.navigation}
            addBook={this._addBook}
        />;
        return (
            (<View style={styles.container}>
                <SideMenu menu={menu}
                    isOpen={this.state.isOpen}
                    onChange={isOpen => this.updateMenuState(isOpen)}
                    menuPosition={'right'}
                    disableGestures={true}>
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
        tha = this;
        this.state = {
            dataSource: '',
            load: true,
        };
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

    ontest = (r) => {
        booklist.splice(r, 1);
        this.setState({
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }).cloneWithRows(booklist)
        }, () => {
            DeviceStorage.save('booklist', booklist);
        })

    }
    _renderRow = (rowData, sectionID, rowID) => {
        const { navigate } = this.props.navigation;
        return (
            <Swipeout right={
                [{
                    text: '删除',
                    onPress: () => {
                        this.ontest(rowID)
                    },
                    backgroundColor: 'red',
                }]
            }
                autoClose={true}
                sectionID={sectionID}
                close={!(this.state.sectionID === sectionID && this.state.rowID === rowID)}
                backgroundColor={'#F5FCFF'}>
                <TouchableOpacity
                    onPress={() => navigate('Read', {
                        bookNum: booklist.indexOf(rowData),
                    })}>
                    <View style={{
                        height: 52
                    }}>
                        <Text style={styles.rowStyle}>
                            <Text style={{ fontSize: 15, }}>{rowData.bookName}</Text>
                            <Text style={styles.latestChapter}>{`    ${rowData.latestChapter}`}</Text>
                        </Text>

                    </View>
                </TouchableOpacity>
            </Swipeout>
        );
    }
    _renderSeparator = () => {
        return (<View style={styles.solid} />);
    }
    _onRefresh = (PullRefresh) => {
        getNet.refreshChapter(booklist, () => {
            RefreshCount++;
            if (RefreshCount != booklist.length) return;
            this.setState({
                dataSource: new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2
                }).cloneWithRows(booklist)
            }, () => {
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
                        renderScrollComponent={(props) => <PullRefreshScrollView onRefresh={(PullRefresh) => this._onRefresh(PullRefresh)} {...props} />}
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
        backgroundColor: '#F5FCFF'
    },
    rowStyle: {
        marginTop: 18,
        marginLeft: 20,
    },
    latestChapter: {
        paddingLeft: 20,
        fontSize: 12,
        color: '#999999'
    },
    solid: {
        height: 1,
        backgroundColor: '#8a8a8a'
    }
});
