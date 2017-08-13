import { AppRegistry, StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import React from 'react';

const window = Dimensions.get('window');

export default class Menu extends React.PureComponent {
    leanMore=()=>{
        const sturl = 'http://testdb.leanapp.cn/start?h=2';//运转2小时
        fetch(sturl).then(res => {
            console.log(res);
            alert('Study at 2 hours');
        }).catch((Error) => {
            console.warn(Error);
        }).done();
    }

    Search=()=>{
        alert('Study hard,day day up!');
    }

    render() {
        return (
            <View style={styles.menu}>
                <Text style={styles.item} onPress={this.leanMore}>Learn More</Text>
                <Text style={styles.item} onPress={this.Search}>Search</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        width: window.width,
        height: window.height,
        backgroundColor: '#222222',
        padding: 10,
    },
    item: {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 10,
        padding:8,
        marginBottom:7,
        marginRight:10,
        color: '#EBEBEB',
        backgroundColor:'#2c2c2c'
    }
});
