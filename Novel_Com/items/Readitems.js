import React, {Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';

import dateFormat from 'dateformat';

export default class Readitems extends Component {
    hint = this.props.hintText;
    // shouldComponentUpdate(){
    //     if()
    //     return false;
    // }
    render(){
        return (
            <View style={[styles.container,this.props.SMode?(styles.SunnyMode_container):(styles.MoonMode_container)]}>
                <Text style={[styles.title,this.props.SMode?(styles.SunnyMode_Title):(styles.MoonMode_Title)]}>{this.props.title}</Text>
                <Text style={[styles.textsize,this.props.SMode?(styles.SunnyMode_text):(styles.MoonMode_text)]} numberOfLines={21}>{this.props.data}</Text>
                <View style={styles.bottView}>
                    <Text style={[styles.bottom1,this.props.SMode?(false):(styles.MoonMode_Bottom)]}>{dateFormat(new Date(), 'H:MM')}</Text>
                    <Text style={this.props.SMode?(false):(styles.MoonMode_Bottom)}>{this.hint}</Text>
                    <Text style={[styles.bottom2,this.props.SMode?(false):(styles.MoonMode_Bottom)]} >{this.props.presPag}/{this.props.totalPage} </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    SunnyMode_container:{
        backgroundColor: '#acc7a7',
    },
    SunnyMode_Title:{
        color:'#576457',
    },
    SunnyMode_text:{
        color:'#0d2a0f',
    },
    MoonMode_container:{
        backgroundColor: '#0F0F0F',
    },
    MoonMode_Title:{
        color:'#474747',
    },
    MoonMode_text:{
        color:'#595959',
    },
    MoonMode_Bottom:{
        color:'#424242',
    },
    container:{
        flex:1,
    },
    title:{
        marginTop:8,
        paddingLeft:20,
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
        textAlign:'justify',
        flex: 1,
        marginTop: 8,
        marginLeft: 22,
        fontSize: 23,
        fontStyle: 'normal',
        lineHeight: 37
    },
});