import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View,Dimensions,StatusBar,Button} from 'react-native';


import ViewPager from '../viewPager_Re/ViewPager';
import getContextArr from '../util/getContextArr';
import Readeitems from './items/Readitems';
import Navigat from './items/Navigat';

import dateFormat from 'dateformat';

var {height, width} = Dimensions.get('window');
export default class NovelRead extends Component {
    constructor(props) {
        super(props);
        that = this;
        this.getNet = this.getNet.bind(this);
        urnl = props.navigation.state.params.url;
        console.log(urnl);
        totalPage = 0;//总的页数
        this.state = {
            loadFlag:true, //判断是出于加载状态还是显示状态
            test:'', //作为章节内容的主要获取来源。
            menuF:false, //判断导航栏是否应该隐藏
            Gpag:0, //判断是前往上一章（-1）还是下一章（1）
        };
        this.getNet(urnl,1); //将拿到的url经过服务器解析，设置test
    }

    _renderPage(data, pageID) {
        return (
            <Readeitems
            title={this.state.test.title}
            data={data}
            presPag = {Number(pageID)+1}
            totalPage={totalPage}
            ></Readeitems>
        );
    }

    getNet(nurl,direct) {
        let url = 'http://testdb.leanapp.cn/Analy_x?action=2&url='+nurl;//this.state.test.next
        fetch(url).then((Response) => Response.json()).then(responseData => {
            console.log(responseData.title);
            this.setState({
                test:responseData,
                loadFlag:false,
                Gpag:direct,
            });

        }).catch((Error) => {
            console.warn(Error);
        }).done();
    }
    _getNextPage(){
        that.setState({loadFlag:true});
        that.getNet(that.state.test.next,1);
    }
    _getPrevPage(){
        that.setState({loadFlag:true});
        that.getNet(that.state.test.prev,-1);
    }
    _clickBoard(){
        let flag = this.state.menuF;
        this.setState({menuF:!flag});
    }

    render() {
        if(this.state.loadFlag===true){
            return(
                <View style={styles.container}>
                    <Text style={styles.centr}>Loading...</Text>
                </View>
            );
        }else{
            let urlx = 'http://www.23us.com/html/65/65044';
            return (
            <View style={styles.container}>

                <StatusBar
                    barStyle="light-content"
                    hidden={!this.state.menuF}
                    animation={true}
                ></StatusBar>

                {this.state.menuF?(
                <Navigat
                navigation = {this.props.navigation}
                urlx = {urlx}
                bname = {this.props.navigation.state.params.name}
                choose={1}
                />
                ):(false)}

                <ViewPager
                dataSource={new ViewPager.DataSource({
                            pageHasChanged: (p1, p2) => p1 !== p2
                            }).cloneWithPages(getContextArr(this.state.test.content,width))}
                renderPage={this._renderPage.bind(this)}
                getNextPage={this._getNextPage.bind(this)}
                getPrevPage={this._getPrevPage.bind(this)}
                clickBoard={this._clickBoard.bind(this)}
                initialPage={0}
                isLoop={false}
                autoPlay={false}
                renderPageIndicator={false}
                Gpag={this.state.Gpag}/>

                {this.state.menuF?(
                <Navigat
                navigation = {this.props.navigation}
                choose={2}
                />
                ):(false)}

            </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    centr:{
        marginTop:35,
        textAlign:'center',
    },
    container:{
        flex:1,
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