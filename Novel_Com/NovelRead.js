import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';

import Toast, { DURATION } from 'react-native-easy-toast'

import ViewPager from '../viewPager_Re/ViewPager';
import DialogSelected from '../util/popMenu';
import getContextArr from '../util/getContextArr';
import Readeitems from './items/Readitems';
import Navigat from './items/Navigat';

import async from 'async';

var q = async.queue(function (url, callback) {
    fetchList(url, () => {
        callback(null);
    });
}, 5)

q.drain = function () {
    tht.refs.toast.show(`Task finished`);
    tht.setState({hintText:''});
    finishTask = 0;
    DeviceStorage.save(bookPlant, tht.state.chapterMap);
}

function fetchList(nurl, callback) {
    let n = 100 * (finishTask / allTask) >> 0; //取整
    if (n % 1 === 0) {
        tht.setState({hintText:`Task process:${n}%`});
    }
    if (tht.state.chapterMap[nurl] !== undefined) {
        finishTask++;
        callback(); return;
    } else {
        let url = 'http://testdb.leanapp.cn/Analy_x?action=2&url=' + nurl;
        tht._fetch(fetch(url), 5000).then((Response) => Response.json()).then(responseData => {
            tht.state.chapterMap[nurl] = responseData;
            finishTask++;
            callback();
        }).catch((Error) => {
            console.warn(Error);
            callback();
        }).done();
    }

}

var allTask = 0, finishTask = 0;

var tht, bookPlant, booklist;
var { height, width } = Dimensions.get('window');

