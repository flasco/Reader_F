import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View,Dimensions} from 'react-native';


import ViewPager from '../viewPager_Re/ViewPager'
import parseContent from '../util/parseContent';

import dateFormat from 'dateformat';


export default class NovelRead extends Component {
    constructor(props) {
        super(props);
        that = this;
        this.getNet = this.getNet.bind(this);
        totalPage = 0;
        this.state = {
            time:'05:20',
            loadFlag:true,
            currentPage:1,
            test:'',
            Gpag:0,
        }
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        this.setState({
            test:nextProps.test1,
            loadFlag:false,
        })
    }

    getContextArr(testT){
        let lineCount = 17;
        var {height, width} = Dimensions.get('window');
        lineWidth = Math.floor((width - 40) * 2 / 22); //22是字体大小，后来属性配置可以修改一下
        let lines = parseContent(testT, lineWidth);
        let testa = new Array();
        let pag ;//定义页数
        for(pag = 0;pag < 1000 ;pag++){
            testa[pag] = '';//初始化为文本类型
            let i = pag*lineCount,size;
            size = (pag+1)*lineCount>lines.length?  lines.length :  i+lineCount;

            for(;i< size ;i++){
                testa[pag] += lines[i]+'\n';
            }
            if(size == lines.length) break;
        }
        totalPage = pag+1;
        // console.log(testa);
        return testa ;
    }

    _renderPage(data, pageID) {
        let Time = dateFormat(new Date(), "H:MM");
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.state.test.title}</Text>
                <Text style={styles.textsize} numberOfLines={21}>{data}</Text>
                <View style={styles.bottView}>
                    <Text style={styles.bottom1}>{Time}</Text>
                    <Text style={styles.bottom2} >{Number(pageID)+1}/{totalPage} </Text>
                </View>
            </View>
        );
    }

    getNet(nurl,direct) {
        let url = "http://testdb.leanapp.cn/Analy_x?action=2&url="+nurl;//this.state.test.next
        fetch(url).then((Response) => Response.json()).then(responseData => {
            console.log(responseData.title);
            this.setState({
                test:responseData,
                loadFlag:false,
                Gpag:direct,
            })

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

    render() {
        if(this.state.loadFlag===true){
            return(
                <View style={styles.container}>
                    <Text style={styles.centr}>Loading...</Text>
                </View>
            );
        }else{
            return (
            <View style={styles.container}>
                <ViewPager
                dataSource={new ViewPager.DataSource({
                            pageHasChanged: (p1, p2) => p1 !== p2
                            }).cloneWithPages(this.getContextArr(this.state.test.content))}
                renderPage={this._renderPage.bind(this)}
                getNextPage={this._getNextPage.bind(this)}
                getPrevPage={this._getPrevPage.bind(this)}
                initialPage={0}
                isLoop={false}
                autoPlay={false}
                renderPageIndicator={false}
                Gpag={this.state.Gpag}/>
            </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    centr:{
        marginTop:35,
        textAlign:'center',
    },
    container:{
        flex:1,
        backgroundColor: '#acc7a7'
    },
    title:{
        marginTop:5,
        color:'#576457',
        paddingLeft:8,
    },
    bottom1:{
        flex:1,
        textAlign:'left',
        marginLeft:25,
    },
    bottom2:{
        flex:1,
        textAlign:'right',
        marginRight:25,
    },
    bottView:{
        flexDirection: 'row',
        marginBottom:21,
    },
    textsize: {
        color:'#0d2a0f',
        textAlign:'justify',
        flex: 1,
        marginTop: 8,
        marginLeft: 29,
        fontSize: 21,
        fontStyle: 'normal',
        lineHeight: 38
    }
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