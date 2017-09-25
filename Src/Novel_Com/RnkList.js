import { StyleSheet, Text, View, ListView, TextInput, TouchableOpacity, Alert, InteractionManager } from 'react-native';
import React, { Component } from 'react';


export default class RnkList extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.getNet = this.getNet.bind(this);

        this.state = {
            dataSource: '',
        };
    }

    componentDidMount() {
        this.getNet();

    }

    getNet(page = 1) {
        let url = `http://testdb.leanapp.cn/rnklist?p=${page}`;
        axios.get(url, { timeout: 5000 }).then(Response => {
            let data = Response.data;
            this.setState({
                dataSource: data,
            });
        })
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity
                onPress={() => { alert('wait to be added') }}>
                <View style={{
                    height: 70
                }}>
                    <Text style={styles.rowStyle}>
                        {`[${rowData.type}]  ${rowData.name} - ${rowData.author}\n${rowData.latestChapter}`}
                    </Text>

                </View>
            </TouchableOpacity>
        );
    }

    _renderSeparator() {
        return (<View style={styles.solid} />);
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    style={{
                        flex: 1
                    }}
                    dataSource={new ListView.DataSource({
                        rowHasChanged: (r1, r2) => r1 !== r2
                    }).cloneWithRows(this.state.dataSource)}
                    renderSeparator={this._renderSeparator}
                    renderRow={this._renderRow}
                    enableEmptySections={true} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 7,
        marginRight: 7,
        padding: 2,
    },
    text: {
        flex: 1,
    },
    solid: {
        height: 1,
        backgroundColor: '#969696',
        marginLeft: 15,
        marginRight: 20
    },
    rowStyle: {
        marginTop: 18,
        marginLeft: 20,
        fontSize: 15,
    },
});
