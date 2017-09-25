import { StyleSheet, Text, View, Dimensions, TouchableOpacity, InteractionManager } from 'react-native';
import React from 'react';

const window = Dimensions.get('window');

export default class Menu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.leanMore = this.leanMore.bind(this);
        this.CleanData = this.CleanData.bind(this);
    }
    leanMore() {
        const sturl = 'http://testdb.leanapp.cn/start?h=6';//运转6小时
        fetch(sturl).then(res => {
            alert('Server will run for 6 hours');
        }).catch((Error) => {
            // console.warn(Error);
        }).done();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.data !== this.props.data;
    }

    CleanData() {
        alert('除书架记录之外的数据已经全部清空');
        let booklist;
        DeviceStorage.get('booklist').then(val => {
            booklist = val;
        })
            .then(() => {
                DeviceStorage.cleanAll()
                    .then(() => {
                        DeviceStorage.save('booklist', booklist);
                    })
            });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.menu}>
                <TouchableOpacity onPress={() =>
                    navigate('Sear', { addBook: this.props.addBook })
                }>
                    <Text style={styles.item} >Search</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { alert('Still wait to add.') }}>
                    <Text style={styles.item} >RankList</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.leanMore}>
                    <Text style={styles.item} >Learn More</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.CleanData}>
                    <Text style={styles.item} >CleanAllData</Text>
                </TouchableOpacity>
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
        padding: 8,
        height: 42,
        marginBottom: 7,
        marginRight: 10,
        color: '#EBEBEB',
        backgroundColor: '#2c2c2c'
    }
});
