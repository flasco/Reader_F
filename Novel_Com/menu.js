import { AppRegistry, StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import React, { Component } from 'react';

const window = Dimensions.get('window');
const AvatarUri = "http://cdn-qn0.jianshu.io/assets/default_avatar/3-9a2bcc21a5d89e21dafc73b39dc5f582.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240";
export default class Menu extends Component {
    static propTypes = {
        onItemSelected: React.PropTypes.func.isRequired,
    };
    render() {
        return (
            <View style={styles.menu}>
                <Text style={styles.item} onPress={()=>{alert('Study hard,day day up!')}}>Learn More</Text>
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
    avatarContainer: {
        marginBottom: 20,
        marginTop: 20
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 20,
    },
    item: {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 10,
        padding:8,
        marginBottom:7,
        color: '#EBEBEB',
        backgroundColor:'#2c2c2c'
    }
});
