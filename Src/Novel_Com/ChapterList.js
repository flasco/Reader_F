import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Button } from 'react-native';
import urlTool from 'url'
var ChapterList, booklist;
/**
 * 书籍目录
 - code by Czq
 */
export default class NovelList extends Component {
    _FlatList; lengt = 1;
    static navigationOptions = ({ navigation }) => {
        return {
            title: `${navigation.state.params.name}`,
            //左上角的返回键文字
            headerBackTitle: ' ',
            //导航栏的style
            headerStyle: {
                backgroundColor: '#000'
            },
            headerRight: (
                <Button
                    title='gDwn'
                    onPress={() => {
                        that._FlatList.scrollToIndex({ viewPosition: 0.5, index: this.lengt });
                    }}
                    color='#fff'
                ></Button>
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

        this.getNet = this.getNet.bind(this);
        this._header = this._header.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderSeparator = this._renderSeparator.bind(this);

        this.state = {
            dataSource: '',
            load: false,
            currentCh: props.navigation.state.params.chap,
        };
    }

    componentDidMount() {
        booklist = this.props.navigation.state.params.bookChapterLst;
        DeviceStorage.get(booklist).then((val) => {
            if (val !== null) {
                let t_u = this.props.navigation.state.params.url;
                let hos1 = urlTool.parse(t_u).host;
                let hos2 = urlTool.parse(val[0].key).host;
                if (hos1 !== hos2) {
                    val = null;
                }
            }
            if (val === null) {
                ChapterList = [];
                DeviceStorage.save(booklist, ChapterList);
            } else {
                ChapterList = val;
            }
            this.getNet(this.props.navigation.state.params.url, () => {
                let chap = this.state.currentCh;
                let inx = 0, iny = this.state.dataSource.length;
                while (inx < iny) {
                    if (this.state.dataSource[inx].key === chap) {
                        break;
                    }
                    inx++;
                }
                setTimeout(() => {
                    that._FlatList.scrollToIndex({ viewPosition: 0.5, index: inx });
                }, 100);
            });
        })
    }

    getNet(nurl, callback) {
        if (ChapterList.length === 0) {
            let url = 'http://testdb.leanapp.cn/Analy_x?action=1&url=' + nurl;
            axios.get(url, { timeout: 5000 }).then(Response => {
                let data = Response.data.reverse();
                let n = [];
                let i = 0;
                while (i < data.length) {
                    n.push({
                        key: data[i].url,
                        title: (data[i].title.length > 25 ? data[i].title.substr(0, 18) + '...' : data[i].title)
                    });
                    i++;
                }
                ChapterList = n;
                DeviceStorage.save(booklist, ChapterList);
                lengt = i - 1;
                this.setState({
                    dataSource: n,
                    load: true
                }, () => {
                    callback();
                });
            }).catch((Error) => {
                // console.warn(Error);
            }).done();
        } else {
            lengt = ChapterList.length - 1;
            this.setState({
                dataSource: ChapterList,
                load: true
            }, () => {
                callback();
            });
        }
    }

    _renderItem(item) {
        let txt = item.item.title;
        let url = item.item.key;
        return (
            <TouchableOpacity style={{ height: 38 }}
                onPress={() => {
                    this.props.navigation.state.params.callback(url);
                    this.props.navigation.goBack();
                }}>
                <Text style={[styles.rowStyle, this.state.currentCh === url ? styles.red : false]}>{txt}</Text>
            </TouchableOpacity>
        );
    }

    _header() {
        return (
            <View>
                <Text style={styles.LatestChapter}>[最新章节]</Text>
                <View style={styles.solid} />
            </View>
        );
    }

    _renderSeparator() {
        return (
            <View style={styles.solid} />
        )
    }

    render() {
        if (this.state.load === true) {
            return (
                <View style={{ backgroundColor: '#D8D8D8', flex: 1 }}>
                    <FlatList
                        initialNumToRender={20}
                        ref={(c) => this._FlatList = c}
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this._header}
                        ItemSeparatorComponent={this._renderSeparator}
                        getItemLayout={(data, index) => ({ length: 38, offset: 39 * index, index })}//行高38，分割线1，所以offset=39
                    />
                </View>
            );
        } else {
            return (
                <Text style={styles.welcome}>Loading now.please wait.</Text>
            );
        }
    }
}
const styles = StyleSheet.create({
    LatestChapter: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        color: '#8a8a8a'
    },
    rowStyle: {
        marginTop: 12,
        marginLeft: 15,
        color: '#565656'
    },
    solid: {
        height: 1,
        backgroundColor: '#969696',
        marginLeft: 15,
        marginRight: 20
    },
    red: {
        color: '#AF3E28'
    },
    gDwn: {
        color: '#fff'
    }
});
