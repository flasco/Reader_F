import { StyleSheet, Text, View, ListView, TextInput, TouchableOpacity, Alert, InteractionManager } from 'react-native';
import React, { Component } from 'react';

var UrlId = [
    '23us',
    'qidian',
    'xs.la',
    'luoqiu',
    'biqiuge',
    'kanshuz',
    'qu.la',
    'xs.la',
]
/**
 * 搜索模块
 - code by Czq
 */
export default class SearchBook extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this._renderRow = this._renderRow.bind(this);
        this.SearchBook = this.SearchBook.bind(this);
        this._pressFunc = this._pressFunc.bind(this);
        this._renderSeparator = this._renderSeparator.bind(this);

        this.state = {
            text: '',
            dataSource: '',
            hint: '输入后点击 done 即可搜索书籍。',
        };
    }

    SearchBook(text) {
        let url = `http://testdb.leanapp.cn/sear?name=${text}`;
        axios.get(url, { timeout: 5000 }).then(Response => {
            let data = Response.data;
            if (data === 'error...') {
                this.setState({
                    dataSource: '',
                    hint: '无相关搜索结果。'
                });
            } else {
                this.setState({
                    dataSource: data,
                    hint: `搜索到${data.length}条相关数据。`
                });
            }
        })
    }

    _pressFunc(rowData) {
        Alert.alert(
            null,
            `你要把[${rowData.name}]添加到书架中吗？`,
            [
                {
                    text: 'Yes', onPress: () => InteractionManager.runAfterInteractions(() => {
                        this.props.navigation.state.params.addBook(rowData);
                    })
                },
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false });
    }

    _renderRow(rowData, sectionID, rowID) {
        const { navigate } = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => { this._pressFunc(rowData) }}>
                <View style={{
                    height: 52
                }}>
                    <Text style={styles.rowStyle}>
                        {`${rowData.name} - ${rowData.author}   ${UrlId[rowData.plantFormId - 1]}`}
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
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ text })}
                    placeholder={'请输入小说名'}
                    spellCheck={false}
                    returnKeyType={'done'}
                    onSubmitEditing={() => {
                        if (this.state.text !== '') {
                            this.SearchBook(this.state.text);
                        }
                    }}
                    value={this.state.text} />
                <Text style={styles.hint}>{this.state.hint}</Text>
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
    hint: {
        color: 'gray',
        fontSize: 12,
        textAlign: 'center',

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
