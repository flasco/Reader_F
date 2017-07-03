import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Button,
    TouchableOpacity,
    StatusBar
} from 'react-native';

export default class BookList extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows(['武林高手', '美食爱好者']),
            load: false
        };
    }
    componentDidMount() {
        // this.getNet();
    }
    _renderRow = (rowData) => {
        const {navigate} = this.props.navigation;
        var urlx = 'http://www.23us.com/html/65/65044/26566546.html';
        return (
            <TouchableOpacity
                onPress={() => navigate('Read', {
                url: urlx,
                name: rowData
            })}>
                <View style={{
                    height: 38
                }}>
                    <Text style={styles.rowStyle}>{rowData}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    _renderSeparator = () => {
        return (<View style={styles.solid}/>);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>
                <ListView
                    style={{
                    flex: 1
                }}
                    dataSource={this.state.dataSource}
                    renderSeparator={this._renderSeparator}
                    renderRow={this._renderRow}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#F5FCFF'
    },
    rowStyle: {
        marginTop: 12,
        marginLeft: 20
    },
    solid: {
        height: 1,
        backgroundColor: '#8a8a8a'
    }
});
