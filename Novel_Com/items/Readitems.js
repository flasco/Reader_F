import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';

import dateFormat from 'dateformat';

export default class Readitems extends Component {
    Time = dateFormat(new Date(), "H:MM");
    presPag = this.props.presPag;
    totalPage = this.props.totalPage;
    data = this.props.data;
    title = this.props.title;
    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.title}</Text>
                <Text style={styles.textsize} numberOfLines={21}>{this.data}</Text>
                <View style={styles.bottView}>
                    <Text style={styles.bottom1}>{this.Time}</Text>
                    <Text style={styles.bottom2} >{this.presPag}/{this.totalPage} </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#acc7a7',
    },
    container1:{
        flex:1,
        backgroundColor: '#acc7a7',
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
    },
});