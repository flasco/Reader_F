import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';

import ViewPager from '../viewPager_Re/ViewPager';
import getContextArr from '../util/getContextArr';
import Readeitems from './items/Readitems';
import Navigat from './items/Navigat';

var tht, bookPlant, booklist;
var { height, width } = Dimensions.get('window');

export default class NovelRead extends Component {
    constructor(props) {
        super(props);
        tht = this;
        totalPage = 0;//总的页数
        this.state = {
            currentBook: '',
            currentNum: props.navigation.state.params.bookNum,
            loadFlag: true, //判断是出于加载状态还是显示状态
            test: '', //作为章节内容的主要获取来源。
            menuF: false, //判断导航栏是否应该隐藏
            Gpag: 0, //判断是前往上一章（-1）还是下一章（1）
            chapterMap: new Map(),
        };
        bookPlant = this.state.currentBook.bookName + '_'
            + this.state.currentBook.plantformId;
        // DeviceStorage.clear(bookPlant);
        DeviceStorage.get('booklist').then(val => {
            booklist = val;
            this.setState({ currentBook: booklist[this.state.currentNum] });
        });

        DeviceStorage.get(bookPlant).then(val => {
            if (val === null) {
                console.log('检测书籍本地记录为空，为第一次打开本书');
                DeviceStorage.save(bookPlant, new Map());
            } else {
                this.setState({
                    chapterMap: val,
                });
            }
            this.getNet(this.state.currentBook.recordChapter, 0);
        });
    }

    _renderPage = (data, pageID) => {
        return (
            <Readeitems
                title={this.state.test.title}
                data={data}
                presPag={Number(pageID) + 1}
                totalPage={totalPage}
            ></Readeitems>
        );
    }

    getNet = (nurl, direct) => {
        booklist[this.state.currentNum].recordChapter = nurl;
        DeviceStorage.save('booklist', booklist);
        if (this.state.chapterMap[nurl] === undefined) {
            console.log('fetch...')
            let url = 'http://testdb.leanapp.cn/Analy_x?action=2&url=' + nurl;//this.state.test.next
            fetch(url).then((Response) => Response.json()).then(responseData => {
                this.setState({
                    test: responseData,
                    loadFlag: false,
                    Gpag: direct,
                }, () => {
                    this.state.chapterMap[nurl] = responseData;
                    DeviceStorage.save(bookPlant, this.state.chapterMap);
                });
            }).catch((Error) => {
                console.warn(Error);
            }).done();
        } else {
            this.setState({
                test: this.state.chapterMap[nurl],
                loadFlag: false,
                Gpag: direct,
            })
        }
    }
    _getNextPage = () => {
        if (tht.state.test.next.indexOf('.html') !== -1) {//防止翻页越界
            tht.setState({ loadFlag: true }, () => {
                tht.getNet(tht.state.test.next, 1)
            });
        }
    }
    _getPrevPage = () => {
        if (tht.state.test.prev.indexOf('.html') !== -1) {//防止翻页越界
            tht.setState({ loadFlag: true }, () => {
                tht.getNet(tht.state.test.prev, -1);
            });
        }
    }
    _clickBoard = () => {
        let flag = this.state.menuF;
        this.setState({ menuF: !flag });
    }
    _getChapterUrl = (urln) => {
        let url = urln;
        this.setState({
            loadFlag: true,
            menuF: false
        }, () => {
            tht.getNet(url, 1);
        });
    }
    _getCurrentPage = pag => {
        // console.log(pag)
        pag = pag === 0 ? 1 : pag;
        booklist[this.state.currentNum].recordPage = pag;
        DeviceStorage.save('booklist', booklist);
        // console.log('this pag is:'+pag);
    }

    render() {
        if (this.state.loadFlag === true) {
            return (
                <View style={styles.container}>
                    <Text style={styles.centr}>Loading...</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>

                    <StatusBar
                        barStyle="light-content"
                        hidden={!this.state.menuF}
                        animation={true}
                    ></StatusBar>

                    {this.state.menuF ? (
                        <Navigat
                            urlx={this.state.currentBook.url}
                            navigation={this.props.navigation}
                            bname={this.state.currentBook.bookName}
                            choose={1}
                            getChapterUrl={this._getChapterUrl}
                        />
                    ) : (false)}

                    <ViewPager
                        dataSource={new ViewPager.DataSource({
                            pageHasChanged: (p1, p2) => p1 !== p2
                        }).cloneWithPages(getContextArr(this.state.test.content, width))}
                        renderPage={this._renderPage}
                        getNextPage={this._getNextPage}
                        getPrevPage={this._getPrevPage}
                        getCurrentPage={this._getCurrentPage}
                        clickBoard={this._clickBoard}
                        initialPage={booklist[this.state.currentNum].recordPage - 1}
                        isLoop={false}
                        autoPlay={false}
                        renderPageIndicator={false}
                        Gpag={this.state.Gpag} />

                    {this.state.menuF ? (
                        <Navigat
                            navigation={this.props.navigation}
                            choose={2}
                        />
                    ) : (false)}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    centr: {
        marginTop: 35,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#acc7a7',
    },

});


// getContextArr1(testT) {
//     let line_ = 1;
//     let count = 0;
//     let tampleL = '';
//     let testa = [];
//     let n = 0;
//     for (let i = 0; i < testT.length; i++) {
//         if (line_ == 16) {//  ||(line_ == 16 && count == 16)
//             testa[n++] = tampleL.replace(/█/g, "    ");
//             tampleL = '';
//             line_ = 1;
//             count = 0;
//         }
//         let t = testT.charAt(i);

//         if (t == '█') {
//             count += 1;
//             tampleL += '██';
//             i += 1;
//         } else if (t == '\n') {
//             line_++;
//             count = 0;
//             tampleL += t;
//         } else if (t == '“' || t == '”' || t == '"') {
//             count+=0.5;
//             tampleL += t;
//         } else {
//             count++;
//             tampleL += t;
//         }
//         if (count >= 17) {
//             if(testT.charAt(i+1)=='\n') {
//                 tampleL += '\n';
//                 i++;
//             }
//             line_++;
//             count = 0;
//         }
//         if (i == testT.length - 1) {
//             testa[n] = tampleL.replace(/█/g, "    ");
//         }
//     }
//     totalPage = n+1;
//     return testa;
// }