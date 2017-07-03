import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View,Dimensions,Button} from 'react-native';


var {height, width} = Dimensions.get('window');
/**
 * 这个是自定义的StackNavigator导航栏
 * 用在了NovelRead.js中
 */
export default class Navigat extends Component {
    shouldComponentUpdate(){
        return false;//设置成静态组件，不用实时render
    }
    render(){
        if(this.props.choose===1){
            return(
                <View style = {styles.Navig}>
                        <View style={{flex:1,paddingTop:25}}>
                            <Button title="目录" 
                            color="#fff"
                                    onPress={()=>{
                                        this.props.navigation
                                        .navigate('ChaL',{
                                            url:this.props.urlx,name:this.props.bname,
                                            callback:(url)=>this.props.getChapterUrl(url)
                                        });
                                    }}/>
                        </View>
                        <View style={{flex:2}}></View>
                        <View style={{flex:1,paddingTop:25}}>
                            <Button title="返回" 
                                    color="#fff"
                                    onPress={()=>{this.props.navigation.goBack();}}/>
                        </View>
                    </View>
            );
        }else if(this.props.choose===2){
            return(
                <View style = {styles.Fotter}>
                    <View style={{flex:1,paddingTop:10}}>
                        <Button title="夜间模式" 
                        color="#fff"
                                onPress={()=>{this.props.navigation.goBack();}}/>
                    </View>
                    <View style={{flex:2}}></View>
                    <View style={{flex:1,paddingTop:10}}>
                        <Button title="设置" 
                                color="#fff"
                                onPress={()=>{this.props.navigation.goBack();}}/>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    Navig:{
        height:64,
        backgroundColor:'#000',
        zIndex:222,
        width: width,
        position:'absolute',
        top:0,
        flexDirection:'row'
    },
    Fotter:{
        height:50,
        backgroundColor:'#000',
        zIndex:222,
        width: width,
        position:'absolute',
        bottom:0,
        left:0,
        flexDirection:'row'
    },
});