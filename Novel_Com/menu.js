import { AppRegistry, StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import React from 'react';

const window = Dimensions.get('window');

export default class Menu extends React.PureComponent {
    leanMore=()=>{
        const sturl = 'http://testdb.leanapp.cn/start?h=6';//运转6小时
        fetch(sturl).then(res => {
            console.log(res);
            alert('Study at 6 hours');
        }).catch((Error) => {
            console.warn(Error);
        }).done();
    }

    Search=()=>{
        alert('Study hard,day day up!');
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.menu}>
                <Text style={styles.item} onPress={() => navigate('Sear',{addBook:this.props.addBook})}>Search</Text>
                <Text style={styles.item} onPress={this.leanMore}>Learn More</Text>
                <Text style={styles.item} onPress={()=>{alert('Still wait to add.')}}>CleanAllData</Text>
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
        fontSize: 15,
        fontWeight: '300',
        paddingTop: 10,
        padding:8,
        height:42,
        marginBottom:7,
        marginRight:10,
        color: '#EBEBEB',
        backgroundColor:'#2c2c2c'
    }
});