export default class NovelRead extends Component {
    _dia;
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
            SMode: true,
            hintText:'',
        };
        DeviceStorage.get('SMode').then(val => {
            if (val !== null) {
                this.setState({ SMode: val });
            }
        });
        bookPlant = this.state.currentBook.bookName + '_'
            + this.state.currentBook.plantformId;
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
        }).then(() => {
            if (this.state.currentBook.recordChapter === '') {
                let tg = this.state.currentBook.bookName + '_list';
                console.log(tg);
                DeviceStorage.get(tg).then(val => {
                    console.log(val);
                    if (val === null) {//没有获取章节列表的情况
                        this.refs.toast.show('请获取一遍章节列表再重新进入。');
                    } else {
                        this.state.currentBook.recordChapter = val[val.length - 1].key;
                    }
                }).then(() => {
                    this.getNet(this.state.currentBook.recordChapter, 0);
                    booklist[this.state.currentNum].recordPage = 1;//修复进入章节后从目录进入新章节页数记录不正确的bug
                })
            } else {
                this.getNet(this.state.currentBook.recordChapter, 0);
                booklist[this.state.currentNum].recordPage = 1;//修复进入章节后从目录进入新章节页数记录不正确的bug
            }

        })
    }

    showAlertSelected = () => {
        this._dia.show("缓存多少章？", ["后面50章", "后面全部"], '#333333', this.callbackSelected);
    }
    // 回调
    callbackSelected = (i) => {
        switch (i) {
            case 0: // 50章
                this.download_Chapter(); //true 表示是50章，false是缓存剩下的全部 
                break;
            case 1: // 之后全部
                this.download_Chapter(false);
                break;
        }
    }

    download_Chapter = (flag = true) => {//默认是缓存50章
        DeviceStorage.get(this.state.currentBook.bookName + '_list').then(val => {
            let ChaptUrl = booklist[this.state.currentNum].recordChapter;
            let i = 0, j = val.length;
            while (i < j) {
                if (val[i].key === ChaptUrl) {
                    break;
                }
                i++;
            }
            let End = flag ? (i >= 50 ? i - 50 : 0) : (0);
            allTask = i - End;
            for (let n = End; n < i; n++) {
                q.push(val[n].key);
            }
        })
    }

    _renderPage = (data, pageID) => {
        return (
            <Readeitems
                title={this.state.test.title}
                SMode={this.state.SMode}
                data={data}
                presPag={Number(pageID) + 1}
                totalPage={totalPage}
                hintText={this.state.hintText}
            ></Readeitems>
        );
    }

    _fetch(fetch_promise, timeout) {
        var abort_fn = null;
        var abort_promise = new Promise(function (resolve, reject) {
            abort_fn = function () {
                reject('Time out');
            };
        });
        var abortable_promise = Promise.race([
            fetch_promise,
            abort_promise
        ]);
        setTimeout(function () {
            abort_fn();
        }, timeout);

        return abortable_promise;
    }

    getNet = (nurl, direct) => {
        booklist[this.state.currentNum].recordChapter = nurl;
        DeviceStorage.save('booklist', booklist);
        if (this.state.chapterMap[nurl] === undefined) {
            // console.log('fetch...')
            let url = 'http://testdb.leanapp.cn/Analy_x?action=2&url=' + nurl;//this.state.test.next

            this._fetch(fetch(url), 5000).then((Response) => Response.json()).then(responseData => {
                this.setState({
                    test: responseData,
                    loadFlag: false,
                    Gpag: direct,
                }, () => {
                    this.state.chapterMap[nurl] = responseData;
                    DeviceStorage.save(bookPlant, this.state.chapterMap);
                });
            }).catch((Error) => {
                let epp = { title: "网络连接超时", content: "网络连接超时.", prev: "error", next: "error" }
                this.setState({
                    test: epp,
                    loadFlag: false,
                    Gpag: direct,
                });
                //  console.warn(Error);
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
        } else {
            this.refs.toast.show('已经是最后一章。');
            return -1;
        }
        return 0;
    }
    _getPrevPage = () => {
        if (tht.state.test.prev.indexOf('.html') !== -1) {//防止翻页越界
            tht.setState({ loadFlag: true }, () => {
                tht.getNet(tht.state.test.prev, -1);
            });
        } else {
            this.refs.toast.show('已经是第一章。');
        }
    }
    _clickBoard = () => {
        let flag = this.state.menuF;
        this.setState({ menuF: !flag });
    }

    _SMode_Change = () => {
        console.log('_Smode.change');

        let s = tht.state.SMode;

        tht.setState({ SMode: !s }, () => {
            DeviceStorage.save('SMode', !s);
        });
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
    }

    render() {
        return (
            <View style={[styles.container, this.state.SMode ? (styles.SunnyMode_container) : (styles.MoonMode_container)]}>

                <StatusBar
                    barStyle="light-content"
                    hidden={!this.state.menuF}
                    animation={true}
                ></StatusBar>

                {this.state.menuF ? (
                    <Navigat
                        urlx={this.state.currentBook.url}
                        currentChapter={this.state.currentBook.recordChapter}
                        navigation={this.props.navigation}
                        bname={this.state.currentBook.bookName}
                        choose={1}
                        getChapterUrl={this._getChapterUrl}
                    />
                ) : (false)}

                {this.state.loadFlag ? (
                    <Text style={[styles.centr, this.state.SMode ? (false) : (styles.MoonMode_text)]}>
                        Loading...</Text>) :
                    (<ViewPager
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
                        Gpag={this.state.Gpag} />)}
                <Toast ref="toast" />
                <DialogSelected ref={(c) => this._dia = c} />
                {this.state.menuF ? (
                    <Navigat
                        navigation={this.props.navigation}
                        showAlertSelected={this.showAlertSelected}
                        SModeChange={this._SMode_Change}
                        choose={2}
                    />
                ) : (false)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centr: {
        marginTop: 35,
        textAlign: 'center',
        fontSize: 18,
    },
    SunnyMode_container: {
        backgroundColor: '#acc7a7',
    },
    MoonMode_container: {
        backgroundColor: '#0F0F0F',
    },
    MoonMode_text: {
        color: '#595959',
    },
    container: {
        flex: 1,
    },

    cancel: {
        height: 36,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 7,
    }

});
