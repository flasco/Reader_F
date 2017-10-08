import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, AlertIOS, InteractionManager } from 'react-native';
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
];
/**
 * 搜索模块
 - code by Czq
 */
export default class SearchBook extends Component {
    constructor(props) {
        super(props);

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

    componentDidMount() {
        let bookNam = this.props.navigation.state.params.bookNam||'';
        console.log(bookNam);
        if(bookNam !== ''){
            this.setState({
                text:bookNam,
            },()=>{
                this.SearchBook(bookNam);
            });
        }
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
        });
    }

    _pressFunc(rowData) {
        AlertIOS.alert('提示', `你要把[${rowData.name}]添加到书架中吗？`, [
            {
              text: '取消',
              onPress: ()=>{ }
            },
            {
              text: '确认',
              onPress: () => this.props.navigation.state.params.addBook(rowData)
            },
          ]);
    }

    _renderRow(item) {
        let rowData = item.item;
        const { navigate } = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => { this._pressFunc(rowData); }}>
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

    _keyExtractor = (item, index) => item.url;

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
                    <FlatList
                    style={{
                        flex: 1
                    }}
                    data={this.state.dataSource}
                    renderItem={this._renderRow}
                    ItemSeparatorComponent={this._renderSeparator}
                    getItemLayout={(data, index) => ({ length: 52, offset: 53 * index, index })}//行高38，分割线1，所以offset=39
                    keyExtractor={this._keyExtractor}/>
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
